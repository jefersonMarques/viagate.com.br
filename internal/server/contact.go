package server

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/mail"
	"net/url"
	"strings"
	"time"

	"github.com/viagate/site/internal/site"
)

const maxContactBody = 64 << 10

func (application *Application) submitContact(response http.ResponseWriter, request *http.Request) {
	if !application.rateLimiter.allow(request) {
		application.contactRedirect(response, request, "limited")
		return
	}
	if !application.hasValidOrigin(request) {
		application.contactRedirect(response, request, "invalid")
		return
	}

	request.Body = http.MaxBytesReader(response, request.Body, maxContactBody)
	if err := request.ParseForm(); err != nil {
		application.contactRedirect(response, request, "invalid")
		return
	}

	form := site.ContactForm{
		Name:     strings.TrimSpace(request.FormValue("name")),
		Email:    strings.TrimSpace(request.FormValue("email")),
		Company:  strings.TrimSpace(request.FormValue("company")),
		Phone:    strings.TrimSpace(request.FormValue("phone")),
		Message:  strings.TrimSpace(request.FormValue("message")),
		Interest: strings.TrimSpace(request.FormValue("interest")),
		Website:  strings.TrimSpace(request.FormValue("website")),
		Consent:  request.FormValue("consent") == "on",
	}

	if form.Website != "" {
		application.contactRedirect(response, request, "sent")
		return
	}
	if err := validateContact(form); err != nil {
		application.contactRedirect(response, request, "invalid")
		return
	}
	if !application.brevo.configured() {
		application.config.Logger.Error("Brevo contact email is not configured")
		application.contactRedirect(response, request, "unavailable")
		return
	}
	if err := application.brevo.sendContact(request.Context(), form); err != nil {
		application.config.Logger.Error("contact email delivery failed", "error", err)
		application.contactRedirect(response, request, "unavailable")
		return
	}

	if application.config.ContactWebhookURL != "" {
		if err := application.sendContactWebhook(request, form); err != nil {
			application.config.Logger.Warn("contact webhook delivery failed", "error", err)
		}
	}

	application.contactRedirect(response, request, "sent")
}

func validateContact(form site.ContactForm) error {
	if len(form.Name) < 2 || len(form.Name) > 100 {
		return errors.New("invalid name")
	}
	if len(form.Company) > 120 || len(form.Phone) > 40 || len(form.Message) > 3000 || len(form.Interest) > 100 {
		return errors.New("invalid field size")
	}
	parsedEmail, err := mail.ParseAddress(form.Email)
	if err != nil || len(form.Email) > 254 || parsedEmail.Address != form.Email {
		return errors.New("invalid email")
	}
	if !form.Consent {
		return errors.New("consent is required")
	}
	return nil
}

func (application *Application) hasValidOrigin(request *http.Request) bool {
	origin := request.Header.Get("Origin")
	if origin == "" {
		return true
	}
	parsedOrigin, err := url.Parse(origin)
	if err != nil {
		return false
	}
	expected, err := url.Parse(application.config.SiteURL)
	if err != nil {
		return false
	}
	return strings.EqualFold(parsedOrigin.Host, expected.Host) || strings.EqualFold(parsedOrigin.Host, request.Host)
}

func (application *Application) sendContactWebhook(request *http.Request, form site.ContactForm) error {
	payload := struct {
		Name      string `json:"name"`
		Email     string `json:"email"`
		Company   string `json:"company,omitempty"`
		Phone     string `json:"phone,omitempty"`
		Message   string `json:"message,omitempty"`
		Interest  string `json:"interest,omitempty"`
		Consent   bool   `json:"consent"`
		Source    string `json:"source"`
		CreatedAt string `json:"created_at"`
	}{
		Name: form.Name, Email: form.Email, Company: form.Company, Phone: form.Phone,
		Message: form.Message, Interest: form.Interest, Consent: form.Consent, Source: "viagate.com.br/contato",
		CreatedAt: time.Now().UTC().Format(time.RFC3339),
	}

	data, err := json.Marshal(payload)
	if err != nil {
		return fmt.Errorf("marshal webhook payload: %w", err)
	}
	webhookRequest, err := http.NewRequestWithContext(request.Context(), http.MethodPost, application.config.ContactWebhookURL, bytes.NewReader(data))
	if err != nil {
		return fmt.Errorf("create webhook request: %w", err)
	}
	webhookRequest.Header.Set("Content-Type", "application/json")

	client := &http.Client{Timeout: 8 * time.Second}
	webhookResponse, err := client.Do(webhookRequest)
	if err != nil {
		return fmt.Errorf("send webhook request: %w", err)
	}
	defer webhookResponse.Body.Close()
	_, _ = io.Copy(io.Discard, io.LimitReader(webhookResponse.Body, 4096))

	if webhookResponse.StatusCode < http.StatusOK || webhookResponse.StatusCode >= http.StatusMultipleChoices {
		return fmt.Errorf("webhook returned status %d", webhookResponse.StatusCode)
	}
	return nil
}

func (application *Application) contactRedirect(response http.ResponseWriter, request *http.Request, status string) {
	http.Redirect(response, request, "/contato?status="+url.QueryEscape(status), http.StatusSeeOther)
}

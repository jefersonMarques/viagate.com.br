package server

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"html/template"
	"io"
	"net/http"
	"strings"
	"time"

	"github.com/viagate/site/internal/site"
)

const defaultBrevoEmailEndpoint = "https://api.brevo.com/v3/smtp/email"

var contactEmailTemplate = template.Must(template.New("contact-email").Parse(`<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<title>{{.Subject}}</title>
</head>
<body style="margin:0;padding:24px;background:#f4f6f8;font-family:Arial,sans-serif;color:#102438;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:720px;margin:0 auto;background:#ffffff;border:1px solid #d9e0e5;">
<tr><td style="padding:24px;border-bottom:3px solid #ff6400;"><strong style="font-size:20px;">Novo contato via site</strong><div style="margin-top:6px;color:#667784;font-size:13px;">viagate.com.br/contato</div></td></tr>
<tr><td style="padding:24px;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="6" style="font-size:14px;">
<tr><td width="140" style="color:#667784;">Nome</td><td><strong>{{.Name}}</strong></td></tr>
<tr><td style="color:#667784;">E-mail</td><td>{{.Email}}</td></tr>
{{if .Company}}<tr><td style="color:#667784;">Empresa</td><td>{{.Company}}</td></tr>{{end}}
{{if .Phone}}<tr><td style="color:#667784;">Telefone</td><td>{{.Phone}}</td></tr>{{end}}
{{if .Interest}}<tr><td style="color:#667784;">Interesse</td><td>{{.Interest}}</td></tr>{{end}}
<tr><td style="color:#667784;">Consentimento</td><td>Confirmado</td></tr>
<tr><td style="color:#667784;">Recebido em</td><td>{{.CreatedAt}}</td></tr>
</table>
{{if .Message}}<div style="margin-top:24px;padding-top:20px;border-top:1px solid #e4e9ed;"><div style="margin-bottom:8px;color:#667784;font-size:13px;font-weight:700;">Mensagem</div><div style="white-space:pre-wrap;line-height:1.6;">{{.Message}}</div></div>{{end}}
</td></tr>
</table>
</body>
</html>`))

type brevoClient struct {
	apiKey         string
	senderName     string
	senderEmail    string
	recipientEmail string
	subject        string
	endpoint       string
	httpClient     *http.Client
}

type contactEmailData struct {
	Subject   string
	Name      string
	Email     string
	Company   string
	Phone     string
	Interest  string
	Message   string
	CreatedAt string
}

type brevoAddress struct {
	Email string `json:"email"`
	Name  string `json:"name,omitempty"`
}

type brevoEmailPayload struct {
	Sender      brevoAddress   `json:"sender"`
	To          []brevoAddress `json:"to"`
	ReplyTo     brevoAddress   `json:"replyTo"`
	Subject     string         `json:"subject"`
	HTMLContent string         `json:"htmlContent"`
	Tags        []string       `json:"tags,omitempty"`
}

func newBrevoClient(config Config) *brevoClient {
	return &brevoClient{
		apiKey:         strings.TrimSpace(config.BrevoAPIKey),
		senderName:     strings.TrimSpace(config.BrevoContactName),
		senderEmail:    strings.TrimSpace(config.BrevoContactSender),
		recipientEmail: strings.TrimSpace(config.ContactEmail),
		subject:        strings.TrimSpace(config.BrevoContactSubject),
		endpoint:       defaultBrevoEmailEndpoint,
		httpClient:     &http.Client{Timeout: 8 * time.Second},
	}
}

func (client *brevoClient) configured() bool {
	return client != nil &&
		client.apiKey != "" &&
		client.senderName != "" &&
		client.senderEmail != "" &&
		client.recipientEmail != "" &&
		client.subject != ""
}

func (client *brevoClient) sendContact(ctx context.Context, form site.ContactForm) error {
	if !client.configured() {
		return errors.New("brevo contact email is not configured")
	}

	htmlContent, err := renderContactEmail(client.subject, form)
	if err != nil {
		return fmt.Errorf("render contact email: %w", err)
	}

	payload := brevoEmailPayload{
		Sender:      brevoAddress{Name: client.senderName, Email: client.senderEmail},
		To:          []brevoAddress{{Email: client.recipientEmail}},
		ReplyTo:     brevoAddress{Name: form.Name, Email: form.Email},
		Subject:     client.subject,
		HTMLContent: htmlContent,
		Tags:        []string{"website-contact"},
	}

	data, err := json.Marshal(payload)
	if err != nil {
		return fmt.Errorf("marshal Brevo payload: %w", err)
	}

	brevoRequest, err := http.NewRequestWithContext(ctx, http.MethodPost, client.endpoint, bytes.NewReader(data))
	if err != nil {
		return fmt.Errorf("create Brevo request: %w", err)
	}
	brevoRequest.Header.Set("Accept", "application/json")
	brevoRequest.Header.Set("Content-Type", "application/json")
	brevoRequest.Header.Set("api-key", client.apiKey)

	brevoResponse, err := client.httpClient.Do(brevoRequest)
	if err != nil {
		return fmt.Errorf("send Brevo request: %w", err)
	}
	defer brevoResponse.Body.Close()
	_, _ = io.Copy(io.Discard, io.LimitReader(brevoResponse.Body, 4096))

	if brevoResponse.StatusCode < http.StatusOK || brevoResponse.StatusCode >= http.StatusMultipleChoices {
		return fmt.Errorf("Brevo returned status %d", brevoResponse.StatusCode)
	}

	return nil
}

func renderContactEmail(subject string, form site.ContactForm) (string, error) {
	var output bytes.Buffer
	data := contactEmailData{
		Subject:   subject,
		Name:      form.Name,
		Email:     form.Email,
		Company:   form.Company,
		Phone:     form.Phone,
		Interest:  form.Interest,
		Message:   form.Message,
		CreatedAt: time.Now().Format("02/01/2006 15:04:05 -07:00"),
	}
	if err := contactEmailTemplate.Execute(&output, data); err != nil {
		return "", err
	}
	return output.String(), nil
}

package server

import (
	"net/http"
	"net/http/httptest"
	"net/url"
	"strings"
	"testing"

	"github.com/viagate/site/internal/site"
)

func TestSubmitContactSendsEmailThroughBrevo(t *testing.T) {
	brevoServer := httptest.NewServer(http.HandlerFunc(func(response http.ResponseWriter, request *http.Request) {
		response.WriteHeader(http.StatusCreated)
	}))
	defer brevoServer.Close()

	application := newTestApplication()
	application.brevo = newBrevoClient(Config{
		BrevoAPIKey:         "test-api-key",
		BrevoContactName:    "ViaGate",
		BrevoContactSubject: "Contato via site",
		BrevoContactSender:  "no_reply@viagate.com.br",
		ContactEmail:        "contato@viagate.com.br",
	})
	application.brevo.endpoint = brevoServer.URL
	application.brevo.httpClient = brevoServer.Client()

	form := url.Values{
		"name":     {"Maria Teste"},
		"email":    {"maria@example.com"},
		"company":  {"Empresa Teste"},
		"phone":    {"+55 41 99999-9999"},
		"message":  {"Gostaria de uma demonstração."},
		"interest": {"cargo-score"},
		"consent":  {"on"},
	}
	request := httptest.NewRequest(http.MethodPost, "/contato", strings.NewReader(form.Encode()))
	request.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	request.Header.Set("Origin", "https://viagate.com.br")
	request.RemoteAddr = "198.51.100.20:49152"
	response := httptest.NewRecorder()

	application.Handler().ServeHTTP(response, request)

	if response.Code != http.StatusSeeOther {
		t.Fatalf("expected status 303, got %d", response.Code)
	}
	if location := response.Header().Get("Location"); location != "/contato?status=sent" {
		t.Fatalf("unexpected redirect: %s", location)
	}
}

func TestSubmitContactFailsClosedWithoutBrevoConfiguration(t *testing.T) {
	application := newTestApplication()
	form := url.Values{
		"name":    {"Maria Teste"},
		"email":   {"maria@example.com"},
		"message": {"Gostaria de uma demonstração."},
		"consent": {"on"},
	}
	request := httptest.NewRequest(http.MethodPost, "/contato", strings.NewReader(form.Encode()))
	request.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	request.RemoteAddr = "198.51.100.21:49152"
	response := httptest.NewRecorder()

	application.Handler().ServeHTTP(response, request)

	if response.Code != http.StatusSeeOther {
		t.Fatalf("expected status 303, got %d", response.Code)
	}
	if location := response.Header().Get("Location"); location != "/contato?status=unavailable" {
		t.Fatalf("unexpected redirect: %s", location)
	}
}

func TestSubmitContactRejectsInvalidOrigin(t *testing.T) {
	application := newTestApplication()
	form := url.Values{
		"name":    {"Maria Teste"},
		"email":   {"maria@example.com"},
		"message": {"Gostaria de uma demonstração."},
		"consent": {"on"},
	}
	request := httptest.NewRequest(http.MethodPost, "/contato", strings.NewReader(form.Encode()))
	request.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	request.Header.Set("Origin", "https://example.com")
	request.RemoteAddr = "198.51.100.22:49152"
	response := httptest.NewRecorder()

	application.Handler().ServeHTTP(response, request)

	if location := response.Header().Get("Location"); location != "/contato?status=invalid" {
		t.Fatalf("unexpected redirect: %s", location)
	}
}

func TestValidateContactRejectsDisplayNameEmail(t *testing.T) {
	err := validateContact(site.ContactForm{
		Name:    "Maria Teste",
		Email:   "Maria <maria@example.com>",
		Consent: true,
	})
	if err == nil {
		t.Fatal("expected display-name email to be rejected")
	}
}

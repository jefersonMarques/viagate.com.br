package server

import (
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	"github.com/viagate/site/internal/site"
)

func TestBrevoClientSendContact(t *testing.T) {
	var received brevoEmailPayload
	server := httptest.NewServer(http.HandlerFunc(func(response http.ResponseWriter, request *http.Request) {
		if request.Method != http.MethodPost {
			t.Errorf("expected POST, got %s", request.Method)
		}
		if request.Header.Get("api-key") != "test-api-key" {
			t.Error("Brevo API key header was not sent")
		}
		if request.Header.Get("Content-Type") != "application/json" {
			t.Errorf("unexpected content type: %s", request.Header.Get("Content-Type"))
		}
		if err := json.NewDecoder(request.Body).Decode(&received); err != nil {
			t.Errorf("decode Brevo payload: %v", err)
			response.WriteHeader(http.StatusBadRequest)
			return
		}
		response.WriteHeader(http.StatusCreated)
	}))
	defer server.Close()

	client := newBrevoClient(Config{
		BrevoAPIKey:         "test-api-key",
		BrevoContactName:    "ViaGate",
		BrevoContactSubject: "Contato via site",
		BrevoContactSender:  "no_reply@viagate.com.br",
		ContactEmail:        "contato@viagate.com.br",
	})
	client.endpoint = server.URL
	client.httpClient = server.Client()
	client.httpClient.Timeout = time.Second

	form := site.ContactForm{
		Name:     "Maria Teste",
		Email:    "maria@example.com",
		Company:  "Empresa Teste",
		Phone:    "+55 41 99999-9999",
		Interest: "cargo-score",
		Message:  "Preciso de informações <script>alert('x')</script>",
		Consent:  true,
	}

	if err := client.sendContact(context.Background(), form); err != nil {
		t.Fatalf("send contact email: %v", err)
	}

	if received.Sender.Email != "no_reply@viagate.com.br" || received.Sender.Name != "ViaGate" {
		t.Fatalf("unexpected sender: %+v", received.Sender)
	}
	if len(received.To) != 1 || received.To[0].Email != "contato@viagate.com.br" {
		t.Fatalf("unexpected recipient: %+v", received.To)
	}
	if received.ReplyTo.Email != form.Email || received.ReplyTo.Name != form.Name {
		t.Fatalf("unexpected reply-to: %+v", received.ReplyTo)
	}
	if received.Subject != "Contato via site" {
		t.Fatalf("unexpected subject: %s", received.Subject)
	}
	if strings.Contains(received.HTMLContent, "<script>") {
		t.Fatal("contact HTML contains unescaped user markup")
	}
	if !strings.Contains(received.HTMLContent, "&lt;script&gt;") {
		t.Fatal("contact HTML does not contain escaped user markup")
	}
}

func TestBrevoClientRejectsNonSuccessResponse(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(response http.ResponseWriter, request *http.Request) {
		response.WriteHeader(http.StatusBadRequest)
	}))
	defer server.Close()

	client := newBrevoClient(Config{
		BrevoAPIKey:         "test-api-key",
		BrevoContactName:    "ViaGate",
		BrevoContactSubject: "Contato via site",
		BrevoContactSender:  "no_reply@viagate.com.br",
		ContactEmail:        "contato@viagate.com.br",
	})
	client.endpoint = server.URL
	client.httpClient = server.Client()

	err := client.sendContact(context.Background(), site.ContactForm{
		Name:  "Maria Teste",
		Email: "maria@example.com",
	})
	if err == nil {
		t.Fatal("expected Brevo non-success response to return an error")
	}
}

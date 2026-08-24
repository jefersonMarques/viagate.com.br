package server

import (
	"io"
	"log/slog"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

func TestPublicRoutes(t *testing.T) {
	application := newTestApplication()
	tests := []struct {
		path        string
		status      int
		contentType string
	}{
		{path: "/", status: http.StatusOK, contentType: "text/html"},
		{path: "/solucoes", status: http.StatusOK, contentType: "text/html"},
		{path: "/solucoes/biometria-facial", status: http.StatusOK, contentType: "text/html"},
		{path: "/analises", status: http.StatusOK, contentType: "text/html"},
		{path: "/analises/biometria-facial-prova-de-vida", status: http.StatusOK, contentType: "text/html"},
		{path: "/blog", status: http.StatusOK, contentType: "text/html"},
		{path: "/termos-uso-politica-privacidade", status: http.StatusOK, contentType: "text/html"},
		{path: "/llms.txt", status: http.StatusOK, contentType: "text/plain"},
		{path: "/llms-full.txt", status: http.StatusOK, contentType: "text/plain"},
		{path: "/.well-known/security.txt", status: http.StatusOK, contentType: "text/plain"},
		{path: "/sitemap.xml", status: http.StatusOK, contentType: "application/xml"},
		{path: "/rota-inexistente", status: http.StatusNotFound, contentType: "text/html"},
	}

	for _, test := range tests {
		t.Run(test.path, func(t *testing.T) {
			request := httptest.NewRequest(http.MethodGet, test.path, nil)
			response := httptest.NewRecorder()
			application.Handler().ServeHTTP(response, request)
			if response.Code != test.status {
				t.Fatalf("expected status %d, got %d", test.status, response.Code)
			}
			if !strings.Contains(response.Header().Get("Content-Type"), test.contentType) {
				t.Fatalf("unexpected content type: %s", response.Header().Get("Content-Type"))
			}
			if response.Header().Get("X-Content-Type-Options") != "nosniff" {
				t.Fatal("security headers were not applied")
			}
		})
	}
}

func TestLegacyRouteRedirect(t *testing.T) {
	application := newTestApplication()
	request := httptest.NewRequest(http.MethodGet, "/cargo-score", nil)
	response := httptest.NewRecorder()
	application.Handler().ServeHTTP(response, request)
	if response.Code != http.StatusMovedPermanently {
		t.Fatalf("expected permanent redirect, got %d", response.Code)
	}
	if response.Header().Get("Location") != "/solucoes/pesquisa-cadastral-de-motoristas" {
		t.Fatalf("unexpected redirect target: %s", response.Header().Get("Location"))
	}
}

func TestLegalRouteRedirects(t *testing.T) {
	application := newTestApplication()
	tests := []struct {
		path     string
		location string
	}{
		{path: "/termos-de-uso", location: "/termos-uso-politica-privacidade#termos-de-uso"},
		{path: "/politica-de-privacidade", location: "/termos-uso-politica-privacidade#politica-de-privacidade"},
	}

	for _, test := range tests {
		t.Run(test.path, func(t *testing.T) {
			request := httptest.NewRequest(http.MethodGet, test.path, nil)
			response := httptest.NewRecorder()
			application.Handler().ServeHTTP(response, request)
			if response.Code != http.StatusMovedPermanently {
				t.Fatalf("expected permanent redirect, got %d", response.Code)
			}
			if response.Header().Get("Location") != test.location {
				t.Fatalf("unexpected redirect target: %s", response.Header().Get("Location"))
			}
		})
	}
}

func newTestApplication() *Application {
	return New(Config{
		Address:     ":8090",
		Environment: "test",
		SiteURL:     "https://viagate.com.br",
		Logger:      slog.New(slog.NewTextHandler(io.Discard, nil)),
	})
}

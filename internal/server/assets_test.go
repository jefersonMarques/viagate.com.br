package server

import (
	"io"
	"log/slog"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestProductionAssetsUseRevalidatingCache(t *testing.T) {
	application := New(Config{
		Address:     ":8090",
		Environment: "production",
		SiteURL:     "https://viagate.com.br",
		Logger:      slog.New(slog.NewTextHandler(io.Discard, nil)),
	})
	request := httptest.NewRequest(http.MethodGet, "/assets/css/site.css", nil)
	response := httptest.NewRecorder()

	application.Handler().ServeHTTP(response, request)

	if response.Code != http.StatusOK {
		t.Fatalf("expected asset status 200, got %d", response.Code)
	}
	if cacheControl := response.Header().Get("Cache-Control"); cacheControl != "public, max-age=3600, must-revalidate" {
		t.Fatalf("unexpected cache control: %s", cacheControl)
	}
}

func TestApplicationDoesNotCompressResponses(t *testing.T) {
	application := newTestApplication()
	request := httptest.NewRequest(http.MethodGet, "/", nil)
	request.Header.Set("Accept-Encoding", "gzip, br")
	response := httptest.NewRecorder()

	application.Handler().ServeHTTP(response, request)

	if encoding := response.Header().Get("Content-Encoding"); encoding != "" {
		t.Fatalf("application should delegate compression to proxy, got %s", encoding)
	}
}

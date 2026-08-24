package server

import (
	"encoding/xml"
	"io"
	"log/slog"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/viagate/site/internal/content"
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

func TestSitemapContainsAllIndexableRoutes(t *testing.T) {
	application := newTestApplication()
	request := httptest.NewRequest(http.MethodGet, "/sitemap.xml", nil)
	response := httptest.NewRecorder()
	application.Handler().ServeHTTP(response, request)

	if response.Code != http.StatusOK {
		t.Fatalf("expected sitemap status 200, got %d", response.Code)
	}

	var sitemap sitemapURLSet
	if err := xml.Unmarshal(response.Body.Bytes(), &sitemap); err != nil {
		t.Fatalf("invalid sitemap XML: %v", err)
	}

	locations := make(map[string]bool, len(sitemap.URLs))
	for _, item := range sitemap.URLs {
		if locations[item.Location] {
			t.Fatalf("duplicate sitemap URL: %s", item.Location)
		}
		locations[item.Location] = true
	}

	const baseURL = "https://viagate.com.br"
	expectedPaths := []string{
		"/",
		"/solucoes",
		"/ferramentas",
		"/analises",
		"/sobre",
		"/blog",
		"/contato",
		"/termos-uso-politica-privacidade",
		"/integracoes/api",
		"/white-label",
	}
	for _, solution := range content.Solutions() {
		if solution.Slug != "api" && solution.Slug != "white-label" {
			expectedPaths = append(expectedPaths, "/solucoes/"+solution.Slug)
		}
	}
	for _, analysis := range content.Analyses() {
		expectedPaths = append(expectedPaths, "/analises/"+analysis.Slug)
	}
	for _, article := range content.Articles() {
		expectedPaths = append(expectedPaths, "/blog/"+article.Slug)
	}

	for _, path := range expectedPaths {
		if !locations[baseURL+path] {
			t.Errorf("indexable route missing from sitemap: %s", path)
		}
	}
	if len(locations) != len(expectedPaths) {
		t.Errorf("sitemap has %d URLs, expected %d", len(locations), len(expectedPaths))
	}
}

func TestRobotsReferencesSitemapAndSearchCrawlers(t *testing.T) {
	application := newTestApplication()
	request := httptest.NewRequest(http.MethodGet, "/robots.txt", nil)
	response := httptest.NewRecorder()
	application.Handler().ServeHTTP(response, request)

	body := response.Body.String()
	for _, expected := range []string{
		"User-agent: *\nAllow: /",
		"User-agent: Googlebot\nAllow: /",
		"User-agent: OAI-SearchBot\nAllow: /",
		"User-agent: GPTBot\nAllow: /",
		"Sitemap: https://viagate.com.br/sitemap.xml",
	} {
		if !strings.Contains(body, expected) {
			t.Errorf("robots.txt missing %q", expected)
		}
	}
	if strings.Contains(body, "Disallow: /") {
		t.Fatal("robots.txt blocks site-wide crawling")
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

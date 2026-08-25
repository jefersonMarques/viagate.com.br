package server

import (
	"io"
	"log/slog"
	"net/http/httptest"
	"testing"
)

func TestClientIPResolverIgnoresForwardedHeadersFromUntrustedPeer(t *testing.T) {
	resolver := newClientIPResolver([]string{"127.0.0.1/32"}, slog.New(slog.NewTextHandler(io.Discard, nil)))
	request := httptest.NewRequest("GET", "https://viagate.com.br/", nil)
	request.RemoteAddr = "198.51.100.20:49152"
	request.Header.Set("X-Forwarded-For", "203.0.113.10")
	request.Header.Set("X-Real-IP", "203.0.113.11")

	if clientIP := resolver.resolve(request); clientIP != "198.51.100.20" {
		t.Fatalf("expected direct peer IP, got %s", clientIP)
	}
}

func TestClientIPResolverUsesForwardedClientFromTrustedProxy(t *testing.T) {
	resolver := newClientIPResolver([]string{"10.0.0.0/8"}, slog.New(slog.NewTextHandler(io.Discard, nil)))
	request := httptest.NewRequest("GET", "https://viagate.com.br/", nil)
	request.RemoteAddr = "10.0.0.20:49152"
	request.Header.Set("X-Forwarded-For", "203.0.113.10, 10.0.0.10")

	if clientIP := resolver.resolve(request); clientIP != "203.0.113.10" {
		t.Fatalf("expected forwarded client IP, got %s", clientIP)
	}
}

func TestClientIPResolverFallsBackToRealIPForTrustedProxy(t *testing.T) {
	resolver := newClientIPResolver([]string{"127.0.0.1/32"}, slog.New(slog.NewTextHandler(io.Discard, nil)))
	request := httptest.NewRequest("GET", "https://viagate.com.br/", nil)
	request.RemoteAddr = "127.0.0.1:49152"
	request.Header.Set("X-Real-IP", "203.0.113.25")

	if clientIP := resolver.resolve(request); clientIP != "203.0.113.25" {
		t.Fatalf("expected X-Real-IP value, got %s", clientIP)
	}
}

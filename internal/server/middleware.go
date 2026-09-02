package server

import (
	"net/http"
	"runtime/debug"
	"time"
)

func (application *Application) securityHeaders(next http.Handler) http.Handler {
	return http.HandlerFunc(func(response http.ResponseWriter, request *http.Request) {
		response.Header().Set("Content-Security-Policy", "default-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; img-src 'self' data: https://www.google-analytics.com; object-src 'none'; script-src 'self' https://www.googletagmanager.com; connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com https://analytics.google.com; style-src 'self' 'sha256-vKDHFHYmDB/3iZPHQA8jnu8SzAwos9LJCQULjcSJ5lw='; upgrade-insecure-requests")
		response.Header().Set("Cross-Origin-Opener-Policy", "same-origin")
		response.Header().Set("Permissions-Policy", "camera=(), geolocation=(), microphone=()")
		response.Header().Set("Referrer-Policy", "strict-origin-when-cross-origin")
		response.Header().Set("X-Content-Type-Options", "nosniff")
		response.Header().Set("X-Frame-Options", "DENY")
		next.ServeHTTP(response, request)
	})
}

func (application *Application) logRequests(next http.Handler) http.Handler {
	return http.HandlerFunc(func(response http.ResponseWriter, request *http.Request) {
		startedAt := time.Now()
		next.ServeHTTP(response, request)
		application.config.Logger.Info(
			"request completed",
			"method", request.Method,
			"path", request.URL.Path,
			"duration", time.Since(startedAt).String(),
		)
	})
}

func (application *Application) recoverPanic(next http.Handler) http.Handler {
	return http.HandlerFunc(func(response http.ResponseWriter, request *http.Request) {
		defer func() {
			if recovered := recover(); recovered != nil {
				application.config.Logger.Error("request panic", "error", recovered, "stack", string(debug.Stack()))
				response.Header().Set("Connection", "close")
				http.Error(response, "Erro interno", http.StatusInternalServerError)
			}
		}()
		next.ServeHTTP(response, request)
	})
}

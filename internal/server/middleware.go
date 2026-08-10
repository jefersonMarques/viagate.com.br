package server

import (
	"bufio"
	"compress/gzip"
	"fmt"
	"net"
	"net/http"
	"runtime/debug"
	"strings"
	"time"
)

func (application *Application) securityHeaders(next http.Handler) http.Handler {
	return http.HandlerFunc(func(response http.ResponseWriter, request *http.Request) {
		response.Header().Set("Content-Security-Policy", "default-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; img-src 'self' data:; object-src 'none'; script-src 'self'; style-src 'self' 'sha256-vKDHFHYmDB/3iZPHQA8jnu8SzAwos9LJCQULjcSJ5lw='; upgrade-insecure-requests")
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

func (application *Application) compress(next http.Handler) http.Handler {
	return http.HandlerFunc(func(response http.ResponseWriter, request *http.Request) {
		if request.Method == http.MethodHead || !strings.Contains(request.Header.Get("Accept-Encoding"), "gzip") || request.Header.Get("Range") != "" {
			next.ServeHTTP(response, request)
			return
		}
		response.Header().Set("Content-Encoding", "gzip")
		response.Header().Add("Vary", "Accept-Encoding")
		writer := gzip.NewWriter(response)
		defer writer.Close()
		next.ServeHTTP(&gzipResponseWriter{ResponseWriter: response, writer: writer}, request)
	})
}

type gzipResponseWriter struct {
	http.ResponseWriter
	writer *gzip.Writer
}

func (writer *gzipResponseWriter) WriteHeader(status int) {
	writer.Header().Del("Content-Length")
	writer.ResponseWriter.WriteHeader(status)
}

func (writer *gzipResponseWriter) Write(content []byte) (int, error) {
	writer.Header().Del("Content-Length")
	return writer.writer.Write(content)
}

func (writer *gzipResponseWriter) Flush() {
	_ = writer.writer.Flush()
	if flusher, ok := writer.ResponseWriter.(http.Flusher); ok {
		flusher.Flush()
	}
}

func (writer *gzipResponseWriter) Hijack() (net.Conn, *bufio.ReadWriter, error) {
	hijacker, ok := writer.ResponseWriter.(http.Hijacker)
	if !ok {
		return nil, nil, fmt.Errorf("hijacking is unsupported")
	}
	return hijacker.Hijack()
}

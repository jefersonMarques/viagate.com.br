package server

import (
	"log/slog"
	"net/http"
	"time"
)

type Config struct {
	Address           string
	Environment       string
	SiteURL           string
	ContactWebhookURL string
	Logger            *slog.Logger
}

type Application struct {
	config      Config
	router      http.Handler
	rateLimiter *rateLimiter
}

func New(config Config) *Application {
	application := &Application{
		config:      config,
		rateLimiter: newRateLimiter(5, 15*time.Minute),
	}
	application.router = application.routes()
	return application
}

func (application *Application) Address() string {
	return application.config.Address
}

func (application *Application) Handler() http.Handler {
	return application.router
}

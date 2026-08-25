package server

import (
	"log/slog"
	"net/http"
	"time"
)

type Config struct {
	Address             string
	Environment         string
	SiteURL             string
	BrevoAPIKey         string
	BrevoContactName    string
	BrevoContactSubject string
	BrevoContactSender  string
	ContactEmail        string
	ContactWebhookURL   string
	TrustedProxyCIDRs   []string
	Logger              *slog.Logger
}

type Application struct {
	config      Config
	router      http.Handler
	rateLimiter *rateLimiter
	brevo       *brevoClient
}

func New(config Config) *Application {
	if config.Logger == nil {
		config.Logger = slog.Default()
	}

	clientIPResolver := newClientIPResolver(config.TrustedProxyCIDRs, config.Logger)
	application := &Application{
		config:      config,
		rateLimiter: newRateLimiter(5, 15*time.Minute, clientIPResolver),
		brevo:       newBrevoClient(config),
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

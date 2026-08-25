package components

import (
	"net/url"
	"strings"

	"github.com/viagate/site/internal/site"
)

var globalStyles = []string{
	"/assets/css/site.css",
	"/assets/css/industrial-tech.css",
	"/assets/css/header-mega-menu.css",
	"/assets/css/header-behavior.css",
}

var globalScripts = []string{
	"/assets/js/site.js",
	"/assets/js/header-mega-menu.js",
}

func PageStyles(meta site.PageMeta) []string {
	styles := append([]string{}, globalStyles...)
	path := pagePath(meta)

	switch {
	case path == "/":
		styles = append(styles,
			"/assets/css/institutional-visuals.css",
			"/assets/css/risk-engine.css",
			"/assets/css/risk-engine-brand.css",
			"/assets/css/risk-engine-scenarios.css",
			"/assets/css/risk-engine-profile.css",
		)
	case path == "/sobre":
		styles = append(styles, "/assets/css/institutional-visuals.css")
	case path == "/ferramentas":
		styles = append(styles,
			"/assets/css/tool-function-menu.css",
			"/assets/css/tools-catalog.css",
			"/assets/css/tool-visual-assets.css",
		)
	case path == "/analises" || strings.HasPrefix(path, "/analises/"):
		styles = append(styles, "/assets/css/analysis-reference.css")
	case path == "/termos-uso-politica-privacidade":
		styles = append(styles, "/assets/css/legal-document.css")
	case path == "/blog" || strings.HasPrefix(path, "/blog/"):
		styles = append(styles, "/assets/css/blog-images.css")
	case path == "/solucoes/pesquisa-cadastral-de-motoristas":
		styles = append(styles,
			"/assets/css/cargo-score-identity-hero.css",
			"/assets/css/cargo-score-panel-shadow.css",
			"/assets/css/cargo-score-process.css",
			"/assets/css/cargo-score-verification.css",
		)
	case path == "/solucoes/autenticador-de-seguranca":
		styles = append(styles,
			"/assets/css/cargo-authenticator.css",
			"/assets/css/cargo-authenticator-gate.css",
		)
	case path == "/solucoes/gestao-logistica":
		styles = append(styles,
			"/assets/css/cargo-truck-route.css",
			"/assets/css/cargo-truck-journey.css",
		)
	case path == "/solucoes/prevencao-veicular":
		styles = append(styles,
			"/assets/css/prevention-vehicle-hero.css",
			"/assets/css/prevention-vehicle-plate.css",
			"/assets/css/prevention-process.css",
		)
	case path == "/solucoes/monitoramento-de-veiculos":
		styles = append(styles,
			"/assets/css/vehicle-monitoring-hero.css",
			"/assets/css/vehicle-monitoring-page.css",
		)
	case path == "/solucoes/biometria-facial":
		styles = append(styles,
			"/assets/css/biometric-flow.css",
			"/assets/css/biometric-face-frame.css",
		)
	case path == "/integracoes/api":
		styles = append(styles,
			"/assets/css/api-integration-hero.css",
			"/assets/css/api-integration-page.css",
		)
	case path == "/white-label":
		styles = append(styles,
			"/assets/css/white-label-hero.css",
			"/assets/css/white-label-page.css",
		)
	}

	return styles
}

func PageScripts(meta site.PageMeta) []string {
	scripts := append([]string{}, globalScripts...)
	path := pagePath(meta)

	switch path {
	case "/":
		scripts = append(scripts, "/assets/js/risk-engine-profile.js")
	case "/ferramentas":
		scripts = append(scripts, "/assets/js/tools-catalog.js")
	case "/solucoes/pesquisa-cadastral-de-motoristas":
		scripts = append(scripts, "/assets/js/cargo-score-identity-hero.js")
	case "/solucoes/autenticador-de-seguranca":
		scripts = append(scripts, "/assets/js/cargo-authenticator.js")
	case "/solucoes/gestao-logistica":
		scripts = append(scripts, "/assets/js/cargo-truck-route.js")
	case "/solucoes/prevencao-veicular":
		scripts = append(scripts, "/assets/js/prevention-vehicle-hero.js")
	case "/solucoes/monitoramento-de-veiculos":
		scripts = append(scripts, "/assets/js/vehicle-monitoring-hero.js")
	case "/solucoes/biometria-facial":
		scripts = append(scripts,
			"/assets/js/biometric-flow.js",
			"/assets/js/biometric-face-enhance.js",
		)
	case "/integracoes/api":
		scripts = append(scripts,
			"/assets/js/api-integration-hero.js",
			"/assets/js/api-integration-page.js",
		)
	case "/white-label":
		scripts = append(scripts,
			"/assets/js/white-label-hero.js",
			"/assets/js/white-label-page.js",
		)
	}

	return scripts
}

func pagePath(meta site.PageMeta) string {
	parsedURL, err := url.Parse(meta.Canonical)
	if err != nil || parsedURL.Path == "" {
		return "/"
	}
	return parsedURL.Path
}

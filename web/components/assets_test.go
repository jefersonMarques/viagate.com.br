package components

import (
	"testing"

	"github.com/viagate/site/internal/site"
)

func TestPageStylesKeepCargoScoreAssetsOffUnrelatedPages(t *testing.T) {
	homeStyles := PageStyles(site.PageMeta{Canonical: "https://viagate.com.br/"})
	if !containsAsset(homeStyles, "/assets/css/risk-engine.css") {
		t.Fatal("home page is missing risk engine styles")
	}
	if containsAsset(homeStyles, "/assets/css/cargo-score-process.css") {
		t.Fatal("home page should not load Cargo Score process styles")
	}

	aboutStyles := PageStyles(site.PageMeta{Canonical: "https://viagate.com.br/sobre"})
	if !containsAsset(aboutStyles, "/assets/css/institutional-visuals.css") {
		t.Fatal("about page is missing institutional visual styles")
	}
	if containsAsset(aboutStyles, "/assets/css/white-label-page.css") {
		t.Fatal("about page should not load white label styles")
	}
}

func TestPageAssetsLoadSolutionSpecificModules(t *testing.T) {
	meta := site.PageMeta{Canonical: "https://viagate.com.br/solucoes/pesquisa-cadastral-de-motoristas"}
	styles := PageStyles(meta)
	scripts := PageScripts(meta)

	for _, expected := range []string{
		"/assets/css/cargo-score-identity-hero.css",
		"/assets/css/cargo-score-process.css",
		"/assets/css/cargo-score-verification.css",
	} {
		if !containsAsset(styles, expected) {
			t.Fatalf("Cargo Score page is missing %s", expected)
		}
	}
	if !containsAsset(scripts, "/assets/js/cargo-score-identity-hero.js") {
		t.Fatal("Cargo Score page is missing its JavaScript module")
	}
	if containsAsset(scripts, "/assets/js/white-label-page.js") {
		t.Fatal("Cargo Score page should not load white label JavaScript")
	}
}

func TestPageAssetsAlwaysIncludeGlobalModules(t *testing.T) {
	styles := PageStyles(site.PageMeta{Canonical: "https://viagate.com.br/contato"})
	scripts := PageScripts(site.PageMeta{Canonical: "https://viagate.com.br/contato"})

	for _, expected := range globalStyles {
		if !containsAsset(styles, expected) {
			t.Fatalf("missing global style %s", expected)
		}
	}
	for _, expected := range globalScripts {
		if !containsAsset(scripts, expected) {
			t.Fatalf("missing global script %s", expected)
		}
	}
}

func containsAsset(assets []string, expected string) bool {
	for _, asset := range assets {
		if asset == expected {
			return true
		}
	}
	return false
}

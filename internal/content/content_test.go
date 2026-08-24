package content

import (
	"encoding/json"
	"strings"
	"testing"
	"unicode/utf8"

	"github.com/viagate/site/internal/site"
)

func TestSolutionContentIsCompleteAndUnique(t *testing.T) {
	seen := make(map[string]bool)
	for _, solution := range Solutions() {
		if solution.Slug == "" || solution.Kind == "" || solution.Title == "" || solution.MetaDescription == "" {
			t.Fatalf("solution has incomplete SEO content: %#v", solution)
		}
		if seen[solution.Slug] {
			t.Fatalf("duplicate solution slug: %s", solution.Slug)
		}
		seen[solution.Slug] = true
		if solution.Definition == "" || solution.Audience == "" || solution.Challenge == "" || solution.Outcome == "" {
			t.Fatalf("solution %s needs complete positioning content", solution.Slug)
		}
		if solution.ProcessTitle == "" || solution.ProcessText == "" || solution.EvidenceTitle == "" {
			t.Fatalf("solution %s needs complete presentation content", solution.Slug)
		}
		if len(solution.Features) != len(solution.Steps) || len(solution.Features) < 4 || len(solution.FrequentlyAsked) < 2 {
			t.Fatalf("solution %s needs more supporting content", solution.Slug)
		}
	}
}

func TestSolutionsAreGroupedWithoutDuplication(t *testing.T) {
	grouped := append(
		append(SolutionsByKind(site.SolutionKindProduct), SolutionsByKind(site.SolutionKindCapability)...),
		SolutionsByKind(site.SolutionKindDelivery)...,
	)
	if len(grouped) != len(Solutions()) {
		t.Fatalf("expected %d grouped solutions, got %d", len(Solutions()), len(grouped))
	}

	seen := make(map[string]bool, len(grouped))
	for _, solution := range grouped {
		if seen[solution.Slug] {
			t.Fatalf("solution %s appears in more than one group", solution.Slug)
		}
		seen[solution.Slug] = true
	}
}

func TestAnalysisReferencesAreCompleteAndUnique(t *testing.T) {
	if len(Analyses()) != 12 {
		t.Fatalf("expected 12 analysis references, got %d", len(Analyses()))
	}

	seen := make(map[string]bool)
	for _, analysis := range Analyses() {
		if analysis.Slug == "" || analysis.Name == "" || analysis.Title == "" || analysis.MetaDescription == "" {
			t.Fatalf("analysis has incomplete SEO content: %#v", analysis)
		}
		if seen[analysis.Slug] {
			t.Fatalf("duplicate analysis slug: %s", analysis.Slug)
		}
		seen[analysis.Slug] = true
		if analysis.Definition == "" || analysis.Purpose == "" || analysis.Interpretation == "" {
			t.Fatalf("analysis %s needs complete explanatory content", analysis.Slug)
		}
		if len(analysis.Scope) < 3 || len(analysis.Process) < 3 || len(analysis.Limitations) < 2 || len(analysis.FrequentlyAsked) < 2 {
			t.Fatalf("analysis %s needs more supporting content", analysis.Slug)
		}
		if analysis.RelatedSolutionName == "" || analysis.RelatedSolutionPath == "" {
			t.Fatalf("analysis %s needs a related solution", analysis.Slug)
		}
	}
}

func TestArticleContentIsCompleteAndUnique(t *testing.T) {
	seen := make(map[string]bool)
	for _, article := range Articles() {
		if article.Slug == "" || article.Title == "" || len(article.Sections) < 3 {
			t.Fatalf("article has incomplete content: %#v", article)
		}
		if seen[article.Slug] {
			t.Fatalf("duplicate article slug: %s", article.Slug)
		}
		seen[article.Slug] = true
		if article.UpdatedAt.Before(article.PublishedAt) {
			t.Fatalf("article %s is updated before publication", article.Slug)
		}
	}
}

func TestMetadataUsesCanonicalURLAndValidSchema(t *testing.T) {
	meta := HomeMeta("https://viagate.com.br/")
	if meta.Canonical != "https://viagate.com.br/" {
		t.Fatalf("unexpected canonical URL: %s", meta.Canonical)
	}
	if !strings.HasPrefix(meta.Image, "https://viagate.com.br/") {
		t.Fatalf("social image is not absolute: %s", meta.Image)
	}
	var schema map[string]any
	if err := json.Unmarshal([]byte(meta.Schema), &schema); err != nil {
		t.Fatalf("invalid JSON-LD: %v", err)
	}

	analysis, found := FindAnalysis("biometria-facial-prova-de-vida")
	if !found {
		t.Fatal("expected biometric analysis reference")
	}
	analysisMeta := AnalysisMeta("https://viagate.com.br/", analysis)
	if analysisMeta.Canonical != "https://viagate.com.br/analises/biometria-facial-prova-de-vida" {
		t.Fatalf("unexpected analysis canonical URL: %s", analysisMeta.Canonical)
	}
	if err := json.Unmarshal([]byte(analysisMeta.Schema), &schema); err != nil {
		t.Fatalf("invalid analysis JSON-LD: %v", err)
	}
}

func TestGeneratedMetadataQuality(t *testing.T) {
	const siteURL = "https://viagate.com.br"
	metas := []site.PageMeta{
		HomeMeta(siteURL),
		ListingMeta(siteURL, "Soluções para gestão de riscos no transporte", "Conheça os produtos, capacidades e formas de integração da Viagate para pesquisa cadastral, identidade, prevenção e logística.", "/solucoes"),
		ListingMeta(siteURL, "Ferramentas para transporte e gestão de riscos", "Conheça as ferramentas Viagate para pesquisa cadastral, autenticação, logística, prevenção veicular e monitoramento.", "/ferramentas"),
		ListingMeta(siteURL, "Tipos de análises para transporte e gestão de riscos", "Referências sobre biometria, cadastro, CNH, ANTT, contexto judicial, critérios operacionais, histórico veicular, monitoramento e viagem.", "/analises"),
		SimpleMeta(siteURL, "Sobre a Viagate", "Conheça a Viagate e a tecnologia criada para tornar operações de transporte mais seguras, integradas e rastreáveis.", "/sobre", false),
	}

	for _, solution := range Solutions() {
		path := "/solucoes/" + solution.Slug
		if solution.Slug == "api" {
			path = "/integracoes/api"
		} else if solution.Slug == "white-label" {
			path = "/white-label"
		}
		metas = append(metas, SolutionMeta(siteURL, solution, path))
	}
	for _, analysis := range Analyses() {
		metas = append(metas, AnalysisMeta(siteURL, analysis))
	}
	for _, article := range Articles() {
		meta := ArticleMeta(siteURL, article)
		if meta.PublishedTime == "" || meta.ModifiedTime == "" {
			t.Fatalf("article %s needs published and modified metadata", article.Slug)
		}
		metas = append(metas, meta)
	}

	for _, meta := range metas {
		if titleLength := utf8.RuneCountInString(meta.Title); titleLength == 0 || titleLength > 70 {
			t.Errorf("title length %d is outside SEO target: %q", titleLength, meta.Title)
		}
		descriptionLength := utf8.RuneCountInString(meta.Description)
		if descriptionLength < 70 || descriptionLength > 180 {
			t.Errorf("description length %d is outside SEO target for %q", descriptionLength, meta.Title)
		}
		if !strings.HasPrefix(meta.Canonical, siteURL+"/") {
			t.Errorf("canonical is outside canonical host for %q: %s", meta.Title, meta.Canonical)
		}
		if !strings.HasPrefix(meta.Image, siteURL+"/") {
			t.Errorf("social image is outside canonical host for %q: %s", meta.Title, meta.Image)
		}

		var schema map[string]any
		if err := json.Unmarshal([]byte(meta.Schema), &schema); err != nil {
			t.Errorf("invalid JSON-LD for %q: %v", meta.Title, err)
			continue
		}
		if _, found := schema["@graph"]; !found {
			t.Errorf("JSON-LD for %q must use a connected graph", meta.Title)
		}
	}
}

package content

import (
	"encoding/json"
	"strings"
	"testing"

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

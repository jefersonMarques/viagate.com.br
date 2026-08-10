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
}

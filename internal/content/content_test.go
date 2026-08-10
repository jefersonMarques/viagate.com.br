package content

import (
	"encoding/json"
	"strings"
	"testing"
)

func TestSolutionContentIsCompleteAndUnique(t *testing.T) {
	seen := make(map[string]bool)
	for _, solution := range Solutions() {
		if solution.Slug == "" || solution.Title == "" || solution.MetaDescription == "" {
			t.Fatalf("solution has incomplete SEO content: %#v", solution)
		}
		if seen[solution.Slug] {
			t.Fatalf("duplicate solution slug: %s", solution.Slug)
		}
		seen[solution.Slug] = true
		if len(solution.Features) < 3 || len(solution.FrequentlyAsked) < 2 {
			t.Fatalf("solution %s needs more supporting content", solution.Slug)
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
}

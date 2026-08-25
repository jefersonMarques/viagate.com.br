package content

import (
	"encoding/json"
	"strings"
	"unicode/utf8"

	"github.com/viagate/site/internal/site"
)

const defaultSocialImage = "/assets/images/viagate-social.png"

func HomeMeta(siteURL string) site.PageMeta {
	canonical := absoluteURL(siteURL, "/")
	description := "Pesquisa cadastral de motoristas e veículos, biometria facial, prevenção, logística e integrações para operações de transporte."
	schema := schemaGraph(siteURL, map[string]any{
		"@type":       "WebPage",
		"@id":         absoluteURL(siteURL, "/#webpage"),
		"url":         canonical,
		"name":        "Viagate | Gestão de Riscos e Tecnologia para Transporte",
		"description": description,
		"isPartOf":    map[string]any{"@id": absoluteURL(siteURL, "/#website")},
		"about":       map[string]any{"@id": absoluteURL(siteURL, "/#organization")},
		"inLanguage":  "pt-BR",
	})
	return site.PageMeta{
		Title:       "Viagate | Gestão de Riscos e Tecnologia para Transporte",
		Description: description,
		Canonical:   canonical,
		Image:       absoluteURL(siteURL, defaultSocialImage),
		Type:        "website",
		Schema:      marshalSchema(schema),
	}
}

func ListingMeta(siteURL string, title string, description string, path string) site.PageMeta {
	canonical := absoluteURL(siteURL, path)
	schema := schemaGraph(siteURL, map[string]any{
		"@type":       "CollectionPage",
		"@id":         canonical + "#webpage",
		"url":         canonical,
		"name":        title,
		"description": description,
		"inLanguage":  "pt-BR",
		"isPartOf":    map[string]any{"@id": absoluteURL(siteURL, "/#website")},
		"about":       map[string]any{"@id": absoluteURL(siteURL, "/#organization")},
		"breadcrumb":  breadcrumbSchema(siteURL, []breadcrumb{{"Início", "/"}, {title, path}}),
	})
	return site.PageMeta{Title: brandedTitle(title), Description: description, Canonical: canonical, Image: absoluteURL(siteURL, defaultSocialImage), Type: "website", Schema: marshalSchema(schema)}
}

func AnalysisMeta(siteURL string, analysis site.AnalysisReference) site.PageMeta {
	path := "/analises/" + analysis.Slug
	canonical := absoluteURL(siteURL, path)
	faqEntities := faqSchemaEntities(analysis.FrequentlyAsked)
	schema := schemaGraph(siteURL,
		map[string]any{
			"@type":       "DefinedTerm",
			"@id":         canonical + "#term",
			"name":        analysis.Name,
			"description": analysis.Definition,
			"url":         canonical,
		},
		map[string]any{
			"@type":      "FAQPage",
			"@id":        canonical + "#faq",
			"url":        canonical + "#perguntas-frequentes",
			"mainEntity": faqEntities,
			"inLanguage": "pt-BR",
		},
		map[string]any{
			"@type":       "WebPage",
			"@id":         canonical + "#webpage",
			"url":         canonical,
			"name":        analysis.Title,
			"description": analysis.MetaDescription,
			"inLanguage":  "pt-BR",
			"about":       map[string]any{"@id": canonical + "#term"},
			"isPartOf":    map[string]any{"@id": absoluteURL(siteURL, "/#website")},
			"breadcrumb":  breadcrumbSchema(siteURL, []breadcrumb{{"Início", "/"}, {"Tipos de análises", "/analises"}, {analysis.Name, path}}),
		},
	)
	return site.PageMeta{Title: brandedTitle(analysis.Name), Description: analysis.MetaDescription, Canonical: canonical, Image: absoluteURL(siteURL, defaultSocialImage), Type: "website", Schema: marshalSchema(schema)}
}

func SolutionMeta(siteURL string, solution site.Solution, path string) site.PageMeta {
	canonical := absoluteURL(siteURL, path)
	faqEntities := faqSchemaEntities(solution.FrequentlyAsked)
	schema := schemaGraph(siteURL,
		map[string]any{
			"@type":         "Service",
			"@id":           canonical + "#service",
			"name":          solution.ShortName,
			"alternateName": solution.Name,
			"url":           canonical,
			"description":   solution.MetaDescription,
			"serviceType":   solution.Name,
			"provider":      map[string]any{"@id": absoluteURL(siteURL, "/#organization")},
			"areaServed":    map[string]any{"@type": "Country", "name": "Brasil"},
		},
		map[string]any{
			"@type":      "FAQPage",
			"@id":        canonical + "#faq",
			"url":        canonical + "#perguntas-frequentes",
			"mainEntity": faqEntities,
			"inLanguage": "pt-BR",
		},
		map[string]any{
			"@type":       "WebPage",
			"@id":         canonical + "#webpage",
			"url":         canonical,
			"name":        solution.Title,
			"description": solution.MetaDescription,
			"inLanguage":  "pt-BR",
			"mainEntity":  map[string]any{"@id": canonical + "#service"},
			"isPartOf":    map[string]any{"@id": absoluteURL(siteURL, "/#website")},
			"breadcrumb":  breadcrumbSchema(siteURL, []breadcrumb{{"Início", "/"}, {"Soluções", "/solucoes"}, {solution.ShortName, path}}),
		},
	)
	return site.PageMeta{Title: brandedTitle(solution.Name), Description: solution.MetaDescription, Canonical: canonical, Image: absoluteURL(siteURL, defaultSocialImage), Type: "website", Schema: marshalSchema(schema)}
}

func ArticleMeta(siteURL string, article site.Article) site.PageMeta {
	path := "/blog/" + article.Slug
	canonical := absoluteURL(siteURL, path)
	publishedTime := article.PublishedAt.Format("2006-01-02T15:04:05Z07:00")
	modifiedTime := article.UpdatedAt.Format("2006-01-02T15:04:05Z07:00")
	schema := schemaGraph(siteURL,
		map[string]any{
			"@type":            "Article",
			"@id":              canonical + "#article",
			"headline":         article.Title,
			"description":      article.Description,
			"articleSection":   article.Category,
			"datePublished":    publishedTime,
			"dateModified":     modifiedTime,
			"inLanguage":       "pt-BR",
			"author":           map[string]any{"@type": "Organization", "name": article.Author, "url": absoluteURL(siteURL, "/sobre")},
			"publisher":        map[string]any{"@id": absoluteURL(siteURL, "/#organization")},
			"mainEntityOfPage": map[string]any{"@id": canonical + "#webpage"},
			"image":            absoluteURL(siteURL, defaultSocialImage),
		},
		map[string]any{
			"@type":       "WebPage",
			"@id":         canonical + "#webpage",
			"url":         canonical,
			"name":        article.Title,
			"description": article.Description,
			"inLanguage":  "pt-BR",
			"isPartOf":    map[string]any{"@id": absoluteURL(siteURL, "/#website")},
			"breadcrumb":  breadcrumbSchema(siteURL, []breadcrumb{{"Início", "/"}, {"Conteúdos", "/blog"}, {article.Title, path}}),
		},
	)
	return site.PageMeta{
		Title:         brandedTitle(article.Title),
		Description:   article.Description,
		Canonical:     canonical,
		Image:         absoluteURL(siteURL, defaultSocialImage),
		Type:          "article",
		Schema:        marshalSchema(schema),
		PublishedTime: publishedTime,
		ModifiedTime:  modifiedTime,
	}
}

func SimpleMeta(siteURL string, title string, description string, path string, noIndex bool) site.PageMeta {
	canonical := absoluteURL(siteURL, path)
	schema := schemaGraph(siteURL, map[string]any{
		"@type":       "WebPage",
		"@id":         canonical + "#webpage",
		"url":         canonical,
		"name":        title,
		"description": description,
		"inLanguage":  "pt-BR",
		"isPartOf":    map[string]any{"@id": absoluteURL(siteURL, "/#website")},
		"about":       map[string]any{"@id": absoluteURL(siteURL, "/#organization")},
	})
	return site.PageMeta{Title: brandedTitle(title), Description: description, Canonical: canonical, Image: absoluteURL(siteURL, defaultSocialImage), Type: "website", Schema: marshalSchema(schema), NoIndex: noIndex}
}

func brandedTitle(title string) string {
	candidate := title + " | Viagate"
	if utf8.RuneCountInString(candidate) <= 65 {
		return candidate
	}
	return title
}

func faqSchemaEntities(items []site.FAQ) []map[string]any {
	entities := make([]map[string]any, 0, len(items))
	for _, item := range items {
		entities = append(entities, map[string]any{
			"@type": "Question",
			"name":  item.Question,
			"acceptedAnswer": map[string]any{
				"@type": "Answer",
				"text":  item.Answer,
			},
		})
	}
	return entities
}

func schemaGraph(siteURL string, entities ...any) map[string]any {
	graph := make([]any, 0, len(entities)+2)
	graph = append(graph, organizationSchema(siteURL), websiteSchema(siteURL))
	graph = append(graph, entities...)
	return map[string]any{"@context": "https://schema.org", "@graph": graph}
}

func websiteSchema(siteURL string) map[string]any {
	return map[string]any{
		"@type":       "WebSite",
		"@id":         absoluteURL(siteURL, "/#website"),
		"url":         absoluteURL(siteURL, "/"),
		"name":        "Viagate",
		"description": "Tecnologia para pesquisa cadastral, identidade, prevenção e gestão logística no transporte de cargas.",
		"inLanguage":  "pt-BR",
		"publisher":   map[string]any{"@id": absoluteURL(siteURL, "/#organization")},
	}
}

func absoluteURL(siteURL string, path string) string {
	return strings.TrimRight(siteURL, "/") + "/" + strings.TrimLeft(path, "/")
}

func organizationSchema(siteURL string) map[string]any {
	return map[string]any{
		"@type":         "Organization",
		"@id":           absoluteURL(siteURL, "/#organization"),
		"name":          "Viagate Tecnologia",
		"alternateName": "Viagate",
		"url":           absoluteURL(siteURL, "/"),
		"email":         "contato@viagate.com.br",
		"telephone":     "+55-41-99962-3600",
		"description":   "Empresa brasileira de tecnologia para pesquisa cadastral, identidade, prevenção e gestão logística no transporte de cargas.",
		"address": map[string]any{
			"@type":           "PostalAddress",
			"addressLocality": "Curitiba",
			"addressRegion":   "PR",
			"addressCountry":  "BR",
		},
		"contactPoint": map[string]any{
			"@type":             "ContactPoint",
			"contactType":       "sales",
			"telephone":         "+55-41-99962-3600",
			"email":             "contato@viagate.com.br",
			"availableLanguage": []string{"Portuguese"},
		},
	}
}

type breadcrumb struct {
	name string
	path string
}

func breadcrumbSchema(siteURL string, items []breadcrumb) map[string]any {
	elements := make([]map[string]any, 0, len(items))
	for index, item := range items {
		elements = append(elements, map[string]any{"@type": "ListItem", "position": index + 1, "name": item.name, "item": absoluteURL(siteURL, item.path)})
	}
	return map[string]any{"@type": "BreadcrumbList", "itemListElement": elements}
}

func marshalSchema(value any) string {
	data, err := json.Marshal(value)
	if err != nil {
		return "{}"
	}
	return string(data)
}

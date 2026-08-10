package content

import (
	"encoding/json"
	"strings"

	"github.com/viagate/site/internal/site"
)

const defaultSocialImage = "/assets/images/viagate-social.png"

func HomeMeta(siteURL string) site.PageMeta {
	canonical := absoluteURL(siteURL, "/")
	schema := map[string]any{
		"@context": "https://schema.org",
		"@graph": []any{
			organizationSchema(siteURL),
			map[string]any{
				"@type":       "WebSite",
				"@id":         absoluteURL(siteURL, "/#website"),
				"url":         canonical,
				"name":        "Viagate",
				"description": "Tecnologia para gerenciamento de riscos, validação cadastral e gestão logística no transporte de cargas.",
				"inLanguage":  "pt-BR",
				"publisher":   map[string]any{"@id": absoluteURL(siteURL, "/#organization")},
			},
			map[string]any{
				"@type":       "WebPage",
				"@id":         absoluteURL(siteURL, "/#webpage"),
				"url":         canonical,
				"name":        "Viagate | Tecnologia para Transporte e Gestão de Riscos",
				"description": "Biometria facial, pesquisa cadastral, prevenção de fraudes e gestão logística para operações de transporte mais seguras.",
				"isPartOf":    map[string]any{"@id": absoluteURL(siteURL, "/#website")},
				"about":       map[string]any{"@id": absoluteURL(siteURL, "/#organization")},
				"inLanguage":  "pt-BR",
			},
		},
	}
	return site.PageMeta{
		Title:       "Viagate | Tecnologia para Transporte e Gestão de Riscos",
		Description: "Biometria facial, pesquisa cadastral, prevenção de fraudes e gestão logística para operações de transporte mais seguras.",
		Canonical:   canonical,
		Image:       absoluteURL(siteURL, defaultSocialImage),
		Type:        "website",
		Schema:      marshalSchema(schema),
	}
}

func ListingMeta(siteURL string, title string, description string, path string) site.PageMeta {
	canonical := absoluteURL(siteURL, path)
	schema := map[string]any{
		"@context":    "https://schema.org",
		"@type":       "CollectionPage",
		"@id":         canonical + "#webpage",
		"url":         canonical,
		"name":        title,
		"description": description,
		"inLanguage":  "pt-BR",
		"isPartOf":    map[string]any{"@id": absoluteURL(siteURL, "/#website")},
		"breadcrumb":  breadcrumbSchema(siteURL, []breadcrumb{{"Início", "/"}, {title, path}}),
	}
	return site.PageMeta{Title: title + " | Viagate", Description: description, Canonical: canonical, Image: absoluteURL(siteURL, defaultSocialImage), Type: "website", Schema: marshalSchema(schema)}
}

func SolutionMeta(siteURL string, solution site.Solution, path string) site.PageMeta {
	canonical := absoluteURL(siteURL, path)
	faqEntities := make([]map[string]any, 0, len(solution.FrequentlyAsked))
	for _, item := range solution.FrequentlyAsked {
		faqEntities = append(faqEntities, map[string]any{
			"@type": "Question",
			"name":  item.Question,
			"acceptedAnswer": map[string]any{
				"@type": "Answer",
				"text":  item.Answer,
			},
		})
	}
	schema := map[string]any{
		"@context": "https://schema.org",
		"@graph": []any{
			map[string]any{
				"@type":               "SoftwareApplication",
				"@id":                 canonical + "#software",
				"name":                solution.ShortName,
				"alternateName":       solution.Name,
				"url":                 canonical,
				"description":         solution.MetaDescription,
				"applicationCategory": "BusinessApplication",
				"operatingSystem":     "Web",
				"provider":            map[string]any{"@id": absoluteURL(siteURL, "/#organization")},
			},
			map[string]any{
				"@type":      "FAQPage",
				"@id":        canonical + "#faq",
				"mainEntity": faqEntities,
			},
			map[string]any{
				"@type":       "WebPage",
				"@id":         canonical + "#webpage",
				"url":         canonical,
				"name":        solution.Title,
				"description": solution.MetaDescription,
				"inLanguage":  "pt-BR",
				"mainEntity":  map[string]any{"@id": canonical + "#software"},
				"breadcrumb":  breadcrumbSchema(siteURL, []breadcrumb{{"Início", "/"}, {"Soluções", "/solucoes"}, {solution.ShortName, path}}),
			},
		},
	}
	return site.PageMeta{Title: solution.Title + " | Viagate", Description: solution.MetaDescription, Canonical: canonical, Image: absoluteURL(siteURL, defaultSocialImage), Type: "website", Schema: marshalSchema(schema)}
}

func ArticleMeta(siteURL string, article site.Article) site.PageMeta {
	path := "/blog/" + article.Slug
	canonical := absoluteURL(siteURL, path)
	schema := map[string]any{
		"@context": "https://schema.org",
		"@graph": []any{
			map[string]any{
				"@type":            "Article",
				"@id":              canonical + "#article",
				"headline":         article.Title,
				"description":      article.Description,
				"datePublished":    article.PublishedAt.Format("2006-01-02T15:04:05-07:00"),
				"dateModified":     article.UpdatedAt.Format("2006-01-02T15:04:05-07:00"),
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
				"breadcrumb":  breadcrumbSchema(siteURL, []breadcrumb{{"Início", "/"}, {"Conteúdos", "/blog"}, {article.Title, path}}),
			},
		},
	}
	return site.PageMeta{Title: article.Title + " | Viagate", Description: article.Description, Canonical: canonical, Image: absoluteURL(siteURL, defaultSocialImage), Type: "article", Schema: marshalSchema(schema)}
}

func SimpleMeta(siteURL string, title string, description string, path string, noIndex bool) site.PageMeta {
	canonical := absoluteURL(siteURL, path)
	schema := map[string]any{"@context": "https://schema.org", "@type": "WebPage", "url": canonical, "name": title, "description": description, "inLanguage": "pt-BR"}
	return site.PageMeta{Title: title + " | Viagate", Description: description, Canonical: canonical, Image: absoluteURL(siteURL, defaultSocialImage), Type: "website", Schema: marshalSchema(schema), NoIndex: noIndex}
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
		"description":   "Empresa brasileira de tecnologia para gerenciamento de riscos, validação cadastral e gestão logística no transporte de cargas.",
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

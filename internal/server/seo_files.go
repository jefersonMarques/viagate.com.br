package server

import (
	"encoding/xml"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/viagate/site/internal/content"
)

func (application *Application) robots(response http.ResponseWriter, request *http.Request) {
	response.Header().Set("Content-Type", "text/plain; charset=utf-8")
	response.Header().Set("Cache-Control", "public, max-age=3600")
	groups := []string{
		"User-agent: *\nAllow: /",
		"User-agent: Googlebot\nAllow: /",
		"User-agent: Bingbot\nAllow: /",
		"User-agent: OAI-SearchBot\nAllow: /",
		"User-agent: ChatGPT-User\nAllow: /",
		"User-agent: GPTBot\nAllow: /",
		"User-agent: Claude-SearchBot\nAllow: /",
		"User-agent: ClaudeBot\nAllow: /",
		"User-agent: Claude-User\nAllow: /",
		"User-agent: PerplexityBot\nAllow: /",
	}
	_, _ = fmt.Fprintf(response, "%s\n\nSitemap: %s/sitemap.xml\n", strings.Join(groups, "\n\n"), strings.TrimRight(application.config.SiteURL, "/"))
}

type sitemapURLSet struct {
	XMLName xml.Name     `xml:"urlset"`
	XMLNS   string       `xml:"xmlns,attr"`
	URLs    []sitemapURL `xml:"url"`
}

type sitemapURL struct {
	Location     string `xml:"loc"`
	LastModified string `xml:"lastmod,omitempty"`
	Change       string `xml:"changefreq,omitempty"`
	Priority     string `xml:"priority,omitempty"`
}

func (application *Application) sitemap(response http.ResponseWriter, request *http.Request) {
	baseURL := strings.TrimRight(application.config.SiteURL, "/")
	const siteUpdatedAt = "2026-08-20"
	urls := []sitemapURL{
		{Location: baseURL + "/", LastModified: siteUpdatedAt, Change: "weekly", Priority: "1.0"},
		{Location: baseURL + "/solucoes", LastModified: siteUpdatedAt, Change: "monthly", Priority: "0.9"},
		{Location: baseURL + "/ferramentas", LastModified: siteUpdatedAt, Change: "monthly", Priority: "0.9"},
		{Location: baseURL + "/sobre", LastModified: siteUpdatedAt, Change: "monthly", Priority: "0.6"},
		{Location: baseURL + "/blog", LastModified: siteUpdatedAt, Change: "weekly", Priority: "0.8"},
		{Location: baseURL + "/contato", LastModified: siteUpdatedAt, Change: "monthly", Priority: "0.7"},
		{Location: baseURL + "/termos-uso-politica-privacidade", LastModified: siteUpdatedAt, Change: "yearly", Priority: "0.2"},
		{Location: baseURL + "/integracoes/api", LastModified: siteUpdatedAt, Change: "monthly", Priority: "0.8"},
		{Location: baseURL + "/white-label", LastModified: siteUpdatedAt, Change: "monthly", Priority: "0.7"},
	}
	for _, solution := range content.Solutions() {
		if solution.Slug != "api" && solution.Slug != "white-label" {
			urls = append(urls, sitemapURL{Location: baseURL + "/solucoes/" + solution.Slug, LastModified: siteUpdatedAt, Change: "monthly", Priority: "0.8"})
		}
	}
	for _, article := range content.Articles() {
		urls = append(urls, sitemapURL{Location: baseURL + "/blog/" + article.Slug, LastModified: article.UpdatedAt.Format("2006-01-02"), Change: "monthly", Priority: "0.7"})
	}
	response.Header().Set("Content-Type", "application/xml; charset=utf-8")
	response.Header().Set("Cache-Control", "public, max-age=3600")
	_, _ = response.Write([]byte(xml.Header))
	_ = xml.NewEncoder(response).Encode(sitemapURLSet{XMLNS: "http://www.sitemaps.org/schemas/sitemap/0.9", URLs: urls})
}

type rssDocument struct {
	XMLName xml.Name   `xml:"rss"`
	Version string     `xml:"version,attr"`
	Channel rssChannel `xml:"channel"`
}

type rssChannel struct {
	Title       string    `xml:"title"`
	Link        string    `xml:"link"`
	Description string    `xml:"description"`
	Language    string    `xml:"language"`
	Items       []rssItem `xml:"item"`
}

type rssItem struct {
	Title       string `xml:"title"`
	Link        string `xml:"link"`
	GUID        string `xml:"guid"`
	Description string `xml:"description"`
	PublishedAt string `xml:"pubDate"`
}

func (application *Application) feed(response http.ResponseWriter, request *http.Request) {
	baseURL := strings.TrimRight(application.config.SiteURL, "/")
	items := make([]rssItem, 0, len(content.Articles()))
	for _, article := range content.Articles() {
		link := baseURL + "/blog/" + article.Slug
		items = append(items, rssItem{Title: article.Title, Link: link, GUID: link, Description: article.Description, PublishedAt: article.PublishedAt.Format(time.RFC1123Z)})
	}
	document := rssDocument{Version: "2.0", Channel: rssChannel{
		Title: "Conteúdos Viagate", Link: baseURL + "/blog", Language: "pt-BR",
		Description: "Conteúdos sobre transporte, identidade, prevenção a fraudes e gestão de riscos.", Items: items,
	}}
	response.Header().Set("Content-Type", "application/rss+xml; charset=utf-8")
	response.Header().Set("Cache-Control", "public, max-age=3600")
	_, _ = response.Write([]byte(xml.Header))
	_ = xml.NewEncoder(response).Encode(document)
}

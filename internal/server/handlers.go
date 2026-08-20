package server

import (
	"net/http"

	"github.com/a-h/templ"
	"github.com/viagate/site/internal/content"
	"github.com/viagate/site/internal/site"
	"github.com/viagate/site/web/pages"
)

func (application *Application) home(response http.ResponseWriter, request *http.Request) {
	application.render(response, request, http.StatusOK, pages.Home(
		content.HomeMeta(application.config.SiteURL),
		content.MainSolutions(),
		content.Articles(),
	))
}

func (application *Application) solutions(response http.ResponseWriter, request *http.Request) {
	application.render(response, request, http.StatusOK, pages.Solutions(
		content.ListingMeta(
			application.config.SiteURL,
			"Soluções para gestão de riscos no transporte",
			"Conheça os produtos, capacidades e formas de integração da Viagate para pesquisa cadastral, identidade, prevenção e logística.",
			"/solucoes",
		),
		content.SolutionsByKind(site.SolutionKindProduct),
		content.SolutionsByKind(site.SolutionKindCapability),
		content.SolutionsByKind(site.SolutionKindDelivery),
	))
}

func (application *Application) tools(response http.ResponseWriter, request *http.Request) {
	application.render(response, request, http.StatusOK, pages.Tools(
		content.ListingMeta(
			application.config.SiteURL,
			"Ferramentas para transporte e gestão de riscos",
			"Conheça as ferramentas Viagate para pesquisa cadastral, autenticação, logística, prevenção veicular e monitoramento.",
			"/ferramentas",
		),
		content.SolutionsByKind(site.SolutionKindProduct),
	))
}

func (application *Application) solution(response http.ResponseWriter, request *http.Request) {
	solution, found := content.FindSolution(request.PathValue("slug"))
	if !found || solution.Slug == "api" || solution.Slug == "white-label" {
		application.notFound(response, request)
		return
	}
	path := "/solucoes/" + solution.Slug
	application.render(response, request, http.StatusOK, pages.Solution(
		content.SolutionMeta(application.config.SiteURL, solution, path),
		solution,
	))
}

func (application *Application) api(response http.ResponseWriter, request *http.Request) {
	application.renderSpecialSolution(response, request, "api", "/integracoes/api")
}

func (application *Application) whiteLabel(response http.ResponseWriter, request *http.Request) {
	application.renderSpecialSolution(response, request, "white-label", "/white-label")
}

func (application *Application) renderSpecialSolution(response http.ResponseWriter, request *http.Request, slug string, path string) {
	solution, found := content.FindSolution(slug)
	if !found {
		application.notFound(response, request)
		return
	}
	application.render(response, request, http.StatusOK, pages.Solution(
		content.SolutionMeta(application.config.SiteURL, solution, path),
		solution,
	))
}

func (application *Application) about(response http.ResponseWriter, request *http.Request) {
	application.render(response, request, http.StatusOK, pages.About(content.SimpleMeta(
		application.config.SiteURL,
		"Sobre a Viagate",
		"Conheça a Viagate e a tecnologia criada para tornar operações de transporte mais seguras, integradas e rastreáveis.",
		"/sobre",
		false,
	)))
}

func (application *Application) blog(response http.ResponseWriter, request *http.Request) {
	application.render(response, request, http.StatusOK, pages.Blog(
		content.ListingMeta(
			application.config.SiteURL,
			"Conteúdos sobre transporte, identidade e gestão de riscos",
			"Guias da Viagate sobre pesquisa cadastral, biometria, prevenção a fraudes e tecnologia para transporte.",
			"/blog",
		),
		content.Articles(),
	))
}

func (application *Application) article(response http.ResponseWriter, request *http.Request) {
	article, found := content.FindArticle(request.PathValue("slug"))
	if !found {
		application.notFound(response, request)
		return
	}
	application.render(response, request, http.StatusOK, pages.Article(
		content.ArticleMeta(application.config.SiteURL, article),
		article,
	))
}

func (application *Application) contact(response http.ResponseWriter, request *http.Request) {
	status := request.URL.Query().Get("status")
	interest := request.URL.Query().Get("interesse")
	application.render(response, request, http.StatusOK, pages.Contact(
		content.SimpleMeta(
			application.config.SiteURL,
			"Fale com a Viagate",
			"Converse com a equipe Viagate sobre biometria, pesquisa cadastral, prevenção de fraudes, logística e integrações.",
			"/contato",
			false,
		),
		status,
		interest,
	))
}

func (application *Application) legal(response http.ResponseWriter, request *http.Request) {
	application.render(response, request, http.StatusOK, pages.Legal(content.SimpleMeta(
		application.config.SiteURL,
		"Termos de uso e Política de privacidade",
		"Consulte os termos de uso e saiba como os dados pessoais enviados pelo site institucional da Viagate são tratados.",
		"/termos-uso-politica-privacidade",
		false,
	)))
}

func (application *Application) notFound(response http.ResponseWriter, request *http.Request) {
	application.render(response, request, http.StatusNotFound, pages.NotFound(content.SimpleMeta(
		application.config.SiteURL,
		"Página não encontrada",
		"A página solicitada não foi encontrada.",
		request.URL.Path,
		true,
	)))
}

func (application *Application) redirect(target string) http.HandlerFunc {
	return func(response http.ResponseWriter, request *http.Request) {
		http.Redirect(response, request, target, http.StatusMovedPermanently)
	}
}

func (application *Application) render(response http.ResponseWriter, request *http.Request, status int, component templ.Component) {
	response.Header().Set("Content-Type", "text/html; charset=utf-8")
	response.WriteHeader(status)
	if err := component.Render(request.Context(), response); err != nil {
		application.config.Logger.Error("template rendering failed", "error", err, "path", request.URL.Path)
	}
}

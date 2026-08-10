package server

import "net/http"

func (application *Application) routes() http.Handler {
	mux := http.NewServeMux()

	mux.HandleFunc("GET /{$}", application.home)
	mux.HandleFunc("GET /solucoes", application.solutions)
	mux.HandleFunc("GET /solucoes/{slug}", application.solution)
	mux.HandleFunc("GET /integracoes/api", application.api)
	mux.HandleFunc("GET /white-label", application.whiteLabel)
	mux.HandleFunc("GET /sobre", application.about)
	mux.HandleFunc("GET /blog", application.blog)
	mux.HandleFunc("GET /blog/{slug}", application.article)
	mux.HandleFunc("GET /contato", application.contact)
	mux.HandleFunc("POST /contato", application.submitContact)
	mux.HandleFunc("GET /politica-de-privacidade", application.privacy)
	mux.HandleFunc("GET /termos-de-uso", application.terms)
	mux.HandleFunc("GET /robots.txt", application.robots)
	mux.HandleFunc("GET /sitemap.xml", application.sitemap)
	mux.HandleFunc("GET /feed.xml", application.feed)
	mux.HandleFunc("GET /llms.txt", application.publicFile("public/llms.txt", "text/plain; charset=utf-8"))
	mux.HandleFunc("GET /llms-full.txt", application.publicFile("public/llms-full.txt", "text/plain; charset=utf-8"))
	mux.HandleFunc("GET /.well-known/security.txt", application.publicFile("public/.well-known/security.txt", "text/plain; charset=utf-8"))
	mux.HandleFunc("GET /favicon.svg", application.publicFile("public/favicon.svg", "image/svg+xml"))
	mux.HandleFunc("GET /site.webmanifest", application.publicFile("public/site.webmanifest", "application/manifest+json"))
	mux.Handle("GET /assets/", application.staticAssets())
	mux.HandleFunc("GET /cargo-score", application.redirect("/solucoes/pesquisa-cadastral-de-motoristas"))
	mux.HandleFunc("GET /cargo-truck", application.redirect("/solucoes/gestao-logistica"))
	mux.HandleFunc("GET /cargo-autenticador", application.redirect("/solucoes/autenticador-de-seguranca"))
	mux.HandleFunc("GET /biometria", application.redirect("/solucoes/biometria-facial"))
	mux.HandleFunc("/", application.notFound)

	return application.recoverPanic(
		application.securityHeaders(
			application.compress(
				application.logRequests(mux),
			),
		),
	)
}

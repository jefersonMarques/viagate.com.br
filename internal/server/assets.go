package server

import (
	"io/fs"
	"net/http"
	"os"
	"strings"

	staticfiles "github.com/viagate/site/web/static"
)

func (application *Application) staticAssets() http.Handler {
	var assets fs.FS

	if application.config.Environment == "production" {
		embeddedAssets, err := fs.Sub(staticfiles.Files, "assets")
		if err != nil {
			panic(err)
		}
		assets = embeddedAssets
	} else {
		assets = os.DirFS("web/static/assets")
	}

	fileServer := http.FileServer(http.FS(assets))
	return http.HandlerFunc(func(response http.ResponseWriter, request *http.Request) {
		if application.config.Environment == "production" {
			response.Header().Set("Cache-Control", "public, max-age=31536000, immutable")
		} else {
			response.Header().Set("Cache-Control", "no-store")
		}
		request.URL.Path = strings.TrimPrefix(request.URL.Path, "/assets")
		fileServer.ServeHTTP(response, request)
	})
}

func (application *Application) publicFile(path string, contentType string) http.HandlerFunc {
	return func(response http.ResponseWriter, request *http.Request) {
		content, err := staticfiles.Files.ReadFile(path)
		if err != nil {
			http.NotFound(response, request)
			return
		}
		response.Header().Set("Content-Type", contentType)
		response.Header().Set("Cache-Control", "public, max-age=3600")
		_, _ = response.Write(content)
	}
}

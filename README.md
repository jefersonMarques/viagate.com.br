# Viagate Site

Site institucional da Viagate desenvolvido com Go, templ e templUI. O projeto entrega HTML completo no servidor, sem hidratação e sem dependência de JavaScript para navegação ou conteúdo.

## Requisitos

- Go 1.25 ou superior
- templ 0.3.1001
- Task, opcional

## Início rápido

```bash
cp .env.example .env
set -a
. ./.env
set +a
go run ./cmd/server
```

Os arquivos Go gerados pelo templ já acompanham o projeto. Para alterar os templates, instale o gerador e atualize-os:

```bash
go install github.com/a-h/templ/cmd/templ@v0.3.1001
templ generate
```

Abra `http://localhost:8090`.

Com Task:

```bash
task tools
task dev
```

## Build de produção

```bash
task build
APP_ENV=production APP_ADDRESS=:8090 SITE_URL=https://viagate.com.br ./bin/viagate-site
```

O proxy reverso deve habilitar HTTP/2 ou HTTP/3, TLS, Brotli e cache de assets. O aplicativo já envia cache imutável para `/assets/` e os principais cabeçalhos de segurança.

## Estrutura

- `cmd/server`: inicialização do servidor.
- `internal/content`: conteúdo institucional, soluções e artigos.
- `internal/server`: rotas, handlers e middlewares.
- `internal/site`: modelos compartilhados pelas páginas.
- `web/components`: layout e componentes reutilizáveis.
- `web/pages`: páginas templ.
- `web/static`: CSS e arquivos públicos, sem JavaScript no caminho crítico.

## SEO e LLMs

O projeto inclui:

- HTML semântico renderizado no servidor.
- metadados exclusivos, canonical e Open Graph por página.
- JSON-LD para `Organization`, `WebSite`, `WebPage`, `SoftwareApplication`, `Article` e `BreadcrumbList`.
- `robots.txt`, `sitemap.xml`, `feed.xml`, `llms.txt` e `llms-full.txt`.
- rotas reais com `404` correto e redirecionamentos permanentes.
- artigos com autor, datas, referências e conteúdo rastreável.
- permissões explícitas para buscadores e robôs de IA.

## Imagens

Os quadros cinza e pontilhados são componentes de especificação. Cada quadro informa descrição, proporção e tamanho recomendado. Antes da publicação definitiva, substitua-os por imagens AVIF/WebP mantendo `width`, `height`, `srcset` e texto alternativo.

## Formulário de contato

Configure `CONTACT_WEBHOOK_URL` com um endpoint HTTPS que aceite JSON. Sem essa variável, o formulário permanece visível, mas retorna uma mensagem de indisponibilidade para evitar perda silenciosa de leads.

Antes de publicar, siga `docs/launch-checklist.md` para substituir imagens, revisar a migração de URLs, configurar indexação e validar o envio de contatos.

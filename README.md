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
go run github.com/a-h/templ/cmd/templ@v0.3.1001 generate
go run ./cmd/server
```

Os arquivos `.templ` são a fonte dos componentes. Sempre regenere os arquivos Go depois de alterar templates:

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

O proxy reverso deve habilitar HTTP/2 ou HTTP/3, TLS e Brotli/gzip. A aplicação não comprime respostas para evitar dupla compressão. Assets sem fingerprint usam cache público com revalidação, e os principais cabeçalhos de segurança são enviados pelo aplicativo.

Se o aplicativo estiver atrás de um proxy reverso, configure `TRUSTED_PROXY_CIDRS` apenas com os CIDRs dos proxies que podem fornecer `X-Forwarded-For` e `X-Real-IP`. O exemplo confia somente em loopback, adequado para um Nginx local.

## Estrutura

- `cmd/server`: inicialização do servidor.
- `internal/content`: conteúdo institucional, soluções e artigos.
- `internal/server`: rotas, handlers, integrações e middlewares.
- `internal/site`: modelos compartilhados pelas páginas.
- `web/components`: layout e componentes reutilizáveis.
- `web/pages`: páginas templ.
- `web/static`: CSS, JavaScript e arquivos públicos.

## SEO e LLMs

O projeto inclui:

- HTML semântico renderizado no servidor.
- metadados exclusivos, canonical e Open Graph por página.
- JSON-LD para `Organization`, `WebSite`, `WebPage`, `Service`, `Article`, `FAQPage` e `BreadcrumbList`.
- `robots.txt`, `sitemap.xml`, `feed.xml`, `llms.txt` e `llms-full.txt`.
- rotas reais com `404` correto e redirecionamentos permanentes.
- artigos com autor, datas, referências e conteúdo rastreável.
- permissões explícitas para buscadores e robôs de IA.

## Assets por página

O layout carrega apenas CSS e JavaScript globais e adiciona os módulos específicos de cada rota. A associação fica centralizada em `web/components/assets.go` para evitar que páginas como `/sobre` carreguem módulos de Cargo Score, biometria, monitoramento ou white label sem necessidade.

## Imagens

Os quadros cinza e pontilhados são componentes de especificação. Cada quadro informa descrição, proporção e tamanho recomendado. Antes da publicação definitiva, substitua-os por imagens AVIF/WebP mantendo `width`, `height`, `srcset` e texto alternativo.

## Formulário de contato

O envio principal é realizado pela API transacional do Brevo. Configure:

```bash
BREVO_API_KEY=
BREVO_CONTACT_NAME=ViaGate
BREVO_CONTACT_SUBJECT=Contato via site
BREVO_CONTACT_SENDER=no_reply@viagate.com.br
CONTACT_EMAIL=contato@viagate.com.br
```

O remetente configurado em `BREVO_CONTACT_SENDER` deve estar autorizado no Brevo. O e-mail recebido usa o visitante como `Reply-To`, permitindo responder diretamente ao contato sem utilizar o endereço informado pelo visitante como remetente.

`CONTACT_WEBHOOK_URL` é opcional. Quando configurado, o lead também é enviado em JSON ao webhook depois que o Brevo aceita o e-mail. Falhas no webhook são registradas, mas não invalidam um envio de e-mail já concluído.

Antes de publicar, siga `docs/launch-checklist.md` para substituir imagens, revisar a migração de URLs, configurar indexação e validar o envio de contatos.

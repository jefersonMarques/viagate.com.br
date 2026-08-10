# Checklist de lançamento

## Conteúdo e marca

- Substituir cada quadro pontilhado pela imagem descrita no próprio componente, usando AVIF/WebP e dimensões explícitas.
- Substituir a imagem social provisória em `web/static/assets/images/viagate-social.png` por uma arte final de 1200 × 630 px.
- Confirmar logotipo, telefone, e-mail, endereço e nomes comerciais dos produtos.
- Revisar textos legais e critérios de tratamento de dados com as áreas responsáveis.

## Configuração

- Definir `SITE_URL=https://viagate.com.br` no ambiente de produção.
- Configurar `CONTACT_WEBHOOK_URL` e realizar um envio real de ponta a ponta.
- Executar o binário atrás de TLS com HTTP/2 ou HTTP/3 e compressão Brotli no proxy.
- Manter o redirecionamento de HTTP para HTTPS e de variações do domínio para a URL canônica.

## Indexação

- Cadastrar o domínio no Google Search Console e no Bing Webmaster Tools.
- Enviar `https://viagate.com.br/sitemap.xml` nas duas plataformas.
- Validar as páginas de solução e artigo no teste de resultados avançados e no validador do Schema.org.
- Conferir `robots.txt`, `llms.txt`, `llms-full.txt`, RSS e códigos HTTP depois da publicação.
- Solicitar nova indexação das páginas prioritárias após a troca do site.

## Migração

- Mapear todas as URLs do site atual e adicionar redirecionamentos permanentes para a página equivalente.
- Não redirecionar páginas antigas sem equivalente para a home; retornar 404 ou 410 quando apropriado.
- Preservar títulos, conteúdos e backlinks relevantes durante a transição.
- Acompanhar erros 404, páginas excluídas e variações de tráfego nas primeiras semanas.

## Qualidade

- Executar `task check` antes de cada versão.
- Rodar Lighthouse em produção para desktop e celular; rede, TLS, imagens e scripts de terceiros podem alterar a pontuação.
- Monitorar Core Web Vitals com dados reais de usuários após acumular volume suficiente.
- Atualizar as datas do sitemap e dos artigos somente quando o conteúdo for realmente alterado.

## Robôs de IA

O `robots.txt` entregue permite indexação por buscadores e rastreadores de IA, inclusive os voltados a treinamento. Se a política da Viagate desejar permitir descoberta em respostas e bloquear treinamento, separar as regras para `OAI-SearchBot`/`ChatGPT-User` e `Claude-SearchBot`/`Claude-User` das regras para `GPTBot` e `ClaudeBot`.

`llms.txt` e `llms-full.txt` são complementares. Eles não substituem HTML rastreável, conteúdo original, dados estruturados, reputação da marca, links externos e desempenho real.

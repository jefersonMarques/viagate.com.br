package content

import (
	_ "embed"
	"html"
	"strings"
	"sync"
)

//go:embed legal_document.md
var legalDocumentMarkdown string

var (
	legalDocumentOnce sync.Once
	legalDocumentHTML string
)

func LegalDocumentHTML() string {
	legalDocumentOnce.Do(func() {
		legalDocumentHTML = renderLegalDocument(legalDocumentMarkdown)
	})
	return legalDocumentHTML
}

func renderLegalDocument(markdown string) string {
	var builder strings.Builder
	lines := strings.Split(strings.ReplaceAll(markdown, "\r\n", "\n"), "\n")
	sectionNumber := 0

	for _, rawLine := range lines {
		line := strings.TrimSpace(rawLine)
		if line == "" || line == "**Conteúdo integral do documento oficial**" || strings.HasPrefix(line, "[**Ir para Política de Privacidade**]") {
			continue
		}

		if strings.HasPrefix(line, "## ") {
			title := strings.TrimSpace(strings.TrimPrefix(line, "## "))
			if title == "Termos de Uso e Política de Privacidade" {
				continue
			}

			sectionNumber++
			id := legalHeadingID(title, sectionNumber)
			className := "legal-document-section"
			if id == "politica-de-privacidade" {
				className += " legal-document-section-break"
			}
			builder.WriteString(`<section class="` + className + `" id="` + id + `" aria-labelledby="` + id + `-title">`)
			builder.WriteString(`<h2 id="` + id + `-title">` + html.EscapeString(unescapeLegalMarkdown(title)) + `</h2>`)
			continue
		}

		if strings.HasPrefix(line, "### ") {
			title := strings.TrimSpace(strings.TrimPrefix(line, "### "))
			id := legalHeadingID(title, sectionNumber)
			builder.WriteString(`<h3 id="` + id + `">` + html.EscapeString(unescapeLegalMarkdown(title)) + `</h3>`)
			continue
		}

		if line == "Revista e em vigor desde 29/01/2021." {
			continue
		}

		if strings.HasPrefix(line, "**") && strings.HasSuffix(line, "**") && len(line) > 4 {
			content := strings.TrimSuffix(strings.TrimPrefix(line, "**"), "**")
			builder.WriteString(`<p class="legal-emphasis"><strong>` + html.EscapeString(unescapeLegalMarkdown(content)) + `</strong></p>`)
			continue
		}

		builder.WriteString(`<p>` + html.EscapeString(unescapeLegalMarkdown(line)) + `</p>`)
	}

	if sectionNumber > 0 {
		builder.WriteString(`</section>`)
	}

	return normalizeLegalSections(builder.String())
}

func normalizeLegalSections(rendered string) string {
	return strings.ReplaceAll(rendered, `</h2><section`, `</h2></section><section`)
}

func unescapeLegalMarkdown(value string) string {
	replacer := strings.NewReplacer(`\@`, `@`, `\.`, `.`, `\:`, `:`, `\/`, `/`)
	return replacer.Replace(value)
}

func legalHeadingID(title string, fallback int) string {
	ids := map[string]string{
		"DAS ABREVIAÇÕES.": "das-abreviacoes",
		"OBJETO.": "objeto",
		"ACEITE DOS TERMOS DE USO E DA POLÍTICA DE PRIVACIDADE": "aceite-dos-termos-de-uso-e-da-politica-de-privacidade",
		"UTILIZAÇÃO DO SISTEMA CARGO TRUCK": "utilizacao-do-sistema-cargo-truck",
		"UTILIZAÇÃO NO SISTEMA Score – Pesquisa Cadastral": "utilizacao-no-sistema-score-pesquisa-cadastral",
		"UTILIZAÇÃO NO SISTEMA Consulta Avulsa Biometria": "utilizacao-no-sistema-consulta-avulsa-biometria",
		"NÃO INTERMEDIAÇÃO DE PAGAMENTOS.": "nao-intermediacao-de-pagamentos",
		"6. RESPONSABILIDADE DO USUÁRIO SOBRE O TRANSPORTE DA CARGA": "responsabilidade-do-usuario-sobre-o-transporte-da-carga",
		"7. PROPRIEDADE INTELECTUAL": "propriedade-intelectual",
		"8. BLOQUEIO E EXCLUSÃO DA CONTA DE ACESSO AOS SISTEMAS DA VIA GATEWAY": "bloqueio-e-exclusao-da-conta-de-acesso",
		"9. PRAZO": "prazo",
		"10. RESCISÃO": "rescisao",
		"11. INDENIZAÇÃO": "indenizacao",
		"12. LIMITAÇÃO DE RESPONSABILIDADE": "limitacao-de-responsabilidade",
		"13. MODIFICAÇÕES": "modificacoes",
		"14. DISPOSIÇÕES GERAIS": "disposicoes-gerais-termos",
		"15. LEI E FORO APLICÁVEIS": "lei-e-foro-aplicaveis",
		"Política de Privacidade": "politica-de-privacidade",
		"2. QUAIS DADOS SÃO COLETADOS ?": "quais-dados-sao-coletados",
		"2.1 Cargo Truck": "dados-cargo-truck",
		"2.2 Score – Pesquisa Cadastral": "dados-score-pesquisa-cadastral",
		"2.3 Consulta Avulsa Biometria": "dados-consulta-avulsa-biometria",
		"3. COMO USAMOS OS DADOS COLETADOS?": "como-usamos-os-dados-coletados",
		"4. COMPARTILHAMENTO DE INFORMAÇÕES PESSOAIS COM TERCEIROS": "compartilhamento-de-informacoes-pessoais-com-terceiros",
		"5. COMO ARMAZENAMOS AS INFORMAÇÕES COLETADAS": "como-armazenamos-as-informacoes-coletadas",
		"6. CONTROLE DAS INFORMAÇÕES PESSOAIS": "controle-das-informacoes-pessoais",
		"7. DISPOSIÇÕES GERAIS": "disposicoes-gerais-privacidade",
		"8. ATUALIZAÇÕES DA POLÍTICA DE PRIVACIDADE": "atualizacoes-da-politica-de-privacidade",
		"9. ENCARREGADO DO TRATAMENTO DOS DADOS": "encarregado-do-tratamento-dos-dados",
	}
	if id, ok := ids[title]; ok {
		return id
	}
	return "secao-" + string(rune('0'+fallback))
}

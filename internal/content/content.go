package content

import (
	"time"

	"github.com/viagate/site/internal/site"
)

var solutions = []site.Solution{
	{
		Slug:            "pesquisa-cadastral-de-motoristas",
		Kind:            site.SolutionKindProduct,
		Name:            "Pesquisa cadastral de motoristas",
		ShortName:       "Cargo Score",
		Icon:            "user-check",
		Title:           "Centralize a pesquisa de motoristas e veículos em uma análise rastreável",
		Lead:            "Reúna biometria, telefone, CNH, ANTT, processos, dados veiculares e regras da operação para decidir com mais velocidade e padrão.",
		MetaDescription: "Pesquisa cadastral de motoristas e veículos com biometria, CNH, ANTT, processos, regras configuráveis e trilha de análise.",
		Summary:         "Padronize pesquisas cadastrais com biometria, documentos, consultas e regras configuradas para cada operação.",
		Definition:      "Cargo Score é a solução Viagate para pesquisa cadastral de motoristas, pessoas e veículos. O fluxo reúne validações de identidade, documentos, registros e critérios operacionais em uma análise documentada e revisável.",
		Audience:        "Seguradoras, gerenciadoras de risco, transportadoras e embarcadores que precisam padronizar análises cadastrais.",
		Challenge:       "Consultas dispersas, políticas diferentes e conferências manuais aumentam o tempo de resposta e dificultam a revisão.",
		Outcome:         "Uma visão organizada do cadastro, com critérios visíveis, histórico preservado e informações prontas para análise humana.",
		HeroDescription: "Motorista profissional sendo validado pelo Cargo Score, com caminhão ao fundo e interface de resultado cadastral em primeiro plano.",
		HeroSize:        "1600 x 1400 px - proporção 8:7",
		SectionTitle:    "Todos os sinais críticos dentro do mesmo processo",
		SectionText:     "Substitua verificações dispersas por uma análise organizada, com origem, status e regras parametrizadas para a operação.",
		ProcessTitle:    "Da solicitação ao resultado cadastral",
		ProcessText:     "Cada etapa preserva origem, status e critérios aplicados para que a equipe revise o resultado com contexto.",
		EvidenceTitle:   "Todos os sinais da análise em uma única visão",
		Features: []site.Feature{
			{Icon: "scan-face", Title: "Identidade e presença", Text: "Associe biometria facial e prova de vida ao cadastro que está sendo analisado."},
			{Icon: "badge-check", Title: "CNH, ANTT e registros", Text: "Reúna documentos e informações relevantes para a política de transporte contratada."},
			{Icon: "sliders", Title: "Políticas configuráveis", Text: "Aplique critérios compatíveis com perfis, apólices e necessidades operacionais."},
			{Icon: "history", Title: "Revisão e histórico", Text: "Acompanhe mudanças de status, reanálises e divergências sem perder o contexto."},
		},
		Steps: []site.Step{
			{Title: "Solicitação", Text: "A empresa inicia o cadastro pelo sistema ou pela integração."},
			{Title: "Consentimento", Text: "O motorista acessa o link e segue a jornada de validação."},
			{Title: "Processamento", Text: "Os dados são organizados conforme as regras da operação."},
			{Title: "Resultado", Text: "A equipe recebe informações estruturadas para apoiar a decisão."},
		},
		SecondaryImage: "Tela do Cargo Score com status cadastral, critérios analisados, fontes consultadas e trilha de auditoria.",
		SecondarySize:  "1800 x 900 px - proporção 2:1",
		FrequentlyAsked: []site.FAQ{
			{Question: "A pesquisa exige instalação de aplicativo?", Answer: "Não. A jornada de validação pode ser realizada pelo navegador do smartphone por meio de um link seguro."},
			{Question: "É possível integrar ao nosso sistema?", Answer: "Sim. A Viagate disponibiliza integrações para conectar a pesquisa cadastral ao fluxo já utilizado pela empresa."},
			{Question: "As regras podem variar por operação?", Answer: "Sim. Os critérios podem ser parametrizados de acordo com o perfil operacional e as políticas aplicáveis."},
		},
	},
	{
		Slug:            "biometria-facial",
		Kind:            site.SolutionKindCapability,
		Name:            "Biometria facial para motoristas",
		ShortName:       "Biometria facial",
		Icon:            "scan-face",
		Title:           "Confirme identidade e presença pelo navegador, sem instalar aplicativo",
		Lead:            "Envie um link, conduza a prova de vida pelo smartphone e receba o status biométrico dentro do processo da empresa.",
		MetaDescription: "Biometria facial com prova de vida para validar motoristas pelo navegador, WhatsApp, API ou ambiente white label.",
		Summary:         "Confirme identidade e presença pelo navegador do smartphone, com prova de vida e retorno para o fluxo da empresa.",
		Definition:      "A biometria facial Viagate é uma capacidade de confirmação de identidade e presença com prova de vida. A captura acontece pelo navegador de um dispositivo compatível e pode integrar cadastros, autenticações e jornadas próprias.",
		Audience:        "Empresas que precisam confirmar a identidade de motoristas, prestadores, clientes ou usuários em etapas digitais.",
		Challenge:       "Processos presenciais, aplicativos obrigatórios e capturas sem contexto criam atrito e dificultam a comprovação da validação.",
		Outcome:         "Uma validação acessível por link, com menos etapas para a pessoa e status devolvido ao processo da contratante.",
		HeroDescription: "Motorista realizando prova de vida pelo celular em um pátio logístico, com enquadramento profissional e iluminação natural.",
		HeroSize:        "1500 x 1500 px - proporção 1:1",
		SectionTitle:    "Confirmação de identidade sem aumentar a burocracia",
		SectionText:     "A pessoa recebe orientações objetivas, realiza a captura e conclui a prova de vida pelo próprio navegador.",
		ProcessTitle:    "Do link ao status biométrico",
		ProcessText:     "A validação percorre uma sequência curta, com instruções para a captura e devolução do resultado ao fluxo de origem.",
		EvidenceTitle:   "Uma experiência simples para quem valida e rastreável para quem solicita",
		Features: []site.Feature{
			{Icon: "globe", Title: "Acesso pelo navegador", Text: "A jornada funciona em smartphones e computadores com câmera compatível."},
			{Icon: "scan-face", Title: "Prova de vida", Text: "O fluxo verifica a presença da pessoa no momento da autenticação."},
			{Icon: "map-pin", Title: "Contexto do acesso", Text: "Registre informações de localização e dispositivo aplicáveis ao processo."},
			{Icon: "code", Title: "API e white label", Text: "Integre a tecnologia ao seu software ou utilize uma interface com a sua marca."},
		},
		Steps: []site.Step{
			{Title: "Gere o link", Text: "Inicie a validação no sistema ou por API."},
			{Title: "Compartilhe", Text: "Envie pelo canal utilizado pela sua operação."},
			{Title: "Realize a captura", Text: "A pessoa segue as orientações de câmera e prova de vida."},
			{Title: "Receba o status", Text: "O resultado retorna para o fluxo da empresa."},
		},
		SecondaryImage: "Sequência visual em quatro telas mostrando o fluxo completo de biometria facial no smartphone.",
		SecondarySize:  "1800 x 840 px - proporção 15:7",
		FrequentlyAsked: []site.FAQ{
			{Question: "A biometria funciona pelo WhatsApp?", Answer: "O link pode ser enviado pelo WhatsApp e a validação é realizada no navegador do aparelho."},
			{Question: "É possível utilizar a identidade visual da empresa?", Answer: "Sim. A experiência pode ser configurada em modalidade white label, conforme o projeto contratado."},
			{Question: "Posso usar somente a biometria?", Answer: "Sim. A tecnologia pode ser integrada como uma etapa independente ou combinada a outras soluções Viagate."},
		},
	},
	{
		Slug:            "autenticador-de-seguranca",
		Kind:            site.SolutionKindProduct,
		Name:            "Autenticador de segurança",
		ShortName:       "Cargo Autenticador",
		Icon:            "shield-check",
		Title:           "Confirme quem está do outro lado antes de liberar etapas sensíveis",
		Lead:            "Valide identidade e presença antes de adiantamentos, alterações bancárias, cadastros ou compartilhamento de informações.",
		MetaDescription: "Autenticador de segurança para transportadoras e motoristas com biometria facial, geolocalização e validação de dispositivo.",
		Summary:         "Confirme identidade, presença e contexto antes de pagamentos e outras etapas sensíveis da contratação de transporte.",
		Definition:      "Cargo Autenticador é a solução Viagate para adicionar uma confirmação de identidade antes de decisões sensíveis. Um link individual conduz a validação e devolve o resultado diretamente ao ambiente da empresa.",
		Audience:        "Transportadoras, embarcadores e operações que negociam com motoristas ou prestadores por canais digitais.",
		Challenge:       "Golpistas exploram urgência, troca de contatos e mensagens encaminhadas para interferir em negociações e pagamentos.",
		Outcome:         "Mais evidências antes da liberação financeira e menor dependência de informações recebidas por intermediários.",
		HeroDescription: "Contratante confirmando a identidade de um motorista em uma negociação digital segura, com interface de autenticação visível.",
		HeroSize:        "1600 x 1400 px - proporção 8:7",
		SectionTitle:    "Interrompa o golpe antes que o pagamento aconteça",
		SectionText:     "O Cargo Autenticador cria uma conexão segura entre empresa e motorista, reduzindo a dependência de intermediários e mensagens não verificadas.",
		ProcessTitle:    "Da solicitação à confirmação de identidade",
		ProcessText:     "A empresa inicia a validação, o motorista confirma sua identidade e o status retorna ao canal oficial da operação.",
		EvidenceTitle:   "Confirmação adicional nos momentos de maior risco",
		Features: []site.Feature{
			{Icon: "link", Title: "Link individual", Text: "Crie uma jornada vinculada ao CPF informado para iniciar a confirmação de identidade."},
			{Icon: "scan-face", Title: "Validação facial", Text: "Confirme se a pessoa que acessou o link corresponde à identidade apresentada."},
			{Icon: "smartphone", Title: "Contexto do acesso", Text: "Registre dados de localização e dispositivo aplicáveis à autenticação."},
			{Icon: "send", Title: "Envio direto", Text: "Receba as informações no ambiente da empresa, reduzindo interferências externas."},
		},
		Steps: []site.Step{
			{Title: "Solicite", Text: "A contratante cria uma autenticação para o motorista."},
			{Title: "Valide", Text: "O motorista realiza biometria e confirma informações."},
			{Title: "Confira", Text: "A empresa recebe o status e os dados do processo."},
			{Title: "Prossiga", Text: "A negociação continua com mais segurança e rastreabilidade."},
		},
		SecondaryImage: "Comparação entre o fluxo de golpe de adiantamento de frete e o fluxo protegido pelo Cargo Autenticador.",
		SecondarySize:  "1800 x 900 px - proporção 2:1",
		FrequentlyAsked: []site.FAQ{
			{Question: "Para quais processos o autenticador pode ser usado?", Answer: "Além da contratação de motoristas, ele pode apoiar confirmações de identidade e formulários que exijam maior segurança."},
			{Question: "O motorista precisa criar uma conta?", Answer: "A jornada é iniciada por link e foi desenhada para reduzir etapas desnecessárias."},
			{Question: "Os dados chegam por terceiros?", Answer: "O objetivo do fluxo é encaminhar as informações diretamente para o ambiente da empresa contratante."},
		},
	},
	{
		Slug:            "gestao-logistica",
		Kind:            site.SolutionKindProduct,
		Name:            "Gestão logística e viagens",
		ShortName:       "Cargo Truck",
		Icon:            "route",
		Title:           "Acompanhe a viagem do despacho à comprovação da entrega",
		Lead:            "Distribua atividades ao motorista e acompanhe coletas, entregas, posições, paradas e comprovantes pela Plataforma Cargo.",
		MetaDescription: "Gestão logística com aplicativo Cargo Truck para viagens, rastreamento, rotas, paradas, coletas e entregas.",
		Summary:         "Organize viagens, coletas, entregas, posições, paradas e comprovantes pelo smartphone do motorista.",
		Definition:      "Cargo Truck é o aplicativo Viagate que conecta o smartphone do motorista à Plataforma Cargo. A operação distribui atividades e acompanha os eventos registrados durante a execução da viagem.",
		Audience:        "Transportadoras, embarcadores e operadores logísticos que precisam acompanhar viagens sem depender apenas de contatos manuais.",
		Challenge:       "Atualizações por telefone e mensagens isoladas dificultam o acompanhamento, a comprovação e a reconstrução da viagem.",
		Outcome:         "Uma linha do tempo operacional com atividades, posições, paradas e comprovantes associados à viagem.",
		HeroDescription: "Motorista usando o aplicativo Cargo Truck diante de caminhões em um centro de distribuição moderno.",
		HeroSize:        "1600 x 1400 px - proporção 8:7",
		SectionTitle:    "A viagem conectada à equipe operacional",
		SectionText:     "O motorista recebe as atividades no aplicativo enquanto a equipe acompanha o andamento e os registros pela plataforma web.",
		ProcessTitle:    "Do planejamento à comprovação da entrega",
		ProcessText:     "A viagem mantém atividades e eventos em uma sequência única, facilitando o acompanhamento e a revisão posterior.",
		EvidenceTitle:   "A viagem reconstruída em uma linha do tempo operacional",
		Features: []site.Feature{
			{Icon: "package-check", Title: "Coletas e entregas", Text: "Organize atividades, destinos e instruções em uma jornada clara para o motorista."},
			{Icon: "map", Title: "Rastreamento", Text: "Registre posições durante a execução da viagem conforme as regras do processo."},
			{Icon: "coffee", Title: "Eventos de parada", Text: "Classifique descanso, alimentação, abastecimento, manutenção e outros eventos."},
			{Icon: "history", Title: "Linha do tempo", Text: "Revise a rota e os eventos registrados durante viagens concluídas."},
		},
		Steps: []site.Step{
			{Title: "Planeje", Text: "Cadastre a viagem, as coletas e as entregas."},
			{Title: "Distribua", Text: "O motorista recebe as atividades pelo aplicativo."},
			{Title: "Acompanhe", Text: "A equipe monitora posições, paradas e andamento."},
			{Title: "Comprove", Text: "Registre a conclusão e os comprovantes previstos no fluxo."},
		},
		SecondaryImage: "Interface da Plataforma Cargo com mapa, linha do tempo, paradas e comprovante de entrega.",
		SecondarySize:  "1800 x 900 px - proporção 2:1",
		FrequentlyAsked: []site.FAQ{
			{Question: "O aplicativo substitui um rastreador veicular?", Answer: "O Cargo Truck utiliza o smartphone para registrar a jornada. Necessidades de monitoramento satelital podem ser atendidas por integrações específicas."},
			{Question: "É possível enviar viagens por API?", Answer: "Sim. A operação pode integrar a criação de coletas, entregas e outras informações ao seu sistema."},
			{Question: "Os eventos ficam registrados?", Answer: "Sim. Os eventos aplicáveis à viagem compõem o histórico acompanhado pela equipe."},
		},
	},
	{
		Slug:            "prevencao-veicular",
		Kind:            site.SolutionKindProduct,
		Name:            "Prevenção e histórico veicular",
		ShortName:       "Prevenção",
		Icon:            "truck",
		Title:           "Controle multas, pendências e histórico veicular em um só fluxo",
		Lead:            "Acompanhe ocorrências da frota e consulte informações relevantes antes de cadastrar, contratar ou manter um veículo na operação.",
		MetaDescription: "Gestão de multas para frotas e histórico veicular com débitos, restrições, sinistros, leilões e situação documental.",
		Summary:         "Organize multas, prazos, débitos, restrições e histórico veicular para agir antes que a pendência gere impacto.",
		Definition:      "Prevenção Veicular reúne módulos de gestão de multas e consulta de histórico veicular. A composição pode organizar ocorrências da frota e apresentar dados disponíveis sobre documentação, débitos, restrições e registros de risco.",
		Audience:        "Gestores de frota, transportadoras, embarcadores e operações que analisam veículos próprios ou de terceiros.",
		Challenge:       "Prazos espalhados e consultas realizadas somente depois do problema aumentam retrabalho e prejuízos evitáveis.",
		Outcome:         "Pendências e sinais veiculares organizados para priorizar tratativas e apoiar decisões sobre a frota.",
		HeroDescription: "Gestor de frota analisando alertas de multas e histórico veicular em uma tela ampla, com caminhões ao fundo.",
		HeroSize:        "1600 x 1400 px - proporção 8:7",
		SectionTitle:    "Duas frentes para reduzir riscos veiculares",
		SectionText:     "Acompanhe multas e prazos da frota enquanto consulta dados relevantes antes de decisões sobre veículos.",
		ProcessTitle:    "Do cadastro do veículo à tratativa da pendência",
		ProcessText:     "O processo reúne consulta, análise e acompanhamento para que cada ocorrência tenha contexto e direcionamento.",
		EvidenceTitle:   "Multas e histórico veicular apresentados com contexto",
		Features: []site.Feature{
			{Icon: "file-warning", Title: "Gestão de multas", Text: "Organize ocorrências, prazos, valores e informações necessárias para o tratamento interno."},
			{Icon: "car-front", Title: "Histórico veicular", Text: "Consulte dados cadastrais, situação documental, restrições e registros relevantes."},
			{Icon: "receipt", Title: "Débitos e obrigações", Text: "Reúna informações sobre multas, IPVA, licenciamento e outras pendências disponíveis."},
			{Icon: "triangle-alert", Title: "Indicadores de risco", Text: "Analise registros de roubo, furto, sinistros, leilão, gravames e bloqueios quando disponíveis."},
		},
		Steps: []site.Step{
			{Title: "Cadastre", Text: "Adicione os veículos que fazem parte da operação."},
			{Title: "Consulte", Text: "Solicite o histórico ou sincronize ocorrências previstas."},
			{Title: "Analise", Text: "Revise pendências, restrições e informações complementares."},
			{Title: "Aja", Text: "Direcione a tratativa com contexto e prazo definidos."},
		},
		SecondaryImage: "Painel dividido entre gestão de multas e relatório detalhado de histórico veicular.",
		SecondarySize:  "1800 x 900 px - proporção 2:1",
		FrequentlyAsked: []site.FAQ{
			{Question: "Quais informações podem aparecer no histórico veicular?", Answer: "A disponibilidade pode incluir dados cadastrais, débitos, restrições, sinistros, leilão, roubo, furto e outras informações veiculares."},
			{Question: "A gestão de multas ajuda no controle de prazo?", Answer: "O módulo organiza ocorrências e dados necessários para que a equipe acompanhe e trate cada caso no momento adequado."},
			{Question: "Os módulos podem ser contratados separadamente?", Answer: "A composição depende da necessidade da operação e pode ser definida com a equipe comercial."},
		},
	},
	{
		Slug:            "monitoramento-de-veiculos",
		Kind:            site.SolutionKindProduct,
		Name:            "Monitoramento de veículos",
		ShortName:       "Monitoramento",
		Icon:            "map-pinned",
		Title:           "Centralize posições e alertas de veículos dentro da operação",
		Lead:            "Conecte dados de monitoramento compatíveis ao cadastro e às viagens acompanhadas pela Plataforma Cargo.",
		MetaDescription: "Monitoramento de veículos e viagens integrado a gerenciadoras de risco, com alertas e acompanhamento operacional.",
		Summary:         "Centralize posições, eventos e alertas disponibilizados por integrações de monitoramento compatíveis.",
		Definition:      "O módulo de Monitoramento centraliza na Plataforma Cargo as posições e os eventos fornecidos por integrações compatíveis. Ele conecta o acompanhamento do veículo ao cadastro e à viagem, sem substituir o equipamento ou a gerenciadora de origem.",
		Audience:        "Operações que utilizam gerenciadoras, rastreadores ou modalidades de acompanhamento integráveis à Plataforma Cargo.",
		Challenge:       "Dados de localização separados do cadastro e da viagem obrigam a equipe a alternar sistemas e reconstruir o contexto.",
		Outcome:         "Posições e eventos associados à operação, permitindo visualizar o acompanhamento junto às demais informações da viagem.",
		HeroDescription: "Central de monitoramento com mapa de rotas, alertas e veículos em deslocamento.",
		HeroSize:        "1600 x 1400 px - proporção 8:7",
		SectionTitle:    "Monitoramento conectado ao cadastro e à viagem",
		SectionText:     "Acompanhe veículos fixos ou viagens avulsas usando os dados disponibilizados pelas integrações contratadas.",
		ProcessTitle:    "Da integração ao acompanhamento operacional",
		ProcessText:     "A origem continua responsável pelo sinal de monitoramento; a Viagate organiza esses eventos dentro do contexto da operação.",
		EvidenceTitle:   "Posições e alertas junto às informações da viagem",
		Features: []site.Feature{
			{Icon: "map-pin", Title: "Posicionamento", Text: "Visualize os dados disponibilizados pela solução de monitoramento integrada."},
			{Icon: "bell-ring", Title: "Alertas", Text: "Receba eventos relevantes para apoiar a atuação da equipe."},
			{Icon: "route", Title: "Viagens avulsas", Text: "Configure acompanhamentos vinculados a operações específicas."},
			{Icon: "workflow", Title: "Integração operacional", Text: "Conecte monitoramento, cadastro e regras da operação em um fluxo único."},
		},
		Steps: []site.Step{
			{Title: "Integre", Text: "Conecte a gerenciadora compatível à Plataforma Cargo."},
			{Title: "Configure", Text: "Defina veículos, viagens e critérios aplicáveis."},
			{Title: "Acompanhe", Text: "Visualize posições e eventos disponibilizados."},
			{Title: "Responda", Text: "Direcione a tratativa operacional com mais contexto."},
		},
		SecondaryImage: "Mapa panorâmico com rotas, veículos monitorados e painel lateral de alertas.",
		SecondarySize:  "1800 x 900 px - proporção 2:1",
		FrequentlyAsked: []site.FAQ{
			{Question: "A Viagate possui integração com gerenciadoras?", Answer: "A disponibilidade depende da gerenciadora e da modalidade de monitoramento necessária para a operação."},
			{Question: "É possível monitorar somente uma viagem?", Answer: "Existem modelos de acompanhamento por viagem, conforme a integração e o projeto comercial."},
			{Question: "O monitoramento pode ser combinado ao Cargo Score?", Answer: "Sim. O ecossistema conecta pesquisa cadastral, viagem e monitoramento em uma jornada operacional."},
		},
	},
	{
		Slug:            "api",
		Kind:            site.SolutionKindDelivery,
		Name:            "APIs para transporte e gestão de riscos",
		ShortName:       "Integrações via API",
		Icon:            "code",
		Title:           "Integre biometria, CNH, ANTT e consultas ao seu software",
		Lead:            "Consuma capacidades Viagate no seu sistema e receba os resultados sem obrigar a equipe a abandonar o fluxo atual.",
		MetaDescription: "APIs para biometria facial, ANTT, CNH, consultas cadastrais e validação veicular para sistemas de transporte.",
		Summary:         "Conecte biometria, consultas cadastrais e informações operacionais aos sistemas já utilizados pela empresa.",
		Definition:      "As APIs Viagate são a forma de integrar validações e consultas aos sistemas da contratante. A composição pode incluir biometria, CNH, ANTT, dados cadastrais, informações veiculares e eventos de operação.",
		Audience:        "Empresas de software e equipes de tecnologia que precisam incorporar recursos Viagate a TMS, ERP, aplicativos ou fluxos internos.",
		Challenge:       "Trocar de sistema para executar cada validação aumenta atrito, duplica cadastros e fragmenta a experiência da equipe.",
		Outcome:         "Capacidades modulares incorporadas ao software atual, com retorno dos resultados ao processo de origem.",
		HeroDescription: "Equipe de tecnologia conectando a API Viagate a um software de gestão de transportes.",
		HeroSize:        "1600 x 1400 px - proporção 8:7",
		SectionTitle:    "Recursos Viagate incorporados ao seu produto",
		SectionText:     "Selecione as capacidades aplicáveis ao projeto e consuma os resultados no ambiente já utilizado pela empresa.",
		ProcessTitle:    "Do mapeamento técnico à entrada em produção",
		ProcessText:     "A integração começa pelo fluxo de negócio, passa por credenciais e homologação e segue para a operação acompanhada.",
		EvidenceTitle:   "Integração técnica alinhada ao processo de negócio",
		Features: []site.Feature{
			{Icon: "scan-face", Title: "Biometria facial", Text: "Inicie validações com prova de vida e receba o status no seu fluxo."},
			{Icon: "badge-check", Title: "ANTT e CNH", Text: "Consulte informações relevantes para processos de transporte e cadastro."},
			{Icon: "database", Title: "Consultas cadastrais", Text: "Integre análises e dados aplicáveis a pessoas e veículos."},
			{Icon: "braces", Title: "Operações personalizadas", Text: "Avalie endpoints e regras compatíveis com as necessidades do projeto."},
		},
		Steps: []site.Step{
			{Title: "Mapeamento", Text: "Entendemos o processo e os dados necessários."},
			{Title: "Credenciais", Text: "O ambiente e os acessos técnicos são preparados."},
			{Title: "Integração", Text: "Sua equipe implementa e testa o fluxo previsto."},
			{Title: "Operação", Text: "A integração entra em uso com acompanhamento inicial."},
		},
		SecondaryImage: "Diagrama técnico mostrando o software do cliente conectado às APIs de biometria, CNH, ANTT e veículos.",
		SecondarySize:  "1800 x 900 px - proporção 2:1",
		FrequentlyAsked: []site.FAQ{
			{Question: "Quais APIs estão disponíveis?", Answer: "A composição pode incluir biometria, ANTT, CNH, dados cadastrais, informações veiculares e outros recursos apresentados pela equipe técnica."},
			{Question: "A API pode ser usada em um aplicativo próprio?", Answer: "Sim. A integração pode conectar os recursos Viagate a sistemas web, aplicativos e processos internos compatíveis."},
			{Question: "Existe ambiente de testes?", Answer: "As condições de homologação e testes são definidas conforme a integração contratada."},
		},
	},
	{
		Slug:            "white-label",
		Kind:            site.SolutionKindDelivery,
		Name:            "Plataforma white label",
		ShortName:       "White label",
		Icon:            "palette",
		Title:           "Lance jornadas digitais com sua marca sem reconstruir a tecnologia",
		Lead:            "Use a infraestrutura Viagate com logotipo, cores, endereço e experiência configurados para o seu projeto.",
		MetaDescription: "Plataforma white label para biometria, pesquisa cadastral e logística com logotipo, cores e URL da empresa.",
		Summary:         "Disponibilize jornadas Viagate com identidade visual, endereço e experiência configurados para a sua marca.",
		Definition:      "White label é a modalidade que apresenta capacidades e jornadas Viagate com a identidade da empresa contratante. O projeto pode configurar marca, endereço e partes da experiência sem reconstruir toda a infraestrutura tecnológica.",
		Audience:        "Seguradoras, gerenciadoras, transportadoras e empresas de software que desejam oferecer uma experiência própria.",
		Challenge:       "Construir internamente biometria, consultas, segurança e operação exige investimento contínuo em produto e manutenção.",
		Outcome:         "Uma experiência alinhada à marca contratante, sustentada pela evolução da tecnologia Viagate dentro do escopo acordado.",
		HeroDescription: "Comparação elegante entre a plataforma padrão Viagate e uma interface white label personalizada.",
		HeroSize:        "1600 x 1400 px - proporção 8:7",
		SectionTitle:    "Sua marca na experiência, tecnologia Viagate na operação",
		SectionText:     "A modalidade preserva a base tecnológica enquanto apresenta uma interface coerente com o posicionamento da contratante.",
		ProcessTitle:    "Do briefing ao lançamento da experiência",
		ProcessText:     "Marca, requisitos e jornada são configurados, homologados e disponibilizados conforme o escopo do projeto.",
		EvidenceTitle:   "Uma experiência própria sem reconstruir a base tecnológica",
		Features: []site.Feature{
			{Icon: "palette", Title: "Identidade visual", Text: "Aplique logotipo, cores e elementos definidos para o projeto."},
			{Icon: "globe", Title: "Endereço exclusivo", Text: "Utilize uma URL configurada para facilitar o acesso da equipe e dos clientes."},
			{Icon: "workflow", Title: "Jornadas personalizadas", Text: "Adapte telas e comunicações previstas no escopo contratado."},
			{Icon: "refresh-cw", Title: "Tecnologia mantida", Text: "Conte com a evolução da plataforma sem desenvolver toda a infraestrutura internamente."},
		},
		Steps: []site.Step{
			{Title: "Briefing", Text: "Recebemos logotipo, paleta e requisitos de marca."},
			{Title: "Configuração", Text: "A interface e o ambiente são preparados."},
			{Title: "Homologação", Text: "Sua equipe revisa a experiência antes da liberação."},
			{Title: "Disponibilização", Text: "O ambiente personalizado é entregue para uso."},
		},
		SecondaryImage: "Kit visual da plataforma white label com telas desktop, mobile, paleta e endereço personalizado.",
		SecondarySize:  "1800 x 900 px - proporção 2:1",
		FrequentlyAsked: []site.FAQ{
			{Question: "Quais elementos podem ser personalizados?", Answer: "Logotipo, cores, endereço e partes da experiência podem ser configurados conforme o escopo comercial e técnico."},
			{Question: "O usuário visualiza a marca Viagate?", Answer: "O objetivo da modalidade white label é entregar uma experiência alinhada à marca contratante, conforme a configuração definida."},
			{Question: "É possível combinar white label e API?", Answer: "Sim. O projeto pode combinar interface personalizada e integrações, de acordo com a arquitetura necessária."},
		},
	},
}

var articles = []site.Article{
	{
		Slug:             "pesquisa-cadastral-de-motoristas",
		Category:         "Gestão de riscos",
		Title:            "Pesquisa cadastral de motoristas: o que avaliar antes da contratação",
		Description:      "Entenda como organizar consentimento, identidade, documentos, critérios e rastreabilidade na pesquisa cadastral de motoristas.",
		Summary:          "Uma pesquisa cadastral eficiente combina identidade, consentimento, fontes adequadas, regras objetivas e revisão humana quando necessária.",
		Author:           "Equipe Viagate",
		PublishedAt:      date(2026, time.July, 14),
		UpdatedAt:        date(2026, time.August, 7),
		ReadingTime:      "7 min de leitura",
		ImageDescription: "Analista de risco revisando dados de um motorista e de um caminhão em uma interface de pesquisa cadastral.",
		ImageSize:        "1600 x 900 px - proporção 16:9",
		Sections: []site.ArticleSection{
			{Heading: "O que é pesquisa cadastral de motoristas?", Paragraphs: []string{"Pesquisa cadastral de motoristas é o processo de reunir e organizar informações relevantes para verificar identidade, documentos e critérios definidos pela operação antes de uma contratação ou viagem.", "Ela não deve ser tratada como uma decisão automática e isolada. O resultado precisa ser contextualizado pela política da empresa, pela finalidade da consulta e pelas regras aplicáveis ao tratamento de dados."}},
			{Heading: "Quais informações fazem parte da análise?", Paragraphs: []string{"A composição depende da finalidade e das bases legalmente disponíveis. Em operações de transporte, os dados mais comuns envolvem identidade, CNH, situação cadastral, ANTT, veículo e registros necessários à política de gerenciamento de riscos."}, Items: []string{"Confirmação de identidade e prova de vida.", "Validade e categoria da CNH.", "Situação cadastral aplicável ao transportador.", "Dados e histórico do veículo.", "Trilha de consentimento, execução e revisão."}},
			{Heading: "Como reduzir erros e falsos positivos", Paragraphs: []string{"Nomes semelhantes, documentos desatualizados e fontes com naturezas diferentes podem gerar interpretações incorretas. Por isso, o sistema deve registrar a origem de cada informação, diferenciar fatos de alertas e encaminhar casos ambíguos para revisão humana.", "Regras excessivamente amplas aumentam ruído e podem bloquear pessoas sem justificativa. Critérios objetivos e auditáveis tornam a operação mais consistente."}},
			{Heading: "LGPD e finalidade da consulta", Paragraphs: []string{"A empresa precisa definir finalidade, base legal, retenção, acesso e medidas de segurança. A coleta deve se limitar ao necessário para o processo informado, com transparência para o titular e controles que reduzam acessos indevidos."}},
		},
		References: []site.Reference{{Label: "Lei Geral de Proteção de Dados Pessoais", URL: "https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm"}, {Label: "Registro Nacional de Transportadores Rodoviários de Cargas", URL: "https://www.gov.br/antt/pt-br/assuntos/cargas/rntrc"}},
	},
	{
		Slug:             "biometria-facial-no-transporte",
		Category:         "Identidade digital",
		Title:            "Biometria facial no transporte: segurança, experiência e LGPD",
		Description:      "Veja como biometria facial e prova de vida podem apoiar validações de motoristas sem criar uma jornada burocrática.",
		Summary:          "Biometria facial bem implementada confirma identidade e presença, registra contexto e aplica controles compatíveis com dados pessoais sensíveis.",
		Author:           "Equipe Viagate",
		PublishedAt:      date(2026, time.July, 22),
		UpdatedAt:        date(2026, time.August, 7),
		ReadingTime:      "6 min de leitura",
		ImageDescription: "Motorista realizando biometria facial pelo navegador do smartphone ao lado de um caminhão.",
		ImageSize:        "1600 x 900 px - proporção 16:9",
		Sections: []site.ArticleSection{
			{Heading: "Qual é a função da prova de vida?", Paragraphs: []string{"A comparação facial verifica semelhança entre a captura e uma referência. A prova de vida acrescenta sinais destinados a confirmar que a captura está acontecendo naquele momento, dificultando tentativas simples com fotografia ou reprodução de vídeo."}},
			{Heading: "Como deve ser a experiência do motorista", Paragraphs: []string{"O fluxo precisa explicar por que a validação está sendo realizada, solicitar permissões somente quando necessárias e orientar enquadramento, iluminação e movimentação de forma objetiva.", "Uma jornada pelo navegador reduz a necessidade de instalação de aplicativo e facilita o envio por canais já utilizados pela operação."}, Items: []string{"Orientações curtas antes de abrir a câmera.", "Mensagens específicas quando houver falha.", "Retomada segura quando a conexão oscilar.", "Alternativa de revisão quando a captura não puder ser concluída."}},
			{Heading: "Biometria é dado pessoal sensível", Paragraphs: []string{"A LGPD classifica dados biométricos vinculados a uma pessoa como dados pessoais sensíveis. Isso exige finalidade clara, base legal adequada, acesso restrito, segurança, retenção definida e prestação de informações ao titular."}},
			{Heading: "O que registrar para auditoria", Paragraphs: []string{"A trilha deve registrar autorização, horário, resultado técnico, contexto necessário e alterações de status sem expor dados além do necessário. Logs e imagens precisam ter políticas de retenção e acesso coerentes com a finalidade."}},
		},
		References: []site.Reference{{Label: "Lei Geral de Proteção de Dados Pessoais", URL: "https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm"}, {Label: "Autoridade Nacional de Proteção de Dados", URL: "https://www.gov.br/anpd/pt-br"}},
	},
	{
		Slug:             "como-reduzir-fraudes-no-frete",
		Category:         "Prevenção a fraudes",
		Title:            "Como reduzir fraudes na contratação e no pagamento de fretes",
		Description:      "Conheça controles de identidade, canal, pagamento e auditoria que ajudam a reduzir golpes em operações de transporte.",
		Summary:          "Reduzir fraude exige confirmar identidade, validar o canal, separar funções, revisar alterações e registrar evidências antes do pagamento.",
		Author:           "Equipe Viagate",
		PublishedAt:      date(2026, time.July, 30),
		UpdatedAt:        date(2026, time.August, 7),
		ReadingTime:      "8 min de leitura",
		ImageDescription: "Equipe de transporte confirmando a identidade de um motorista antes da liberação de um pagamento de frete.",
		ImageSize:        "1600 x 900 px - proporção 16:9",
		Sections: []site.ArticleSection{
			{Heading: "Por que o canal de comunicação importa", Paragraphs: []string{"Golpistas exploram urgência, troca de contato e informações obtidas fora do fluxo oficial. Quando a negociação acontece em mensagens isoladas, a empresa pode ter dificuldade para confirmar quem solicitou uma alteração e quais dados foram apresentados."}},
			{Heading: "Confirme identidade antes da etapa financeira", Paragraphs: []string{"A validação deve ocorrer antes da liberação de adiantamentos, alterações bancárias ou envio de documentos sensíveis. Um link individual, associado à pessoa esperada e devolvido diretamente ao ambiente da contratante, reduz a dependência de mensagens encaminhadas por terceiros."}},
			{Heading: "Controles operacionais recomendados", Items: []string{"Bloquear alterações bancárias sem nova confirmação.", "Validar identidade e presença em etapas de maior risco.", "Registrar dispositivo, horário e contexto necessários.", "Separar solicitação, aprovação e pagamento.", "Criar revisão manual para divergências ou mudanças fora do padrão."}},
			{Heading: "Tecnologia não substitui processo", Paragraphs: []string{"Biometria e autenticação aumentam a qualidade das evidências, mas precisam estar integradas a regras operacionais. Treinamento, comunicação clara, segregação de funções e monitoramento de exceções continuam essenciais."}},
		},
		References: []site.Reference{{Label: "Cartilha de Segurança para Internet", URL: "https://cartilha.cert.br/"}, {Label: "Lei Geral de Proteção de Dados Pessoais", URL: "https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm"}},
	},
}

func Solutions() []site.Solution {
	return append([]site.Solution(nil), solutions...)
}

func MainSolutions() []site.Solution {
	slugs := []string{
		"pesquisa-cadastral-de-motoristas",
		"autenticador-de-seguranca",
		"biometria-facial",
		"gestao-logistica",
	}
	selected := make([]site.Solution, 0, len(slugs))
	for _, slug := range slugs {
		if solution, found := FindSolution(slug); found {
			selected = append(selected, solution)
		}
	}
	return selected
}

func SolutionsByKind(kind site.SolutionKind) []site.Solution {
	selected := make([]site.Solution, 0, len(solutions))
	for _, solution := range solutions {
		if solution.Kind == kind {
			selected = append(selected, solution)
		}
	}
	return selected
}

func FindSolution(slug string) (site.Solution, bool) {
	for _, solution := range solutions {
		if solution.Slug == slug {
			return solution, true
		}
	}
	return site.Solution{}, false
}

func Articles() []site.Article {
	return append([]site.Article(nil), articles...)
}

func FindArticle(slug string) (site.Article, bool) {
	for _, article := range articles {
		if article.Slug == slug {
			return article, true
		}
	}
	return site.Article{}, false
}

func date(year int, month time.Month, day int) time.Time {
	return time.Date(year, month, day, 9, 0, 0, 0, time.FixedZone("America/Sao_Paulo", -3*60*60))
}

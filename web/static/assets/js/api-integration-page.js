const initializeApiIntegrationPage = () => {
  if (window.location.pathname !== "/integracoes/api") {
    return;
  }

  const writeText = (element, value) => {
    if (element instanceof HTMLElement) {
      element.textContent = value;
    }
  };

  const proofItems = Array.from(document.querySelectorAll(".solution-command-proof > div"));
  if (proofItems.length >= 2) {
    writeText(proofItems[0].querySelector("small"), "ARQUITETURA");
    writeText(proofItems[0].querySelector("strong"), "Seu sistema no centro");
    writeText(proofItems[1].querySelector("small"), "MODELO");
    writeText(proofItems[1].querySelector("strong"), "Capacidades modulares");
  }

  const positioning = document.querySelector(".solution-positioning");
  if (positioning instanceof HTMLElement) {
    positioning.className = "solution-positioning api-page-positioning";
    positioning.innerHTML = `
      <div class="container api-page-intro">
        <span class="eyebrow">Integração sem trocar de sistema</span>
        <h2>A Viagate entra no seu fluxo, não no lugar dele.</h2>
        <p>A API funciona como uma camada entre o software da empresa e as capacidades Viagate. Seu TMS, ERP, aplicativo ou sistema interno continua sendo o ponto de origem da solicitação e o destino do resultado.</p>
      </div>
      <div class="container api-page-positioning-grid">
        <article><small>01 / ORIGEM</small><h3>Seu software permanece central</h3><p>A equipe continua operando no ambiente que já utiliza, reduzindo troca de telas e duplicação de cadastros.</p></article>
        <article><small>02 / COMPOSIÇÃO</small><h3>Integre somente o que o projeto precisa</h3><p>Biometria, CNH, ANTT, dados cadastrais e informações veiculares podem compor a integração conforme o escopo técnico contratado.</p></article>
        <article><small>03 / RETORNO</small><h3>O resultado volta ao processo de origem</h3><p>Depois do processamento, o sistema da empresa recebe o retorno e decide como continuar o próprio fluxo de negócio.</p></article>
      </div>
    `;
  }

  const capabilitiesSection = document.querySelector(".solution-capabilities");
  if (capabilitiesSection instanceof HTMLElement) {
    capabilitiesSection.className = "section solution-capabilities api-page-capabilities";
    capabilitiesSection.innerHTML = `
      <div class="container api-page-heading">
        <div><span class="eyebrow">Capacidades modulares</span><h2>Uma camada de integração para diferentes pontos da operação</h2></div>
        <p>A composição não precisa ser igual para todas as empresas. O projeto define quais capacidades entram no fluxo e em que momento cada uma é acionada.</p>
      </div>
      <div class="container api-capability-ledger">
        <article><span>01 / IDENTITY</span><h3>Biometria facial</h3><p>Inicie jornadas de validação de identidade e receba o status dentro do processo integrado.</p><i></i></article>
        <article><span>02 / DRIVER</span><h3>CNH</h3><p>Consulte informações aplicáveis ao cadastro e às regras do processo contratado.</p><i></i></article>
        <article><span>03 / TRANSPORT</span><h3>ANTT</h3><p>Incorpore informações de transporte quando fizerem parte do escopo da integração.</p><i></i></article>
        <article><span>04 / DATA</span><h3>Cadastro</h3><p>Conecte análises e informações cadastrais aos fluxos já existentes no software da empresa.</p><i></i></article>
        <article><span>05 / VEHICLE</span><h3>Veículo</h3><p>Inclua informações veiculares compatíveis com a capacidade e o projeto contratado.</p><i></i></article>
      </div>
      <div class="container api-scope-note"><span>PROJECT / SCOPE</span><strong>Endpoints, campos e retornos são definidos conforme a capacidade e o escopo contratado.</strong></div>
    `;
  }

  const processSection = document.querySelector("#como-funciona.solution-process");
  if (processSection instanceof HTMLElement) {
    processSection.className = "solution-process api-page-process";
    processSection.innerHTML = `
      <div class="container api-page-process-heading">
        <div><span class="product-overline"><span></span> Integração / 05 etapas</span><h2>Do fluxo de negócio à operação integrada</h2></div>
        <p>A integração começa entendendo onde a capacidade entra no seu processo. Só depois entram credenciais, implementação, homologação e operação.</p>
      </div>
      <div class="container api-page-process-layout">
        <ol class="api-page-process-track">
          <li><span>01</span><div><small>DISCOVERY</small><h3>Mapeie o fluxo</h3><p>Defina o ponto de entrada, os dados necessários e o que o seu sistema fará com o resultado.</p></div></li>
          <li><span>02</span><div><small>ACCESS</small><h3>Prepare o acesso</h3><p>Ambiente, credenciais e condições técnicas são configurados conforme o projeto.</p></div></li>
          <li><span>03</span><div><small>BUILD</small><h3>Implemente a integração</h3><p>Sua equipe conecta a capacidade ao TMS, ERP, aplicativo ou serviço interno.</p></div></li>
          <li><span>04</span><div><small>VALIDATE</small><h3>Homologue o fluxo</h3><p>Requisições, retornos e tratamentos previstos são testados antes da liberação operacional.</p></div></li>
          <li><span>05</span><div><small>RUN</small><h3>Entre em operação</h3><p>O fluxo passa a consumir as capacidades definidas e devolver os resultados ao sistema de origem.</p></div></li>
        </ol>
        <aside class="api-integration-contract" aria-label="Resumo conceitual da integração">
          <div class="api-integration-contract-head"><small>INTEGRATION / CONTRACT</small><strong>FLUXO CONTROLADO PELO CLIENTE</strong></div>
          <div class="api-integration-contract-row"><span>AUTH</span><strong>Acesso autorizado</strong><i></i></div>
          <div class="api-integration-contract-row"><span>REQUEST</span><strong>Capacidade solicitada</strong><i></i></div>
          <div class="api-integration-contract-row"><span>PROCESS</span><strong>Viagate processa</strong><i></i></div>
          <div class="api-integration-contract-row"><span>RESPONSE</span><strong>Resultado devolvido</strong><i></i></div>
          <div class="api-integration-contract-result"><small>DESTINO</small><strong>SEU SISTEMA</strong><span>o fluxo continua na aplicação de origem</span></div>
        </aside>
      </div>
    `;
  }

  const evidenceSection = document.querySelector(".solution-evidence");
  if (evidenceSection instanceof HTMLElement) {
    evidenceSection.className = "section solution-evidence api-page-evidence";
    evidenceSection.innerHTML = `
      <div class="container api-evidence-layout">
        <div class="api-evidence-copy">
          <span class="eyebrow">Arquitetura operacional</span>
          <h2>Uma integração pode atender diferentes momentos do seu processo.</h2>
          <p>O software da empresa decide quando solicitar uma capacidade. A Viagate recebe, direciona o processamento e devolve o resultado para que o fluxo original continue.</p>
          <a class="button button-outline" href="/contato?interesse=api">Conversar sobre a integração</a>
        </div>
        <div class="api-architecture-shell" aria-label="Arquitetura conceitual da API Viagate">
          <div class="api-architecture-top"><span>ARCH / API</span><strong>REQUEST → CAPABILITY → RESPONSE</strong></div>
          <div class="api-architecture-flow">
            <article><small>01 / CLIENT</small><strong>SEU SISTEMA</strong><span>TMS • ERP • APP</span></article><i aria-hidden="true"></i>
            <article><small>02 / GATEWAY</small><strong>VIAGATE API</strong><span>AUTH • ROUTING</span></article><i aria-hidden="true"></i>
            <article><small>03 / CAPABILITY</small><strong>RECURSO</strong><span>BIO • CNH • ANTT • DATA • VEHICLE</span></article><i aria-hidden="true"></i>
            <article class="is-result"><small>04 / RETURN</small><strong>RESULTADO</strong><span>VOLTA AO CLIENTE</span></article>
          </div>
          <div class="api-architecture-foot"><span><i></i> COMPOSIÇÃO POR PROJETO</span><small>Disponibilidade e formato dependem da capacidade contratada.</small></div>
        </div>
      </div>
    `;
  }

  const faqSection = document.querySelector(".faq-section");
  if (faqSection instanceof HTMLElement) {
    faqSection.className = "section faq-section api-page-faq";
    faqSection.innerHTML = `
      <div class="container faq-layout">
        <div><span class="eyebrow">Dúvidas frequentes</span><h2>Perguntas sobre integração via API</h2><p class="api-faq-intro">A arquitetura final depende do sistema da empresa e das capacidades previstas no projeto.</p></div>
        <div class="faq-list">
          <details><summary>Preciso trocar meu sistema para usar a API?<span>+</span></summary><p>Não. A proposta da integração é incorporar capacidades Viagate ao software já utilizado pela empresa, desde que o ambiente seja tecnicamente compatível.</p></details>
          <details><summary>Quais capacidades podem fazer parte da integração?<span>+</span></summary><p>A composição pode incluir biometria, CNH, ANTT, dados cadastrais, informações veiculares e outros recursos apresentados pela equipe técnica conforme o projeto.</p></details>
          <details><summary>Posso integrar em TMS, ERP ou aplicativo próprio?<span>+</span></summary><p>Sim. A arquitetura pode atender sistemas web, aplicativos e processos internos compatíveis. O desenho técnico é definido a partir do fluxo que precisa consumir o recurso.</p></details>
          <details><summary>Existe ambiente para homologação?<span>+</span></summary><p>As condições de testes, homologação, credenciais e entrada em produção são definidas conforme a integração contratada.</p></details>
          <details><summary>Os campos e retornos são iguais em todos os projetos?<span>+</span></summary><p>Não necessariamente. A disponibilidade de recursos, campos e formatos depende da capacidade utilizada e do escopo técnico contratado.</p></details>
        </div>
      </div>
    `;

    const callToAction = faqSection.nextElementSibling;
    if (callToAction instanceof HTMLElement) {
      writeText(callToAction.querySelector("h2"), "Leve as capacidades Viagate para dentro do seu software");
      writeText(callToAction.querySelector("p"), "Agende uma conversa técnica para mapear o fluxo, as capacidades necessárias e o formato de integração.");
      writeText(callToAction.querySelector("a"), "Conversar sobre API");
    }
  }
};

initializeApiIntegrationPage();

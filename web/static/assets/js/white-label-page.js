const initializeWhiteLabelPage = () => {
  if (window.location.pathname !== "/white-label") {
    return;
  }

  const setText = (element, value) => {
    if (element instanceof HTMLElement) {
      element.textContent = value;
    }
  };

  const proofItems = Array.from(document.querySelectorAll(".solution-command-proof > div"));
  if (proofItems.length >= 2) {
    setText(proofItems[0].querySelector("small"), "PERSONALIZAÇÃO");
    setText(proofItems[0].querySelector("strong"), "Marca e identidade visual");
    setText(proofItems[1].querySelector("small"), "BASE");
    setText(proofItems[1].querySelector("strong"), "Tecnologia Viagate mantida");
  }

  const positioning = document.querySelector(".solution-positioning");
  if (positioning instanceof HTMLElement) {
    positioning.className = "solution-positioning wl-page-positioning";
    positioning.innerHTML = `
      <div class="container wl-page-intro">
        <span class="eyebrow">Sua marca na experiência</span>
        <h2>A interface muda. A base tecnológica continua a mesma.</h2>
        <p>O White Label permite apresentar jornadas Viagate com a identidade da empresa contratante. Logo, cores, endereço e partes da experiência podem ser configurados conforme o escopo definido para o projeto.</p>
      </div>
      <div class="container wl-page-positioning-grid">
        <article><small>01 / IDENTIDADE</small><h3>Apresente sua própria marca</h3><p>Logo, cor principal e elementos visuais deixam a experiência coerente com a identidade da empresa.</p></article>
        <article><small>02 / ACESSO</small><h3>Use um endereço configurado para o projeto</h3><p>O ambiente pode utilizar uma URL definida para facilitar o acesso e manter a jornada alinhada à marca contratante.</p></article>
        <article><small>03 / TECNOLOGIA</small><h3>Evite reconstruir a infraestrutura</h3><p>A base tecnológica permanece mantida pela Viagate dentro do escopo contratado, enquanto a camada de apresentação é adaptada.</p></article>
      </div>
    `;
  }

  const capabilities = document.querySelector(".solution-capabilities");
  if (capabilities instanceof HTMLElement) {
    capabilities.className = "section solution-capabilities wl-page-capabilities";
    capabilities.innerHTML = `
      <div class="container wl-page-heading">
        <div><span class="eyebrow">Camadas do White Label</span><h2>Personalize o que o usuário vê sem duplicar a base do produto</h2></div>
        <p>A personalização é aplicada à experiência prevista no projeto. A tecnologia operacional continua sendo evoluída sobre a mesma base Viagate.</p>
      </div>
      <div class="container wl-layer-layout">
        <div class="wl-customization-ledger">
          <article><span>01 / BRAND</span><h3>Identidade visual</h3><p>Logo, cores e elementos de marca definidos para a experiência.</p><i></i></article>
          <article><span>02 / URL</span><h3>Endereço do ambiente</h3><p>URL configurada conforme a arquitetura e o escopo do projeto.</p><i></i></article>
          <article><span>03 / JOURNEY</span><h3>Jornadas configuradas</h3><p>Telas e comunicações previstas podem ser ajustadas dentro do escopo contratado.</p><i></i></article>
          <article><span>04 / CORE</span><h3>Tecnologia mantida</h3><p>A empresa não precisa reconstruir toda a infraestrutura para apresentar uma experiência própria.</p><i></i></article>
        </div>
        <aside class="wl-layer-stack" aria-label="Camadas conceituais do White Label">
          <div class="wl-layer-stack-head"><small>WHITE LABEL / STACK</small><strong>MESMA BASE, OUTRA IDENTIDADE</strong></div>
          <div class="wl-layer is-brand"><span>CAMADA 03</span><strong>SUA MARCA</strong><small>LOGO • CORES • URL</small></div>
          <div class="wl-layer is-experience"><span>CAMADA 02</span><strong>EXPERIÊNCIA</strong><small>TELAS • JORNADAS • COMUNICAÇÃO</small></div>
          <div class="wl-layer is-core"><span>CAMADA 01</span><strong>VIAGATE CORE</strong><small>PLATAFORMA • SEGURANÇA • EVOLUÇÃO</small></div>
          <div class="wl-layer-stack-foot"><i></i><span>CONFIGURAÇÃO POR PROJETO</span></div>
        </aside>
      </div>
    `;
  }

  const process = document.querySelector("#como-funciona.solution-process");
  if (process instanceof HTMLElement) {
    process.className = "solution-process wl-page-process";
    process.innerHTML = `
      <div class="container wl-page-process-heading">
        <div><span class="product-overline"><span></span> Implantação / 04 etapas</span><h2>Da identidade visual à disponibilização do ambiente</h2></div>
        <p>O projeto começa pela marca e pelos requisitos da jornada, passa por configuração e homologação e só então é disponibilizado para uso.</p>
      </div>
      <div class="container wl-page-process-layout">
        <ol class="wl-page-process-track">
          <li><span>01</span><div><small>BRIEFING</small><h3>Receba os elementos da marca</h3><p>Logo, paleta e requisitos necessários para a experiência são definidos com a equipe responsável.</p></div></li>
          <li><span>02</span><div><small>CONFIG</small><h3>Configure o ambiente</h3><p>A identidade e os pontos previstos da jornada são aplicados ao projeto.</p></div></li>
          <li><span>03</span><div><small>REVIEW</small><h3>Homologue a experiência</h3><p>A contratante revisa o ambiente e valida os ajustes antes da liberação.</p></div></li>
          <li><span>04</span><div><small>LIVE</small><h3>Disponibilize para uso</h3><p>O ambiente personalizado entra em operação conforme o escopo acordado.</p></div></li>
        </ol>
        <aside class="wl-brand-spec" aria-label="Resumo conceitual de configuração da marca">
          <div class="wl-brand-spec-head"><small>BRAND / PROFILE</small><strong>CONFIGURAÇÃO DO AMBIENTE</strong></div>
          <div class="wl-brand-spec-row"><span>LOGO</span><strong>Aplicada</strong><i></i></div>
          <div class="wl-brand-spec-row"><span>PALETA</span><strong>Configurada</strong><i></i></div>
          <div class="wl-brand-spec-row"><span>URL</span><strong>Definida</strong><i></i></div>
          <div class="wl-brand-spec-row"><span>JORNADA</span><strong>Homologada</strong><i></i></div>
          <div class="wl-brand-spec-result"><small>STATUS</small><strong>READY / WHITE LABEL</strong><span>experiência pronta para disponibilização</span></div>
        </aside>
      </div>
    `;
  }

  const evidence = document.querySelector(".solution-evidence");
  if (evidence instanceof HTMLElement) {
    evidence.className = "section solution-evidence wl-page-evidence";
    evidence.innerHTML = `
      <div class="container wl-evidence-layout">
        <div class="wl-evidence-copy">
          <span class="eyebrow">Mesma estrutura, outra apresentação</span>
          <h2>O usuário reconhece sua marca. A operação continua sobre a mesma plataforma.</h2>
          <p>A comparação abaixo é conceitual: a estrutura permanece estável enquanto identidade, destaques e elementos previstos do projeto mudam para refletir a contratante.</p>
          <a class="button button-outline" href="/contato?interesse=white-label">Conversar sobre White Label</a>
        </div>
        <div class="wl-compare-shell" aria-label="Comparação conceitual entre duas identidades sobre a mesma interface">
          <article class="wl-compare-window is-cargo">
            <header><strong>CARGO</strong><span>Transporte</span><span>Score</span><i></i></header>
            <div><small>ANÁLISES RECENTES</small><p><span></span><b>Motorista aprovado</b></p><p><span></span><b>Motorista em atenção</b></p><p><span></span><b>Motorista aprovado</b></p></div>
            <footer>PERFIL / ORIGINAL</footer>
          </article>
          <div class="wl-compare-arrow" aria-hidden="true">→</div>
          <article class="wl-compare-window is-brand">
            <header><strong>NEXA</strong><span>Transporte</span><span>Score</span><i></i></header>
            <div><small>ANÁLISES RECENTES</small><p><span></span><b>Motorista aprovado</b></p><p><span></span><b>Motorista em atenção</b></p><p><span></span><b>Motorista aprovado</b></p></div>
            <footer>PERFIL / WHITE LABEL</footer>
          </article>
        </div>
      </div>
    `;
  }

  const faq = document.querySelector(".faq-section");
  if (faq instanceof HTMLElement) {
    faq.className = "section faq-section wl-page-faq";
    faq.innerHTML = `
      <div class="container faq-layout">
        <div><span class="eyebrow">Dúvidas frequentes</span><h2>Perguntas sobre White Label</h2><p class="wl-faq-intro">O nível de personalização depende do escopo comercial e técnico definido para cada projeto.</p></div>
        <div class="faq-list">
          <details><summary>O que pode ser personalizado?<span>+</span></summary><p>Logo, cores, endereço e partes da experiência podem ser configurados conforme o escopo comercial e técnico do projeto.</p></details>
          <details><summary>Posso utilizar um endereço próprio para o ambiente?<span>+</span></summary><p>O projeto pode utilizar uma URL configurada para a experiência, conforme a arquitetura definida na contratação.</p></details>
          <details><summary>A estrutura do produto precisa ser reconstruída para cada marca?<span>+</span></summary><p>Não. A proposta do White Label é preservar a base tecnológica e aplicar a identidade da contratante sobre a experiência prevista no projeto.</p></details>
          <details><summary>A experiência pode ser combinada com integrações via API?<span>+</span></summary><p>Sim. White Label e API podem fazer parte do mesmo projeto quando a arquitetura exigir interface personalizada e integração com outros sistemas.</p></details>
          <details><summary>A marca Viagate sempre aparece para o usuário final?<span>+</span></summary><p>O objetivo da modalidade é apresentar uma experiência alinhada à marca contratante. A forma final de identificação e apresentação depende da configuração acordada para o projeto.</p></details>
        </div>
      </div>
    `;

    const callToAction = faq.nextElementSibling;
    if (callToAction instanceof HTMLElement) {
      setText(callToAction.querySelector("h2"), "Coloque sua marca sobre uma tecnologia já pronta para operar");
      setText(callToAction.querySelector("p"), "Agende uma conversa para definir identidade visual, endereço, jornada e escopo de personalização do seu ambiente White Label.");
      setText(callToAction.querySelector("a"), "Conversar sobre White Label");
    }
  }
};

initializeWhiteLabelPage();

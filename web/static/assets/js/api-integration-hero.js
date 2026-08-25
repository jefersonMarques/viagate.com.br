const initializeApiIntegrationHero = () => {
  if (window.location.pathname !== "/integracoes/api") {
    return;
  }

  const panel = document.querySelector(".solution-command-grid .solution-signal-panel");

  if (!(panel instanceof HTMLElement)) {
    return;
  }

  panel.className = "solution-signal-panel api-flow-panel";
  panel.setAttribute("aria-label", "Representação conceitual de uma requisição passando pelo gateway da API Viagate, sendo roteada para diferentes capacidades e retornando ao sistema de origem");
  panel.innerHTML = `
    <div class="signal-panel-grid" aria-hidden="true"></div>

    <div class="api-flow-topbar">
      <span><i aria-hidden="true"></i> VIAGATE / API</span>
      <small data-api-badge>READY / WAITING REQUEST</small>
    </div>

    <div class="api-flow-stage">
      <svg class="api-flow-lines" viewBox="0 0 760 420" preserveAspectRatio="none" aria-hidden="true">
        <path class="api-flow-line" data-api-request-path d="M92 174 H300"></path>

        <path class="api-flow-branch" data-api-branch="biometria" d="M438 146 H520 V67 H648"></path>
        <path class="api-flow-branch" data-api-branch="cnh" d="M438 168 H548 V137 H648"></path>
        <path class="api-flow-branch" data-api-branch="antt" d="M438 190 H560 V207 H648"></path>
        <path class="api-flow-branch" data-api-branch="cadastro" d="M438 212 H548 V277 H648"></path>
        <path class="api-flow-branch" data-api-branch="veiculo" d="M438 234 H520 V347 H648"></path>

        <rect class="api-flow-junction" x="295" y="169" width="10" height="10"></rect>
        <rect class="api-flow-junction" x="295" y="281" width="10" height="10"></rect>

        <g class="api-flow-packet" data-api-packet>
          <rect x="-7" y="-7" width="14" height="14"></rect>
          <path d="M-5 4 L4 -5 M0 6 L6 0 M-6 0 L0 -6"></path>
        </g>
      </svg>

      <div class="api-flow-client" data-api-client>
        <small>CLIENT / SYSTEM</small>
        <strong>SEU SISTEMA</strong>
        <span>ERP • TMS • APP</span>
      </div>

      <div class="api-flow-gateway" data-api-gateway>
        <small>VIAGATE / CORE</small>
        <strong>API GATEWAY</strong>
        <span>Uma integração para acessar capacidades diferentes.</span>
        <div class="api-flow-gateway-state">
          <small>STATE</small>
          <b data-api-gateway-state>READY</b>
        </div>
      </div>

      <div class="api-flow-modules">
        <article class="api-flow-module" data-api-module="biometria"><span>01</span><div><small>CAPABILITY</small><strong>BIOMETRIA</strong></div><i></i></article>
        <article class="api-flow-module" data-api-module="cnh"><span>02</span><div><small>CAPABILITY</small><strong>CNH</strong></div><i></i></article>
        <article class="api-flow-module" data-api-module="antt"><span>03</span><div><small>CAPABILITY</small><strong>ANTT</strong></div><i></i></article>
        <article class="api-flow-module" data-api-module="cadastro"><span>04</span><div><small>CAPABILITY</small><strong>CADASTRO</strong></div><i></i></article>
        <article class="api-flow-module" data-api-module="veiculo"><span>05</span><div><small>CAPABILITY</small><strong>VEÍCULO</strong></div><i></i></article>
      </div>

      <div class="api-flow-payload" data-api-payload>
        <small data-api-payload-type>REQUEST / BIOMETRIA</small>
        <strong data-api-payload-status>REQUEST CREATED</strong>
        <span data-api-payload-detail>O sistema envia uma solicitação para a capacidade necessária.</span>
      </div>
    </div>

    <div class="api-flow-footer">
      <div class="api-flow-steps" aria-hidden="true">
        <div class="api-flow-step" data-api-step="0"><i></i><span><small>01</small><strong>REQUEST</strong></span></div>
        <div class="api-flow-step" data-api-step="1"><i></i><span><small>02</small><strong>AUTH</strong></span></div>
        <div class="api-flow-step" data-api-step="2"><i></i><span><small>03</small><strong>ROUTED</strong></span></div>
        <div class="api-flow-step" data-api-step="3"><i></i><span><small>04</small><strong>RESPONSE</strong></span></div>
      </div>
    </div>

    <div class="api-flow-summary" data-api-summary>
      <div class="api-flow-summary-card">
        <small>VIAGATE / API</small>
        <h3>5 capacidades. 1 integração.</h3>
        <p>Seu sistema continua sendo o ponto de origem e destino do fluxo.</p>
        <div class="api-flow-summary-grid">
          <div><strong>05</strong><span>CAPACIDADES DEMONSTRADAS</span></div>
          <div><strong>01</strong><span>CAMADA DE INTEGRAÇÃO</span></div>
          <div><strong>READY</strong><span>SEU FLUXO CONTINUA</span></div>
        </div>
      </div>
    </div>
  `;

  const requestPath = panel.querySelector("[data-api-request-path]");
  const packet = panel.querySelector("[data-api-packet]");
  const badge = panel.querySelector("[data-api-badge]");
  const gateway = panel.querySelector("[data-api-gateway]");
  const gatewayState = panel.querySelector("[data-api-gateway-state]");
  const client = panel.querySelector("[data-api-client]");
  const payload = panel.querySelector("[data-api-payload]");
  const payloadType = panel.querySelector("[data-api-payload-type]");
  const payloadStatus = panel.querySelector("[data-api-payload-status]");
  const payloadDetail = panel.querySelector("[data-api-payload-detail]");
  const steps = Array.from(panel.querySelectorAll("[data-api-step]"));
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const desktopLayout = window.matchMedia("(min-width: 621px)");

  const alignGateway = () => {
    if (!(gateway instanceof HTMLElement)) {
      return;
    }

    if (desktopLayout.matches) {
      gateway.style.left = "45.25%";
      return;
    }

    gateway.style.removeProperty("left");
  };

  alignGateway();
  desktopLayout.addEventListener("change", alignGateway);
  window.addEventListener("pagehide", () => desktopLayout.removeEventListener("change", alignGateway), { once: true });

  if (!(requestPath instanceof SVGPathElement) || !(packet instanceof SVGGElement)) {
    return;
  }

  const capabilities = [
    { key: "biometria", label: "BIOMETRIA" },
    { key: "cnh", label: "CNH" },
    { key: "antt", label: "ANTT" },
    { key: "cadastro", label: "CADASTRO" },
    { key: "veiculo", label: "VEÍCULO" }
  ];

  let cycleToken = 0;
  let isVisible = true;

  const setText = (element, value) => {
    if (element instanceof HTMLElement) {
      element.textContent = value;
    }
  };

  const wait = (delay, token) => new Promise((resolve) => {
    window.setTimeout(() => resolve(token === cycleToken && isVisible), delay);
  });

  const setPhase = (activeIndex) => {
    steps.forEach((step, index) => {
      step.classList.toggle("is-active", index === activeIndex);
      step.classList.toggle("is-complete", index < activeIndex);
    });
  };

  const clearModules = () => {
    panel.querySelectorAll("[data-api-module]").forEach((module) => {
      module.classList.remove("is-active", "is-done");
    });
    panel.querySelectorAll("[data-api-branch]").forEach((branch) => {
      branch.classList.remove("is-active");
    });
  };

  const setPayload = ({ type, status, detail, response = false }) => {
    setText(payloadType, type);
    setText(payloadStatus, status);
    setText(payloadDetail, detail);

    if (payload instanceof HTMLElement) {
      payload.classList.toggle("is-response", response);
    }
  };

  const setPacketPoint = (path, fraction) => {
    const length = path.getTotalLength();
    const point = path.getPointAtLength(length * fraction);
    packet.setAttribute("transform", `translate(${point.x} ${point.y})`);
  };

  const animatePacket = (path, from, to, duration, token) => new Promise((resolve) => {
    const startedAt = performance.now();

    const tick = (now) => {
      if (token !== cycleToken || !isVisible) {
        resolve(false);
        return;
      }

      const progress = Math.min(1, duration === 0 ? 1 : (now - startedAt) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      const fraction = from + ((to - from) * eased);
      setPacketPoint(path, fraction);

      if (progress >= 1) {
        resolve(true);
        return;
      }

      window.requestAnimationFrame(tick);
    };

    window.requestAnimationFrame(tick);
  });

  const prepareCycle = (capability) => {
    panel.classList.remove("show-summary");
    clearModules();
    steps.forEach((step) => step.classList.remove("is-active", "is-complete"));

    if (client instanceof HTMLElement) {
      client.classList.remove("is-received");
    }
    if (gateway instanceof HTMLElement) {
      gateway.classList.remove("is-complete");
    }

    requestPath.classList.remove("is-active", "is-response");
    packet.classList.remove("is-response");
    packet.classList.add("is-visible");

    setPacketPoint(requestPath, 0);
    setText(badge, `REQUEST / ${capability.label}`);
    setText(gatewayState, "READY");
    setPayload({
      type: `REQUEST / ${capability.label}`,
      status: "REQUEST CREATED",
      detail: "O sistema envia uma solicitação para a capacidade necessária."
    });
  };

  const runCapability = async (capability, token) => {
    prepareCycle(capability);

    setPhase(0);
    requestPath.classList.add("is-active");
    setText(gatewayState, "RECEIVING");
    if (!(await animatePacket(requestPath, 0, 1, prefersReducedMotion ? 0 : 900, token))) return false;

    setPhase(1);
    setText(badge, "AUTHORIZED");
    setText(gatewayState, "AUTHORIZED");
    setPayload({
      type: `REQUEST / ${capability.label}`,
      status: "AUTHORIZED",
      detail: "A solicitação passa pela camada de acesso antes do roteamento."
    });
    if (!(await wait(prefersReducedMotion ? 0 : 650, token))) return false;

    const branch = panel.querySelector(`[data-api-branch="${capability.key}"]`);
    const module = panel.querySelector(`[data-api-module="${capability.key}"]`);

    if (!(branch instanceof SVGPathElement) || !(module instanceof HTMLElement)) {
      return false;
    }

    setPhase(2);
    branch.classList.add("is-active");
    module.classList.add("is-active");
    setText(badge, `ROUTED / ${capability.label}`);
    setText(gatewayState, "ROUTING");
    setPayload({
      type: `PROCESSING / ${capability.label}`,
      status: "ROUTED",
      detail: "O gateway direciona a solicitação para a capacidade correspondente."
    });
    if (!(await animatePacket(branch, 0, 1, prefersReducedMotion ? 0 : 820, token))) return false;

    setText(gatewayState, "PROCESSING");
    setPayload({
      type: `PROCESSING / ${capability.label}`,
      status: "WAITING RESULT",
      detail: "A capacidade processa a solicitação e devolve o resultado ao gateway."
    });
    if (!(await wait(prefersReducedMotion ? 0 : 900, token))) return false;

    module.classList.remove("is-active");
    module.classList.add("is-done");
    setText(gatewayState, "RESPONSE READY");
    if (!(await animatePacket(branch, 1, 0, prefersReducedMotion ? 0 : 680, token))) return false;

    setPhase(3);
    requestPath.classList.add("is-active", "is-response");
    packet.classList.add("is-response");
    setText(badge, "RESPONSE / RECEIVED");
    setText(gatewayState, "RETURNING");
    setPayload({
      type: `RESPONSE / ${capability.label}`,
      status: "RESULT RECEIVED",
      detail: "O resultado retorna ao sistema de origem para continuar o fluxo da empresa.",
      response: true
    });
    setPacketPoint(requestPath, 1);
    if (!(await animatePacket(requestPath, 1, 0, prefersReducedMotion ? 0 : 900, token))) return false;

    if (client instanceof HTMLElement) {
      client.classList.add("is-received");
    }
    if (gateway instanceof HTMLElement) {
      gateway.classList.add("is-complete");
    }
    setText(gatewayState, "COMPLETE");

    if (!(await wait(prefersReducedMotion ? 0 : 1050, token))) return false;
    return true;
  };

  const showSummary = async (token) => {
    packet.classList.remove("is-visible");
    clearModules();
    steps.forEach((step) => {
      step.classList.remove("is-active");
      step.classList.add("is-complete");
    });
    setText(badge, "CYCLE / COMPLETE");
    panel.classList.add("show-summary");
    return wait(prefersReducedMotion ? 0 : 2200, token);
  };

  const run = async (token) => {
    for (const capability of capabilities) {
      if (!(await runCapability(capability, token))) return;
    }

    if (!(await showSummary(token))) return;

    if (token === cycleToken && isVisible && !prefersReducedMotion) {
      void run(token);
    }
  };

  if (prefersReducedMotion) {
    panel.classList.add("show-summary");
    setText(badge, "API / READY");
    return;
  }

  const start = () => {
    isVisible = true;
    cycleToken += 1;
    void run(cycleToken);
  };

  const stop = () => {
    isVisible = false;
    cycleToken += 1;
  };

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          start();
        } else {
          stop();
        }
      });
    }, { threshold: 0.2 });

    observer.observe(panel);
    window.addEventListener("pagehide", () => observer.disconnect(), { once: true });
  } else {
    start();
  }

  window.addEventListener("pagehide", stop, { once: true });
};

initializeApiIntegrationHero();

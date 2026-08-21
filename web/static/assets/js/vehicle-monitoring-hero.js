const initializeVehicleMonitoringHero = () => {
  if (window.location.pathname !== "/solucoes/monitoramento-de-veiculos") {
    return;
  }

  const panel = document.querySelector(".solution-command-grid .solution-signal-panel");

  if (!(panel instanceof HTMLElement)) {
    return;
  }

  panel.className = "solution-signal-panel monitoring-motion-panel";
  panel.setAttribute("aria-label", "Representação conceitual de um conjunto veicular acompanhado por integrações de monitoramento e Cargo Truck");
  panel.innerHTML = `
    <div class="signal-panel-grid" aria-hidden="true"></div>
    <div class="monitoring-motion-topbar">
      <span><i aria-hidden="true"></i> VIAGATE / MONITORAMENTO</span>
      <small data-monitoring-badge>ACOMPANHAMENTO ONLINE</small>
    </div>
    <div class="monitoring-motion-stage">
      <div class="monitoring-motion-terrain" aria-hidden="true"></div>

      <div class="monitoring-motion-axis" aria-hidden="true">
        <div class="monitoring-motion-road"></div>
        <div class="monitoring-motion-road-nodes">
          <i></i><i></i><i></i><i></i><i></i><i></i><i></i>
        </div>
      </div>

      <div class="monitoring-motion-event" data-monitoring-event-box>
        <small>SINAL / LIVE</small>
        <strong data-monitoring-event>SINAL RECEBIDO</strong>
      </div>

      <div class="monitoring-motion-vehicle" aria-hidden="true">
        <div class="monitoring-motion-trail"></div>
        <div class="monitoring-motion-trailer">
          <i></i><i></i>
        </div>
        <div class="monitoring-motion-coupling"></div>
        <div class="monitoring-motion-cab"></div>
        <div class="monitoring-motion-vehicle-frame"></div>
      </div>

      <div class="monitoring-motion-link" aria-hidden="true"></div>
      <div class="monitoring-motion-readout">
        <small>MONITORANDO</small>
        <strong data-monitoring-speed>77 KM/H</strong>
        <span data-monitoring-motion-state>ATIVO EM MOVIMENTO</span>
      </div>

      <div class="monitoring-motion-radar" aria-hidden="true">
        <span class="monitoring-motion-radar-core"></span>
        <span class="monitoring-motion-wave"></span>
        <span class="monitoring-motion-wave"></span>
        <span class="monitoring-motion-wave"></span>
      </div>

      <div class="monitoring-motion-status" data-monitoring-status-box>
        <small>STATUS / 01</small>
        <strong data-monitoring-status>RASTREAMENTO CONECTADO</strong>
      </div>

      <div class="monitoring-motion-current-source">
        <small>FONTE ATIVA</small>
        <strong data-monitoring-source>RASTREADOR</strong>
      </div>

      <div class="monitoring-motion-sources" aria-label="Fontes que podem compor o monitoramento">
        <span data-monitoring-source-item><small>01</small><strong>ISCAS</strong></span>
        <span class="is-active" data-monitoring-source-item><small>02</small><strong>RASTREADORES</strong></span>
        <span data-monitoring-source-item><small>03</small><strong>PARCEIROS</strong></span>
        <span data-monitoring-source-item><small>04</small><strong>CARGO TRUCK</strong></span>
      </div>
    </div>
    <figcaption class="monitoring-motion-footer">
      <span><i aria-hidden="true"></i> OPERAÇÃO ACOMPANHADA</span>
      <strong data-monitoring-footer>MONITORAMENTO ATIVO</strong>
    </figcaption>
  `;

  const speed = panel.querySelector("[data-monitoring-speed]");
  const badge = panel.querySelector("[data-monitoring-badge]");
  const motionState = panel.querySelector("[data-monitoring-motion-state]");
  const eventBox = panel.querySelector("[data-monitoring-event-box]");
  const event = panel.querySelector("[data-monitoring-event]");
  const statusBox = panel.querySelector("[data-monitoring-status-box]");
  const status = panel.querySelector("[data-monitoring-status]");
  const source = panel.querySelector("[data-monitoring-source]");
  const sourceItems = Array.from(panel.querySelectorAll("[data-monitoring-source-item]"));
  const footer = panel.querySelector("[data-monitoring-footer]");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const states = [
    {
      speed: "77 KM/H",
      badge: "ACOMPANHAMENTO ONLINE",
      state: "ATIVO EM MOVIMENTO",
      event: "SINAL RECEBIDO",
      status: "RASTREAMENTO CONECTADO",
      source: "RASTREADOR",
      sourceIndex: 1,
      footer: "MONITORAMENTO ATIVO"
    },
    {
      speed: "79 KM/H",
      badge: "MONITORAMENTO ATIVO",
      state: "ACOMPANHAMENTO CONTÍNUO",
      event: "INTEGRAÇÃO ATIVA",
      status: "OPERAÇÃO ACOMPANHADA",
      source: "PARCEIRO",
      sourceIndex: 2,
      footer: "INTEGRAÇÕES CONECTADAS"
    },
    {
      speed: "80 KM/H",
      badge: "SINAL ATIVO",
      state: "ATIVO EM MOVIMENTO",
      event: "SINAL ATUALIZADO",
      status: "MONITORAMENTO CONECTADO",
      source: "ISCA",
      sourceIndex: 0,
      footer: "ACOMPANHAMENTO ONLINE"
    },
    {
      speed: "78 KM/H",
      badge: "CAMADA OPERACIONAL",
      state: "VIAGEM EM ACOMPANHAMENTO",
      event: "CARGO TRUCK CONECTADO",
      status: "CAMADAS INTEGRADAS",
      source: "CARGO TRUCK",
      sourceIndex: 3,
      footer: "OPERAÇÃO ACOMPANHADA"
    }
  ];

  let currentIndex = 0;
  let intervalId = null;
  let transitionId = null;

  const renderState = (state) => {
    if (speed instanceof HTMLElement) speed.textContent = state.speed;
    if (badge instanceof HTMLElement) badge.textContent = state.badge;
    if (motionState instanceof HTMLElement) motionState.textContent = state.state;
    if (source instanceof HTMLElement) source.textContent = state.source;
    if (footer instanceof HTMLElement) footer.textContent = state.footer;

    sourceItems.forEach((item, index) => {
      item.classList.toggle("is-active", index === state.sourceIndex);
    });

    if (eventBox instanceof HTMLElement) eventBox.classList.add("is-changing");
    if (statusBox instanceof HTMLElement) statusBox.classList.add("is-changing");

    if (transitionId !== null) {
      window.clearTimeout(transitionId);
    }

    transitionId = window.setTimeout(() => {
      if (event instanceof HTMLElement) event.textContent = state.event;
      if (status instanceof HTMLElement) status.textContent = state.status;
      if (eventBox instanceof HTMLElement) eventBox.classList.remove("is-changing");
      if (statusBox instanceof HTMLElement) statusBox.classList.remove("is-changing");
      transitionId = null;
    }, prefersReducedMotion ? 0 : 140);
  };

  const start = () => {
    panel.classList.remove("is-paused");

    if (prefersReducedMotion || intervalId !== null) {
      return;
    }

    intervalId = window.setInterval(() => {
      currentIndex = (currentIndex + 1) % states.length;
      renderState(states[currentIndex]);
    }, 1500);
  };

  const stop = () => {
    panel.classList.add("is-paused");

    if (intervalId !== null) {
      window.clearInterval(intervalId);
      intervalId = null;
    }

    if (transitionId !== null) {
      window.clearTimeout(transitionId);
      transitionId = null;
    }
  };

  renderState(states[0]);

  if (prefersReducedMotion) {
    return;
  }

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
  }

  window.addEventListener("pagehide", stop, { once: true });
  start();
};

initializeVehicleMonitoringHero();

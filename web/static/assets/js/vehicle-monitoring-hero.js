const initializeVehicleMonitoringHero = () => {
  if (window.location.pathname !== "/solucoes/monitoramento-de-veiculos") {
    return;
  }

  const panel = document.querySelector(".solution-command-grid .solution-signal-panel");

  if (!(panel instanceof HTMLElement)) {
    return;
  }

  panel.className = "solution-signal-panel monitoring-motion-panel";
  panel.setAttribute("aria-label", "Representação conceitual de monitoramento veicular com integrações de rastreamento e Cargo Truck");
  panel.innerHTML = `
    <div class="signal-panel-grid" aria-hidden="true"></div>
    <div class="monitoring-motion-topbar">
      <span><i aria-hidden="true"></i> VIAGATE / MONITORAMENTO</span>
      <small data-monitoring-badge>MONITORAMENTO ATIVO</small>
    </div>
    <div class="monitoring-motion-stage">
      <div class="monitoring-motion-terrain" aria-hidden="true"></div>
      <div class="monitoring-motion-axis" aria-hidden="true">
        <div class="monitoring-motion-road"></div>
      </div>
      <div class="monitoring-motion-unit" aria-hidden="true"></div>
      <div class="monitoring-motion-link" aria-hidden="true"></div>
      <div class="monitoring-motion-readout">
        <small>MONITORANDO</small>
        <strong data-monitoring-speed>80 KM/H</strong>
        <span data-monitoring-motion-state>ATIVO EM MOVIMENTO</span>
      </div>
      <div class="monitoring-motion-radar" aria-hidden="true">
        <span class="monitoring-motion-wave"></span>
        <span class="monitoring-motion-wave"></span>
        <span class="monitoring-motion-wave"></span>
      </div>
      <div class="monitoring-motion-status" data-monitoring-status-box>
        <small>STATUS / 01</small>
        <strong data-monitoring-status>INTEGRAÇÃO ATIVA</strong>
      </div>
      <div class="monitoring-motion-source">ISCAS • RASTREADORES • PARCEIROS • CARGO TRUCK</div>
    </div>
    <figcaption class="monitoring-motion-footer">
      <span><i aria-hidden="true"></i> OPERAÇÃO ACOMPANHADA</span>
      <strong data-monitoring-footer>INTEGRAÇÕES CONECTADAS</strong>
    </figcaption>
  `;

  const speed = panel.querySelector("[data-monitoring-speed]");
  const badge = panel.querySelector("[data-monitoring-badge]");
  const motionState = panel.querySelector("[data-monitoring-motion-state]");
  const statusBox = panel.querySelector("[data-monitoring-status-box]");
  const status = panel.querySelector("[data-monitoring-status]");
  const footer = panel.querySelector("[data-monitoring-footer]");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const states = [
    { speed: "80 KM/H", badge: "MONITORAMENTO ATIVO", state: "ATIVO EM MOVIMENTO", status: "INTEGRAÇÃO ATIVA", footer: "INTEGRAÇÕES CONECTADAS" },
    { speed: "77 KM/H", badge: "ACOMPANHAMENTO ONLINE", state: "ATIVO EM MOVIMENTO", status: "RASTREAMENTO CONECTADO", footer: "OPERAÇÃO ACOMPANHADA" },
    { speed: "79 KM/H", badge: "MONITORAMENTO ATIVO", state: "ATIVO EM MOVIMENTO", status: "POSIÇÃO ATUALIZADA", footer: "MONITORAMENTO CONTÍNUO" },
    { speed: "81 KM/H", badge: "INTEGRAÇÃO ATIVA", state: "ATIVO EM MOVIMENTO", status: "CARGO TRUCK DISPONÍVEL", footer: "CAMADAS CONECTADAS" }
  ];

  let currentIndex = 0;
  let intervalId = null;

  const renderState = (state) => {
    if (speed instanceof HTMLElement) speed.textContent = state.speed;
    if (badge instanceof HTMLElement) badge.textContent = state.badge;
    if (motionState instanceof HTMLElement) motionState.textContent = state.state;
    if (footer instanceof HTMLElement) footer.textContent = state.footer;

    if (statusBox instanceof HTMLElement) {
      statusBox.classList.add("is-changing");
    }

    window.setTimeout(() => {
      if (status instanceof HTMLElement) status.textContent = state.status;
      if (statusBox instanceof HTMLElement) statusBox.classList.remove("is-changing");
    }, prefersReducedMotion ? 0 : 150);
  };

  const start = () => {
    panel.classList.remove("is-paused");

    if (prefersReducedMotion || intervalId !== null) {
      return;
    }

    intervalId = window.setInterval(() => {
      currentIndex = (currentIndex + 1) % states.length;
      renderState(states[currentIndex]);
    }, 1450);
  };

  const stop = () => {
    panel.classList.add("is-paused");

    if (intervalId !== null) {
      window.clearInterval(intervalId);
      intervalId = null;
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

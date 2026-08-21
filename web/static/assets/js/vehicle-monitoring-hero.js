const initializeVehicleMonitoringHero = () => {
  if (window.location.pathname !== "/solucoes/monitoramento-de-veiculos") {
    return;
  }

  const panel = document.querySelector(".solution-command-grid .solution-signal-panel");

  if (!(panel instanceof HTMLElement)) {
    return;
  }

  panel.className = "solution-signal-panel monitoring-map-panel";
  panel.setAttribute("aria-label", "Representação conceitual de uma viagem monitorada do Rio Grande do Sul ao Mato Grosso, seguida pelo resumo técnico da operação");
  panel.innerHTML = `
    <div class="signal-panel-grid" aria-hidden="true"></div>
    <div class="monitoring-map-topbar">
      <span><i aria-hidden="true"></i> VIAGATE / MONITORAMENTO</span>
      <small data-monitoring-badge>PREPARANDO ROTA</small>
    </div>

    <div class="monitoring-map-stage">
      <div class="monitoring-map-view" data-monitoring-map-view>
        <div class="monitoring-map-canvas" aria-hidden="true">
          <img src="/assets/images/monitoring-brazil-corridor.svg" alt=""/>
          <svg class="monitoring-route-svg" viewBox="0 0 1000 912" preserveAspectRatio="xMidYMid meet">
            <path class="monitoring-route-base" d="M462 776 L500 744 L519 718 L496 660 L530 630 L555 608 L515 585 L470 570 L431 566 L420 520 L414 465 L409 411"></path>
            <path class="monitoring-route-path" data-monitoring-route-path d="M462 776 L500 744 L519 718 L496 660 L530 630 L555 608 L515 585 L470 570 L431 566 L420 520 L414 465 L409 411"></path>
            <circle class="monitoring-route-node" data-monitoring-route-node r="5"></circle>
            <circle class="monitoring-route-node" data-monitoring-route-node r="5"></circle>
            <circle class="monitoring-route-node" data-monitoring-route-node r="5"></circle>
            <circle class="monitoring-route-node" data-monitoring-route-node r="5"></circle>
            <circle class="monitoring-route-node" data-monitoring-route-node r="5"></circle>
            <circle class="monitoring-route-node" data-monitoring-route-node r="5"></circle>
            <circle class="monitoring-route-marker" data-monitoring-route-marker r="7"></circle>
          </svg>
          <span class="monitoring-map-label monitoring-map-label-origin">RS <small>ORIGEM</small></span>
          <span class="monitoring-map-label monitoring-map-label-destination">MT <small>DESTINO</small></span>
        </div>

        <div class="monitoring-route-event" data-monitoring-event-card>
          <small data-monitoring-event-code>ROUTE / 01</small>
          <strong data-monitoring-event-title>MONITORAMENTO INICIADO</strong>
          <span data-monitoring-event-detail>Viagem vinculada às integrações disponíveis.</span>
        </div>

        <div class="monitoring-route-status">
          <small>ROTA / RS → MT</small>
          <strong data-monitoring-route-status>TRAÇANDO ROTA</strong>
          <div class="monitoring-route-meter" aria-hidden="true"><span data-monitoring-route-meter></span></div>
          <span data-monitoring-route-counter>00 / 06 REGISTROS</span>
        </div>
      </div>

      <div class="monitoring-summary-view" data-monitoring-summary-view>
        <div class="monitoring-summary-head">
          <div><small>TRIP / RESULT</small><strong>VIAGEM CONSOLIDADA</strong></div>
          <span>EXEMPLO OPERACIONAL</span>
        </div>

        <div class="monitoring-summary-route">
          <div><small>ROTA MONITORADA</small><strong>RS → MT</strong></div>
          <span><i></i> CONCLUÍDA</span>
        </div>

        <div class="monitoring-summary-grid">
          <article><small>ISCAS INTEGRADAS</small><strong>02</strong><span>associadas à viagem</span></article>
          <article><small>CARGO TRUCK</small><strong>ATIVO</strong><span>camada operacional</span></article>
          <article><small>USO DO APP</small><strong>SIM</strong><span>durante a operação</span></article>
          <article><small>REGISTROS</small><strong>06</strong><span>eventos demonstrativos</span></article>
          <article><small>FONTES CONECTADAS</small><strong>03</strong><span>integrações na viagem</span></article>
          <article><small>STATUS</small><strong>CONCLUÍDA</strong><span>histórico consolidado</span></article>
        </div>

        <div class="monitoring-summary-flow" aria-hidden="true">
          <span class="is-done"><i></i> ORIGEM</span>
          <span class="is-done"><i></i> SINAL</span>
          <span class="is-done"><i></i> APP</span>
          <span class="is-done"><i></i> DESTINO</span>
        </div>
      </div>
    </div>

    <figcaption class="monitoring-map-footer">
      <span><i aria-hidden="true"></i> OPERAÇÃO ACOMPANHADA</span>
      <strong data-monitoring-footer>ROTA RS → MT</strong>
    </figcaption>
  `;

  const badge = panel.querySelector("[data-monitoring-badge]");
  const footer = panel.querySelector("[data-monitoring-footer]");
  const routePath = panel.querySelector("[data-monitoring-route-path]");
  const marker = panel.querySelector("[data-monitoring-route-marker]");
  const routeNodes = Array.from(panel.querySelectorAll("[data-monitoring-route-node]"));
  const eventCard = panel.querySelector("[data-monitoring-event-card]");
  const eventCode = panel.querySelector("[data-monitoring-event-code]");
  const eventTitle = panel.querySelector("[data-monitoring-event-title]");
  const eventDetail = panel.querySelector("[data-monitoring-event-detail]");
  const routeStatus = panel.querySelector("[data-monitoring-route-status]");
  const routeMeter = panel.querySelector("[data-monitoring-route-meter]");
  const routeCounter = panel.querySelector("[data-monitoring-route-counter]");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!(routePath instanceof SVGPathElement) || !(marker instanceof SVGCircleElement)) {
    return;
  }

  const stops = [
    {
      fraction: 0,
      code: "RS / ORIGEM",
      title: "MONITORAMENTO INICIADO",
      detail: "Viagem vinculada às integrações disponíveis."
    },
    {
      fraction: 0.16,
      code: "SC / REGISTRO",
      title: "POSIÇÃO RECEBIDA",
      detail: "Primeiro ponto monitorado confirmado no corredor."
    },
    {
      fraction: 0.3,
      code: "PR / REGISTRO",
      title: "ISCA CONECTADA",
      detail: "Camada complementar validada durante a operação."
    },
    {
      fraction: 0.48,
      code: "SP / REGISTRO",
      title: "EVENTO REGISTRADO",
      detail: "Registro operacional sincronizado durante a passagem por São Paulo."
    },
    {
      fraction: 0.7,
      code: "MS / REGISTRO",
      title: "CARGO TRUCK ATIVO",
      detail: "Aplicativo disponível como apoio operacional."
    },
    {
      fraction: 1,
      code: "MT / DESTINO",
      title: "VIAGEM FINALIZADA",
      detail: "Histórico consolidado para acompanhamento da operação."
    }
  ];

  const routeLength = routePath.getTotalLength();
  let cycleToken = 0;
  let isVisible = true;
  let currentFraction = 0;

  const setText = (element, value) => {
    if (element instanceof HTMLElement) {
      element.textContent = value;
    }
  };

  const wait = (delay, token) => new Promise((resolve) => {
    window.setTimeout(() => resolve(token === cycleToken && isVisible), delay);
  });

  const pointAt = (fraction) => routePath.getPointAtLength(routeLength * fraction);

  const setMarker = (fraction) => {
    const point = pointAt(fraction);
    marker.setAttribute("cx", String(point.x));
    marker.setAttribute("cy", String(point.y));
  };

  const configureNodes = () => {
    routeNodes.forEach((node, index) => {
      if (!(node instanceof SVGCircleElement)) {
        return;
      }

      const stop = stops[index];
      const point = pointAt(stop.fraction);
      node.setAttribute("cx", String(point.x));
      node.setAttribute("cy", String(point.y));
    });
  };

  const moveMarker = (targetFraction, duration, token) => new Promise((resolve) => {
    const startFraction = currentFraction;
    const startedAt = performance.now();

    const tick = (now) => {
      if (token !== cycleToken || !isVisible) {
        resolve(false);
        return;
      }

      const progress = Math.min(1, (now - startedAt) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      const fraction = startFraction + ((targetFraction - startFraction) * eased);
      setMarker(fraction);

      if (progress >= 1) {
        currentFraction = targetFraction;
        resolve(true);
        return;
      }

      window.requestAnimationFrame(tick);
    };

    window.requestAnimationFrame(tick);
  });

  const showStop = async (stop, index, token) => {
    routeNodes.forEach((node, nodeIndex) => {
      node.classList.toggle("is-active", nodeIndex === index);
      node.classList.toggle("is-complete", nodeIndex <= index);
    });

    if (eventCard instanceof HTMLElement) {
      eventCard.classList.add("is-changing");
    }

    const stillCurrent = await wait(prefersReducedMotion ? 0 : 180, token);
    if (!stillCurrent) return false;

    setText(eventCode, stop.code);
    setText(eventTitle, stop.title);
    setText(eventDetail, stop.detail);
    setText(routeCounter, `${String(index + 1).padStart(2, "0")} / 06 REGISTROS`);

    if (routeMeter instanceof HTMLElement) {
      routeMeter.style.width = `${((index + 1) / stops.length) * 100}%`;
    }

    if (eventCard instanceof HTMLElement) {
      eventCard.classList.remove("is-changing");
      eventCard.classList.add("is-visible");
    }

    return true;
  };

  const resetCycle = () => {
    panel.classList.remove("show-summary", "is-route-drawing");
    routeNodes.forEach((node) => node.classList.remove("is-active", "is-complete"));
    routePath.style.transition = "none";
    routePath.style.strokeDasharray = String(routeLength);
    routePath.style.strokeDashoffset = String(routeLength);
    currentFraction = 0;
    setMarker(0);
    marker.classList.remove("is-visible");

    if (eventCard instanceof HTMLElement) {
      eventCard.classList.remove("is-visible", "is-changing");
    }

    if (routeMeter instanceof HTMLElement) {
      routeMeter.style.width = "0%";
    }

    setText(badge, "PREPARANDO ROTA");
    setText(footer, "ROTA RS → MT");
    setText(routeStatus, "TRAÇANDO ROTA");
    setText(routeCounter, "00 / 06 REGISTROS");
  };

  const runCycle = async (token) => {
    resetCycle();
    void routePath.getBoundingClientRect();

    if (token !== cycleToken || !isVisible) return;

    routePath.style.transition = prefersReducedMotion ? "none" : "stroke-dashoffset 1.65s cubic-bezier(.65,0,.35,1)";
    panel.classList.add("is-route-drawing");
    routePath.style.strokeDashoffset = "0";
    setText(badge, "TRAÇANDO ROTA");

    if (!(await wait(prefersReducedMotion ? 0 : 1800, token))) return;

    marker.classList.add("is-visible");
    setText(badge, "VIAGEM EM MONITORAMENTO");
    setText(routeStatus, "ACOMPANHAMENTO ATIVO");

    for (let index = 0; index < stops.length; index += 1) {
      const stop = stops[index];

      if (index > 0) {
        if (eventCard instanceof HTMLElement) {
          eventCard.classList.remove("is-visible");
        }

        if (!(await wait(prefersReducedMotion ? 0 : 220, token))) return;
        if (!(await moveMarker(stop.fraction, prefersReducedMotion ? 0 : 1100, token))) return;
      }

      if (!(await showStop(stop, index, token))) return;
      if (!(await wait(prefersReducedMotion ? 0 : 950, token))) return;
    }

    setText(badge, "VIAGEM CONSOLIDADA");
    setText(routeStatus, "DESTINO CONFIRMADO");
    setText(footer, "RESULTADO DA VIAGEM");

    if (!(await wait(prefersReducedMotion ? 0 : 1050, token))) return;

    panel.classList.add("show-summary");

    if (!(await wait(prefersReducedMotion ? 0 : 3800, token))) return;

    if (token === cycleToken && isVisible && !prefersReducedMotion) {
      void runCycle(token);
    }
  };

  configureNodes();

  if (prefersReducedMotion) {
    panel.classList.add("show-summary");
    setText(badge, "VIAGEM CONSOLIDADA");
    setText(footer, "RESULTADO DA VIAGEM");
    return;
  }

  const start = () => {
    isVisible = true;
    cycleToken += 1;
    void runCycle(cycleToken);
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

initializeVehicleMonitoringHero();

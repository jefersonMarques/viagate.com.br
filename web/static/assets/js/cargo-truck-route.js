const initializeCargoTruckRouteHero = () => {
  const currentPath = window.location.pathname.replace(/\/$/, "");

  if (currentPath !== "/solucoes/gestao-logistica") {
    return;
  }

  const panel = document.querySelector(".solution-command-grid .solution-signal-panel");

  if (!(panel instanceof HTMLElement)) {
    return;
  }

  panel.classList.add("cargo-truck-route-panel");
  panel.setAttribute("aria-label", "Mapa operacional conceitual com rota, deslocamento e eventos registrados durante uma viagem");
  panel.innerHTML = `
    <div class="signal-panel-grid" aria-hidden="true"></div>
    <div class="cargo-truck-route-topbar">
      <span><i aria-hidden="true"></i> VIAGATE / CARGO TRUCK</span>
      <small data-cargo-truck-route-status>ROTA EM PREPARAÇÃO</small>
    </div>
    <div class="cargo-truck-route-stage">
      <div class="cargo-truck-route-hud">
        <small>TRIP / 0427</small>
        <strong data-cargo-truck-route-current>Traçando rota</strong>
        <span data-cargo-truck-route-progress>00% DA VIAGEM</span>
      </div>
      <div class="cargo-truck-route-map">
        <svg class="cargo-truck-route-svg" viewBox="0 0 720 430" role="img" aria-label="Mapa operacional conceitual com rota e quatro eventos de viagem">
          <g aria-hidden="true">
            <rect class="cargo-truck-map-district" x="34" y="42" width="118" height="84"/>
            <rect class="cargo-truck-map-district" x="182" y="34" width="128" height="98"/>
            <rect class="cargo-truck-map-district" x="346" y="38" width="132" height="74"/>
            <rect class="cargo-truck-map-district" x="518" y="36" width="142" height="94"/>
            <rect class="cargo-truck-map-district" x="66" y="176" width="92" height="82"/>
            <rect class="cargo-truck-map-district" x="192" y="170" width="106" height="66"/>
            <rect class="cargo-truck-map-district" x="332" y="162" width="126" height="92"/>
            <rect class="cargo-truck-map-district" x="500" y="172" width="146" height="78"/>
            <rect class="cargo-truck-map-district" x="42" y="298" width="132" height="82"/>
            <rect class="cargo-truck-map-district" x="212" y="286" width="122" height="96"/>
            <rect class="cargo-truck-map-district" x="374" y="294" width="110" height="78"/>
            <rect class="cargo-truck-map-district" x="522" y="286" width="136" height="92"/>

            <path class="cargo-truck-map-road is-primary" d="M18 84H690"/>
            <path class="cargo-truck-map-road is-primary" d="M18 214H690"/>
            <path class="cargo-truck-map-road is-primary" d="M18 348H690"/>
            <path class="cargo-truck-map-road is-primary" d="M86 16V410"/>
            <path class="cargo-truck-map-road is-primary" d="M248 16V410"/>
            <path class="cargo-truck-map-road is-primary" d="M426 16V410"/>
            <path class="cargo-truck-map-road is-primary" d="M612 16V410"/>

            <path class="cargo-truck-map-road is-secondary" d="M18 48H690"/>
            <path class="cargo-truck-map-road is-secondary" d="M18 126H690"/>
            <path class="cargo-truck-map-road is-secondary" d="M18 174H690"/>
            <path class="cargo-truck-map-road is-secondary" d="M18 258H690"/>
            <path class="cargo-truck-map-road is-secondary" d="M18 302H690"/>
            <path class="cargo-truck-map-road is-secondary" d="M18 392H690"/>
            <path class="cargo-truck-map-road is-secondary" d="M44 16V410"/>
            <path class="cargo-truck-map-road is-secondary" d="M146 16V410"/>
            <path class="cargo-truck-map-road is-secondary" d="M198 16V410"/>
            <path class="cargo-truck-map-road is-secondary" d="M302 16V410"/>
            <path class="cargo-truck-map-road is-secondary" d="M368 16V410"/>
            <path class="cargo-truck-map-road is-secondary" d="M486 16V410"/>
            <path class="cargo-truck-map-road is-secondary" d="M552 16V410"/>
            <path class="cargo-truck-map-road is-secondary" d="M664 16V410"/>

            <path class="cargo-truck-map-link" d="M86 84H146V126H198"/>
            <path class="cargo-truck-map-link" d="M248 84H302V48H368"/>
            <path class="cargo-truck-map-link" d="M426 214H486V258H552"/>
            <path class="cargo-truck-map-link" d="M146 302H198V348H248"/>
            <path class="cargo-truck-map-link" d="M302 174H368V214H426"/>
            <path class="cargo-truck-map-link" d="M486 84H552V126H612"/>
          </g>

          <path class="cargo-truck-route-base" data-cargo-truck-route-base d="M86 348 L146 348 L198 302 L248 302 L302 258 L368 258 L426 214 L486 214 L552 174 L612 126"/>
          <path class="cargo-truck-route-progress" data-cargo-truck-route-progress-path d="M86 348 L146 348 L198 302 L248 302 L302 258 L368 258 L426 214 L486 214 L552 174 L612 126"/>

          <g aria-hidden="true">
            <circle class="cargo-truck-route-node" data-cargo-truck-route-node="start" cx="86" cy="348" r="6"/>
            <circle class="cargo-truck-route-node" data-cargo-truck-route-node="meal" cx="248" cy="302" r="6"/>
            <circle class="cargo-truck-route-node" data-cargo-truck-route-node="fuel" cx="426" cy="214" r="6"/>
            <circle class="cargo-truck-route-node" data-cargo-truck-route-node="delivery" cx="612" cy="126" r="6"/>
          </g>

          <g class="cargo-truck-route-marker" data-cargo-truck-route-marker aria-hidden="true">
            <circle class="cargo-truck-route-marker-ring" cx="0" cy="0" r="10"/>
            <circle class="cargo-truck-route-marker-dot" cx="0" cy="0" r="4"/>
          </g>

          <g class="cargo-truck-map-labels" aria-hidden="true">
            <text class="cargo-truck-map-label" x="56" y="334">BASE</text>
            <text class="cargo-truck-map-label" x="584" y="111">DESTINO</text>
            <text class="cargo-truck-map-label" x="330" y="198">CORREDOR</text>
          </g>
        </svg>

        <div class="cargo-truck-route-event event-start" data-cargo-truck-route-event="start">
          <small>EVENT / 01</small>
          <strong>Início de viagem</strong>
        </div>
        <div class="cargo-truck-route-event event-meal" data-cargo-truck-route-event="meal">
          <small>EVENT / 02</small>
          <strong>Refeição</strong>
        </div>
        <div class="cargo-truck-route-event event-fuel" data-cargo-truck-route-event="fuel">
          <small>EVENT / 03</small>
          <strong>Abastecimento</strong>
        </div>
        <div class="cargo-truck-route-event event-delivery" data-cargo-truck-route-event="delivery">
          <small>EVENT / 04</small>
          <strong>Entrega</strong>
        </div>
      </div>
    </div>
    <div class="cargo-truck-route-footer">
      <span>Posição</span>
      <span>Eventos</span>
      <span>Linha do tempo</span>
      <strong data-cargo-truck-route-footer>VIAGEM EM ACOMPANHAMENTO</strong>
    </div>`;

  const routePath = panel.querySelector("[data-cargo-truck-route-progress-path]");
  const marker = panel.querySelector("[data-cargo-truck-route-marker]");
  const statusLabel = panel.querySelector("[data-cargo-truck-route-status]");
  const currentLabel = panel.querySelector("[data-cargo-truck-route-current]");
  const progressLabel = panel.querySelector("[data-cargo-truck-route-progress]");
  const footerLabel = panel.querySelector("[data-cargo-truck-route-footer]");
  const eventElements = new Map(
    Array.from(panel.querySelectorAll("[data-cargo-truck-route-event]")).map((element) => [element.dataset.cargoTruckRouteEvent, element])
  );
  const nodeElements = new Map(
    Array.from(panel.querySelectorAll("[data-cargo-truck-route-node]")).map((element) => [element.dataset.cargoTruckRouteNode, element])
  );

  if (!(routePath instanceof SVGPathElement) || !(marker instanceof SVGGElement)) {
    return;
  }

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const routeLength = routePath.getTotalLength();
  const travelDuration = 10800;
  const holdDuration = 2500;
  const cycleDuration = travelDuration + holdDuration;
  const milestones = [
    { key: "start", threshold: 0.055, label: "Início de viagem", status: "VIAGEM INICIADA" },
    { key: "meal", threshold: 0.34, label: "Parada para refeição", status: "EVENTO REGISTRADO" },
    { key: "fuel", threshold: 0.63, label: "Abastecimento", status: "EVENTO REGISTRADO" },
    { key: "delivery", threshold: 0.955, label: "Entrega registrada", status: "DESTINO ALCANÇADO" }
  ];

  routePath.style.strokeDasharray = `${routeLength}`;
  routePath.style.strokeDashoffset = `${routeLength}`;

  let animationFrameId = null;
  let cycleStartedAt = null;
  let isVisible = true;

  const updateEventStates = (progress) => {
    let latestMilestone = null;

    milestones.forEach((milestone) => {
      const eventElement = eventElements.get(milestone.key);
      const nodeElement = nodeElements.get(milestone.key);
      const reached = progress >= milestone.threshold;

      if (eventElement instanceof HTMLElement) {
        eventElement.classList.toggle("is-done", reached);
        eventElement.classList.remove("is-active");
      }

      if (nodeElement instanceof SVGElement) {
        nodeElement.classList.toggle("is-done", reached);
      }

      if (reached) {
        latestMilestone = milestone;
      }
    });

    if (latestMilestone) {
      const activeEvent = eventElements.get(latestMilestone.key);

      if (activeEvent instanceof HTMLElement) {
        activeEvent.classList.add("is-active");
      }

      if (currentLabel instanceof HTMLElement) {
        currentLabel.textContent = latestMilestone.label;
      }

      if (statusLabel instanceof HTMLElement) {
        statusLabel.textContent = latestMilestone.status;
      }
    } else {
      if (currentLabel instanceof HTMLElement) {
        currentLabel.textContent = "Traçando rota";
      }

      if (statusLabel instanceof HTMLElement) {
        statusLabel.textContent = "ROTA EM PREPARAÇÃO";
      }
    }
  };

  const renderProgress = (progress) => {
    const clampedProgress = Math.max(0, Math.min(progress, 1));
    const currentLength = routeLength * clampedProgress;
    const markerPoint = routePath.getPointAtLength(currentLength);

    routePath.style.strokeDashoffset = `${routeLength - currentLength}`;
    marker.setAttribute("transform", `translate(${markerPoint.x} ${markerPoint.y})`);
    marker.classList.toggle("is-visible", clampedProgress > 0.012);

    if (progressLabel instanceof HTMLElement) {
      progressLabel.textContent = `${String(Math.round(clampedProgress * 100)).padStart(2, "0")}% DA VIAGEM`;
    }

    updateEventStates(clampedProgress);

    const isComplete = clampedProgress >= 1;
    panel.classList.toggle("is-complete", isComplete);

    if (footerLabel instanceof HTMLElement) {
      footerLabel.textContent = isComplete ? "VIAGEM CONCLUÍDA / HISTÓRICO SALVO" : "VIAGEM EM ACOMPANHAMENTO";
    }
  };

  const resetCycle = () => {
    panel.classList.remove("is-complete");

    eventElements.forEach((element) => {
      element.classList.remove("is-active", "is-done");
    });

    nodeElements.forEach((element) => {
      element.classList.remove("is-done");
    });
  };

  const animate = (timestamp) => {
    if (!isVisible) {
      animationFrameId = null;
      return;
    }

    if (cycleStartedAt === null) {
      cycleStartedAt = timestamp;
    }

    const cycleElapsed = (timestamp - cycleStartedAt) % cycleDuration;
    const previousCycle = Math.floor((timestamp - cycleStartedAt) / cycleDuration);
    const previousFrameCycle = Number(panel.dataset.cargoTruckCycle ?? "-1");

    if (previousCycle !== previousFrameCycle) {
      panel.dataset.cargoTruckCycle = String(previousCycle);
      resetCycle();
    }

    const progress = cycleElapsed >= travelDuration ? 1 : cycleElapsed / travelDuration;
    renderProgress(progress);
    animationFrameId = window.requestAnimationFrame(animate);
  };

  const start = () => {
    if (animationFrameId !== null || prefersReducedMotion) {
      return;
    }

    cycleStartedAt = null;
    animationFrameId = window.requestAnimationFrame(animate);
  };

  const stop = () => {
    if (animationFrameId !== null) {
      window.cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  };

  if (prefersReducedMotion) {
    renderProgress(1);
    return;
  }

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;

          if (isVisible) {
            start();
          } else {
            stop();
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(panel);
    window.addEventListener("pagehide", () => observer.disconnect(), { once: true });
  }

  window.addEventListener("pagehide", stop, { once: true });
  start();
};

initializeCargoTruckRouteHero();
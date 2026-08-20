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
        <svg class="cargo-truck-route-svg" viewBox="0 0 720 430" role="img" aria-label="Rota abstrata de uma viagem logística com quatro eventos operacionais">
          <g aria-hidden="true">
            <path class="cargo-truck-map-road" d="M28 74H194V144H332V76H484V128H688"/>
            <path class="cargo-truck-map-road" d="M52 376H168V326H288V366H458V314H684"/>
            <path class="cargo-truck-map-road" d="M108 28V178H50V270H166V410"/>
            <path class="cargo-truck-map-road" d="M276 20V118H228V212H352V410"/>
            <path class="cargo-truck-map-road" d="M470 18V92H414V198H548V410"/>
            <path class="cargo-truck-map-road" d="M632 24V214H580V286H692"/>
            <path class="cargo-truck-map-road is-secondary" d="M18 198H124V240H246V176H392V286H520V224H700"/>
            <path class="cargo-truck-map-road is-secondary" d="M194 18V106H350V42H558V92"/>
            <rect class="cargo-truck-map-block" x="126" y="94" width="48" height="28"/>
            <rect class="cargo-truck-map-block" x="362" y="104" width="68" height="38"/>
            <rect class="cargo-truck-map-block" x="548" y="48" width="54" height="32"/>
            <rect class="cargo-truck-map-block" x="188" y="334" width="54" height="30"/>
            <rect class="cargo-truck-map-block" x="466" y="326" width="62" height="34"/>
          </g>

          <path class="cargo-truck-route-base" data-cargo-truck-route-base d="M70 338 L152 286 L252 302 L325 224 L421 242 L505 160 L628 118"/>
          <path class="cargo-truck-route-progress" data-cargo-truck-route-progress-path d="M70 338 L152 286 L252 302 L325 224 L421 242 L505 160 L628 118"/>

          <g aria-hidden="true">
            <circle class="cargo-truck-route-node" data-cargo-truck-route-node="start" cx="70" cy="338" r="6"/>
            <circle class="cargo-truck-route-node" data-cargo-truck-route-node="meal" cx="252" cy="302" r="6"/>
            <circle class="cargo-truck-route-node" data-cargo-truck-route-node="fuel" cx="421" cy="242" r="6"/>
            <circle class="cargo-truck-route-node" data-cargo-truck-route-node="delivery" cx="628" cy="118" r="6"/>
          </g>

          <g class="cargo-truck-route-marker" data-cargo-truck-route-marker aria-hidden="true">
            <circle class="cargo-truck-route-marker-ring" cx="0" cy="0" r="10"/>
            <circle class="cargo-truck-route-marker-dot" cx="0" cy="0" r="4"/>
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
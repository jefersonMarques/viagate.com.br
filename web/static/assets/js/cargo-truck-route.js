const initializeCargoTruckTimelineHero = () => {
  const currentPath = window.location.pathname.replace(/\/$/, "");

  if (currentPath !== "/solucoes/gestao-logistica") {
    return;
  }

  const panel = document.querySelector(".solution-command-grid .solution-signal-panel");

  if (!(panel instanceof HTMLElement)) {
    return;
  }

  const renderedIcons = Array.from(panel.querySelectorAll(".ui-icon")).map((icon) => icon.outerHTML);
  const routeIcon = renderedIcons[0] ?? "";
  const packageIcon = renderedIcons[1] ?? routeIcon;
  const mapIcon = renderedIcons[2] ?? routeIcon;
  const coffeeIcon = renderedIcons[3] ?? routeIcon;

  const events = [
    {
      key: "start",
      side: "left",
      code: "TRIP / 01",
      title: "Início de viagem",
      time: "20 AGO • 07:42",
      location: "São José dos Pinhais / PR",
      detail: "Viagem liberada para execução",
      icon: routeIcon
    },
    {
      key: "meal",
      side: "right",
      code: "STOP / 02",
      title: "Parada para refeição",
      time: "20 AGO • 12:18",
      location: "Joinville / SC",
      detail: "Parada registrada • 42 min",
      icon: coffeeIcon
    },
    {
      key: "fuel",
      side: "left",
      code: "FUEL / 03",
      title: "Abastecimento",
      time: "20 AGO • 14:06",
      location: "Araquari / SC",
      detail: "Evento operacional registrado",
      icon: mapIcon
    },
    {
      key: "checkpoint",
      side: "right",
      code: "GEO / 04",
      title: "Posição confirmada",
      time: "20 AGO • 16:31",
      location: "Itajaí / SC",
      detail: "Checkpoint da viagem sincronizado",
      icon: mapIcon
    },
    {
      key: "delivery",
      side: "left",
      code: "POD / 05",
      title: "Entrega concluída",
      time: "20 AGO • 18:52",
      location: "Biguaçu / SC",
      detail: "Comprovante associado à viagem",
      icon: packageIcon
    }
  ];

  const eventMarkup = events.map((event, index) => `
    <article class="cargo-truck-timeline-event is-${event.side}" data-cargo-truck-event data-event-index="${index}">
      <div class="cargo-truck-timeline-card">
        <div class="cargo-truck-timeline-card-head">
          <span class="cargo-truck-timeline-icon">${event.icon}</span>
          <div><small>${event.code}</small><strong>${event.title}</strong></div>
        </div>
        <div class="cargo-truck-timeline-meta">
          <span>${event.time}</span>
          <span>${event.location}</span>
        </div>
        <p>${event.detail}</p>
        <div class="cargo-truck-timeline-status">
          <span class="cargo-truck-status-pending">AGUARDANDO</span>
          <span class="cargo-truck-status-processing">
            PROCESSANDO
            <i aria-hidden="true"></i><i aria-hidden="true"></i><i aria-hidden="true"></i><i aria-hidden="true"></i>
          </span>
          <span class="cargo-truck-status-done"><b aria-hidden="true">✓</b> REGISTRADO</span>
        </div>
      </div>
      <div class="cargo-truck-timeline-node" aria-hidden="true"><span></span></div>
    </article>`).join("");

  panel.classList.add("cargo-truck-timeline-panel");
  panel.setAttribute("aria-label", "Linha do tempo operacional conceitual de uma viagem com eventos registrados durante o trajeto");
  panel.innerHTML = `
    <div class="signal-panel-grid" aria-hidden="true"></div>
    <div class="cargo-truck-timeline-topbar">
      <span><i aria-hidden="true"></i> VIAGATE / CARGO TRUCK</span>
      <small data-cargo-truck-timeline-state>VIAGEM EM ANDAMENTO</small>
    </div>
    <div class="cargo-truck-timeline-summary">
      <div><small>TRIP / 0427</small><strong data-cargo-truck-current-event>Carregando linha do tempo</strong></div>
      <div><small>EVENTOS</small><strong data-cargo-truck-counter>00 / 05</strong></div>
      <div><small>STATUS</small><strong data-cargo-truck-summary-status>ACOMPANHAMENTO ATIVO</strong></div>
    </div>
    <div class="cargo-truck-timeline-viewport" data-cargo-truck-viewport>
      <div class="cargo-truck-timeline-track" data-cargo-truck-track>
        <div class="cargo-truck-timeline-axis" aria-hidden="true"><span data-cargo-truck-axis-progress></span></div>
        ${eventMarkup}
      </div>
    </div>
    <div class="cargo-truck-timeline-footer">
      <span>EVENTOS SINCRONIZADOS</span>
      <span>POSIÇÃO E CONTEXTO</span>
      <strong data-cargo-truck-footer>LINHA DO TEMPO OPERACIONAL</strong>
    </div>`;

  const eventElements = Array.from(panel.querySelectorAll("[data-cargo-truck-event]"));
  const viewport = panel.querySelector("[data-cargo-truck-viewport]");
  const track = panel.querySelector("[data-cargo-truck-track]");
  const axisProgress = panel.querySelector("[data-cargo-truck-axis-progress]");
  const currentEvent = panel.querySelector("[data-cargo-truck-current-event]");
  const counter = panel.querySelector("[data-cargo-truck-counter]");
  const summaryStatus = panel.querySelector("[data-cargo-truck-summary-status]");
  const stateLabel = panel.querySelector("[data-cargo-truck-timeline-state]");
  const footer = panel.querySelector("[data-cargo-truck-footer]");

  if (!(viewport instanceof HTMLElement) || !(track instanceof HTMLElement) || !(axisProgress instanceof HTMLElement)) {
    return;
  }

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let activeIndex = 0;
  let timerId = null;
  let isVisible = true;

  const updateAxis = (index, complete = false) => {
    const targetEvent = eventElements[index];

    if (!(targetEvent instanceof HTMLElement)) {
      return;
    }

    const node = targetEvent.querySelector(".cargo-truck-timeline-node");

    if (!(node instanceof HTMLElement)) {
      return;
    }

    const target = complete && index === eventElements.length - 1
      ? track.scrollHeight - 34
      : targetEvent.offsetTop + node.offsetTop + (node.offsetHeight / 2);

    axisProgress.style.height = `${Math.max(0, target)}px`;
  };

  const scrollToEvent = (index) => {
    const targetEvent = eventElements[index];

    if (!(targetEvent instanceof HTMLElement)) {
      return;
    }

    const desiredOffset = targetEvent.offsetTop + (targetEvent.offsetHeight / 2) - (viewport.clientHeight / 2);
    const maxOffset = Math.max(0, track.scrollHeight - viewport.clientHeight);
    const offset = Math.max(0, Math.min(desiredOffset, maxOffset));

    track.style.transform = `translateY(${-offset}px)`;
  };

  const applyActiveState = (index) => {
    eventElements.forEach((element, eventIndex) => {
      if (!(element instanceof HTMLElement)) {
        return;
      }

      element.classList.toggle("is-done", eventIndex < index);
      element.classList.toggle("is-active", eventIndex === index);
    });

    const event = events[index];

    if (currentEvent instanceof HTMLElement) currentEvent.textContent = event.title;
    if (counter instanceof HTMLElement) counter.textContent = `${String(index + 1).padStart(2, "0")} / ${String(events.length).padStart(2, "0")}`;
    if (summaryStatus instanceof HTMLElement) summaryStatus.textContent = "PROCESSANDO EVENTO";
    if (stateLabel instanceof HTMLElement) stateLabel.textContent = "VIAGEM EM ANDAMENTO";
    if (footer instanceof HTMLElement) footer.textContent = "REGISTRANDO EVENTOS DA VIAGEM";

    panel.classList.remove("is-complete");
    updateAxis(index);
    scrollToEvent(index);
  };

  const completeActiveEvent = (index) => {
    const activeEvent = eventElements[index];

    if (activeEvent instanceof HTMLElement) {
      activeEvent.classList.remove("is-active");
      activeEvent.classList.add("is-done");
    }

    updateAxis(index, index === eventElements.length - 1);

    if (summaryStatus instanceof HTMLElement) summaryStatus.textContent = "EVENTO REGISTRADO";

    if (index === eventElements.length - 1) {
      panel.classList.add("is-complete");
      if (stateLabel instanceof HTMLElement) stateLabel.textContent = "VIAGEM CONCLUÍDA";
      if (summaryStatus instanceof HTMLElement) summaryStatus.textContent = "HISTÓRICO CONSOLIDADO";
      if (footer instanceof HTMLElement) footer.textContent = "VIAGEM REGISTRADA / 05 EVENTOS";
      return;
    }
  };

  const scheduleEvent = () => {
    if (!isVisible || prefersReducedMotion) {
      return;
    }

    applyActiveState(activeIndex);

    timerId = window.setTimeout(() => {
      completeActiveEvent(activeIndex);

      timerId = window.setTimeout(() => {
        if (activeIndex === events.length - 1) {
          timerId = window.setTimeout(() => {
            activeIndex = 0;
            eventElements.forEach((element) => element.classList.remove("is-active", "is-done"));
            track.style.transform = "translateY(0)";
            axisProgress.style.height = "0px";
            scheduleEvent();
          }, 2300);
          return;
        }

        activeIndex += 1;
        scheduleEvent();
      }, 520);
    }, 1450);
  };

  const stop = () => {
    if (timerId !== null) {
      window.clearTimeout(timerId);
      timerId = null;
    }
  };

  const start = () => {
    if (timerId !== null || prefersReducedMotion) {
      return;
    }

    scheduleEvent();
  };

  if (prefersReducedMotion) {
    eventElements.forEach((element) => element.classList.add("is-done"));
    activeIndex = events.length - 1;
    updateAxis(activeIndex, true);
    scrollToEvent(activeIndex);
    panel.classList.add("is-complete");
    if (currentEvent instanceof HTMLElement) currentEvent.textContent = events[activeIndex].title;
    if (counter instanceof HTMLElement) counter.textContent = "05 / 05";
    if (summaryStatus instanceof HTMLElement) summaryStatus.textContent = "HISTÓRICO CONSOLIDADO";
    if (stateLabel instanceof HTMLElement) stateLabel.textContent = "VIAGEM CONCLUÍDA";
    if (footer instanceof HTMLElement) footer.textContent = "VIAGEM REGISTRADA / 05 EVENTOS";
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

initializeCargoTruckTimelineHero();

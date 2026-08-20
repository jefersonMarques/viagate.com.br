const initializeCargoScoreIdentityHero = () => {
  const panel = document.querySelector(".score-network-panel");

  if (!(panel instanceof HTMLElement)) {
    return;
  }

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const signalDefinitions = {
    biometry: { code: "ID / 01", label: "Biometria", active: "Validando", done: "Confirmada" },
    cnh: { code: "DOC / 02", label: "CNH", active: "Consultando", done: "Validada" },
    antt: { code: "REG / 03", label: "ANTT", active: "Consultando", done: "Confirmada" },
    processes: { code: "CTX / 04", label: "Processos", active: "Analisando", done: "Analisados" },
    vehicle: { code: "VEI / 05", label: "Veículo", active: "Verificando", done: "Verificado" }
  };

  const stages = [
    { label: "Confirmando identidade", active: "biometry", done: [] },
    { label: "Validando habilitação", active: "cnh", done: ["biometry"] },
    { label: "Consultando registro profissional", active: "antt", done: ["biometry", "cnh"] },
    { label: "Analisando contexto", active: "processes", done: ["biometry", "cnh", "antt"] },
    { label: "Consolidando veículo", active: "vehicle", done: ["biometry", "cnh", "antt", "processes"] },
    { label: "Contexto consolidado", active: null, done: ["biometry", "cnh", "antt", "processes", "vehicle"] }
  ];

  const iconSvg = (key) => {
    const icons = {
      biometry: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 3H4v4M16 3h4v4M8 21H4v-4M16 21h4v-4"/><circle cx="12" cy="9" r="3"/><path d="M7.5 18c.8-2.4 2.3-3.6 4.5-3.6s3.7 1.2 4.5 3.6"/></svg>',
      cnh: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14"/><path d="M7 9h4M7 13h6M15 11l2 2 3-4"/></svg>',
      antt: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="5" cy="17" r="2"/><circle cx="19" cy="7" r="2"/><path d="M7 17h3c4 0 1-10 5-10h2"/></svg>',
      processes: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h9l3 3v15H6z"/><path d="M15 3v4h4M9 11h6M9 15h6"/></svg>',
      vehicle: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 15V8h10v7M14 11h3l3 3v1h-6"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/><path d="M9 17h6"/></svg>'
    };

    return icons[key] ?? "";
  };

  const signalMarkup = (key) => {
    const signal = signalDefinitions[key];

    return `<div class="score-identity-signal" data-score-signal="${key}">
      <span class="score-identity-signal-icon">${iconSvg(key)}</span>
      <span class="score-identity-signal-copy">
        <small>${signal.code}</small>
        <strong>${signal.label}</strong>
        <span class="score-identity-signal-state" data-score-signal-state>Aguardando</span>
      </span>
      <i class="score-identity-signal-dot" aria-hidden="true"></i>
    </div>`;
  };

  panel.classList.add("score-identity-hero");
  panel.setAttribute("aria-label", "Análise conceitual do Cargo Score consolidando identidade, documentos, registros, processos e veículo");
  panel.innerHTML = `
    <div class="score-identity-topbar">
      <span><i aria-hidden="true"></i> VIAGATE / CARGO SCORE</span>
      <span class="score-identity-live"><i aria-hidden="true"></i> ANÁLISE CADASTRAL / LIVE</span>
    </div>
    <div class="score-identity-body">
      <div class="score-identity-signals score-identity-signals-left">
        ${signalMarkup("biometry")}
        ${signalMarkup("antt")}
      </div>
      <div class="score-identity-core is-processing" data-score-identity-core>
        <img class="score-identity-silhouette" src="/assets/images/biometric-silhouette-transparent.svg" width="709" height="760" alt="" aria-hidden="true"/>
        <div class="score-identity-core-state">
          <small>PROCESSAMENTO</small>
          <strong data-score-hero-stage>Confirmando identidade</strong>
          <span data-score-hero-progress>01 / 05 SINAIS</span>
        </div>
      </div>
      <div class="score-identity-signals score-identity-signals-right">
        ${signalMarkup("cnh")}
        ${signalMarkup("processes")}
        ${signalMarkup("vehicle")}
      </div>
    </div>
    <div class="score-identity-footer">
      <div><span>Identidade</span><span>Documentos</span><span>Contexto</span></div>
      <strong data-score-hero-decision>CONSOLIDANDO EVIDÊNCIAS</strong>
    </div>`;

  const signals = new Map(
    Array.from(panel.querySelectorAll("[data-score-signal]")).map((element) => [element.dataset.scoreSignal, element])
  );
  const stageLabel = panel.querySelector("[data-score-hero-stage]");
  const progressLabel = panel.querySelector("[data-score-hero-progress]");
  const decisionLabel = panel.querySelector("[data-score-hero-decision]");
  const core = panel.querySelector("[data-score-identity-core]");
  let stageIndex = 0;
  let timerId = null;
  let isVisible = true;

  const applyStage = (index) => {
    const stage = stages[index];
    const doneSet = new Set(stage.done);

    signals.forEach((element, key) => {
      if (!(element instanceof HTMLElement)) {
        return;
      }

      const state = element.querySelector("[data-score-signal-state]");
      const isActive = stage.active === key;
      const isDone = doneSet.has(key);

      element.classList.toggle("is-active", isActive);
      element.classList.toggle("is-done", isDone);

      if (state instanceof HTMLElement) {
        state.textContent = isDone ? signalDefinitions[key].done : isActive ? signalDefinitions[key].active : "Aguardando";
      }
    });

    if (stageLabel instanceof HTMLElement) {
      stageLabel.textContent = stage.label;
    }

    if (progressLabel instanceof HTMLElement) {
      const completed = Math.min(stage.done.length + (stage.active ? 1 : 0), 5);
      progressLabel.textContent = index === stages.length - 1 ? "05 / 05 SINAIS" : `${String(completed).padStart(2, "0")} / 05 SINAIS`;
    }

    if (core instanceof HTMLElement) {
      const complete = index === stages.length - 1;
      core.classList.toggle("is-processing", !complete);
      core.classList.toggle("is-complete", complete);
    }

    if (decisionLabel instanceof HTMLElement) {
      const complete = index === stages.length - 1;
      decisionLabel.textContent = complete ? "PRONTO PARA DECISÃO" : "CONSOLIDANDO EVIDÊNCIAS";
      decisionLabel.classList.toggle("is-complete", complete);
    }
  };

  const scheduleNext = () => {
    if (!isVisible || prefersReducedMotion) {
      return;
    }

    const delay = stageIndex === stages.length - 1 ? 2400 : 1350;
    timerId = window.setTimeout(() => {
      stageIndex = (stageIndex + 1) % stages.length;
      applyStage(stageIndex);
      scheduleNext();
    }, delay);
  };

  const start = () => {
    if (timerId !== null || prefersReducedMotion) {
      return;
    }

    applyStage(stageIndex);
    scheduleNext();
  };

  const stop = () => {
    if (timerId !== null) {
      window.clearTimeout(timerId);
      timerId = null;
    }
  };

  if (prefersReducedMotion) {
    stageIndex = stages.length - 1;
    applyStage(stageIndex);
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
      { threshold: 0.15 }
    );

    observer.observe(panel);
    window.addEventListener("pagehide", () => observer.disconnect(), { once: true });
  }

  window.addEventListener("pagehide", stop, { once: true });
  start();
};

initializeCargoScoreIdentityHero();

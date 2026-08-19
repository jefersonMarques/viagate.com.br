const initializeBiometricJourney = () => {
  const core = document.querySelector(".biometric-core");

  if (!(core instanceof HTMLElement)) {
    return;
  }

  const screen = core.querySelector(".device-screen");

  if (!(screen instanceof HTMLElement)) {
    return;
  }

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const icons = {
    location: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 21s6-5.2 6-12a6 6 0 1 0-12 0c0 6.8 6 12 6 12Z"></path>
        <circle cx="12" cy="9" r="2.2"></circle>
      </svg>
    `,
    face: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8 8.2V7a4 4 0 0 1 8 0v1.2"></path>
        <path d="M7.4 10.3c.2 4.4 1.9 7.3 4.6 7.3s4.4-2.9 4.6-7.3"></path>
        <path d="M5.8 21c.8-2.8 3-4.4 6.2-4.4s5.4 1.6 6.2 4.4"></path>
        <path d="M4 8V4h4M20 8V4h-4M4 16v4h4M20 16v4h-4"></path>
      </svg>
    `,
    check: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m6 12.5 3.5 3.5L18 7.5"></path>
      </svg>
    `
  };

  screen.classList.add("biometric-flow-screen");
  screen.innerHTML = `
    <div class="bio-flow-header">
      <span class="bio-flow-kicker">VALIDAÇÃO SEGURA</span>
      <span class="bio-flow-step" data-bio-step>01 / 04</span>
    </div>
    <div class="bio-flow-stage" data-bio-stage aria-hidden="true"></div>
    <div class="bio-flow-progress" aria-hidden="true">
      <i data-bio-progress="0"></i>
      <i data-bio-progress="1"></i>
      <i data-bio-progress="2"></i>
      <i data-bio-progress="3"></i>
    </div>
    <div class="bio-flow-footer">
      <span>VIAGATE / WEB ID</span>
      <span data-bio-footer>conectado</span>
    </div>
  `;

  const stage = screen.querySelector("[data-bio-stage]");
  const stepLabel = screen.querySelector("[data-bio-step]");
  const footerStatus = screen.querySelector("[data-bio-footer]");
  const progress = Array.from(screen.querySelectorAll("[data-bio-progress]"));

  if (
    !(stage instanceof HTMLElement) ||
    !(stepLabel instanceof HTMLElement) ||
    !(footerStatus instanceof HTMLElement)
  ) {
    return;
  }

  const renderProgress = (step, complete = false) => {
    progress.forEach((segment, index) => {
      segment.classList.toggle("is-complete", complete || index < step);
      segment.classList.toggle("is-active", !complete && index === step);
    });

    stepLabel.textContent = complete ? "04 / 04" : `${String(step + 1).padStart(2, "0")} / 04`;
  };

  const renderLoader = (label) => `
    <div class="bio-flow-loader">
      <span class="bio-loader-bars" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
      <strong>${label}</strong>
    </div>
  `;

  const renderField = ({ title, label, value, step, phase }) => {
    renderProgress(step);
    footerStatus.textContent = phase === "loading" ? "validando" : phase === "success" ? "confirmado" : "conectado";

    stage.innerHTML = `
      <div class="bio-flow-panel bio-flow-form ${phase === "success" ? "is-success" : ""}">
        <span class="bio-panel-index">0${step + 1}</span>
        <div class="bio-panel-heading">
          <small>IDENTIFICAÇÃO</small>
          <strong>${title}</strong>
        </div>
        <label class="bio-field">
          <span>${label}</span>
          <div class="bio-field-value ${phase === "typing" ? "is-typing" : ""}" data-bio-value>${value}</div>
        </label>
        ${
          phase === "loading"
            ? renderLoader(`Validando ${label}`)
            : phase === "success"
              ? `<div class="bio-flow-confirm"><span>${icons.check}</span><strong>${label} confirmado</strong></div>`
              : `<button class="bio-flow-button" type="button" tabindex="-1">CONTINUAR <span>→</span></button>`
        }
      </div>
    `;
  };

  const renderLocation = (phase) => {
    renderProgress(2);
    footerStatus.textContent =
      phase === "loading" ? "capturando" : phase === "success" ? "localização ok" : "permissão";

    stage.innerHTML = `
      <div class="bio-flow-panel bio-location-panel ${phase === "success" ? "is-success" : ""}">
        <span class="bio-panel-index">03</span>
        <div class="bio-panel-heading">
          <small>CONTEXTO OPERACIONAL</small>
          <strong>Precisamos da sua localização</strong>
        </div>
        <div class="bio-location-icon ${phase === "loading" ? "is-loading" : ""} ${phase === "success" ? "is-success" : ""}">
          ${phase === "success" ? icons.check : icons.location}
          <i></i><i></i>
        </div>
        ${
          phase === "loading"
            ? renderLoader("Capturando localização")
            : phase === "success"
              ? `<div class="bio-flow-confirm"><span>${icons.check}</span><strong>Localização capturada</strong></div>`
              : `<button class="bio-flow-button bio-location-button ${phase === "click" ? "is-clicking" : ""}" type="button" tabindex="-1">
                  COMPARTILHAR LOCALIZAÇÃO
                  <span class="bio-click-target" aria-hidden="true"></span>
                </button>`
        }
      </div>
    `;
  };

  const renderBiometry = (phase) => {
    renderProgress(3);
    footerStatus.textContent =
      phase === "scan"
        ? "lendo face"
        : phase === "verify"
          ? "validando"
          : phase === "success"
            ? "biometria ok"
            : "câmera ativa";

    const statusText =
      phase === "scan"
        ? "Verificando presença"
        : phase === "verify"
          ? "Validando identidade"
          : phase === "success"
            ? "Biometria aprovada"
            : "Posicione seu rosto";

    stage.innerHTML = `
      <div class="bio-flow-panel bio-face-panel ${phase === "scan" ? "is-scanning" : ""} ${phase === "success" ? "is-success" : ""}">
        <span class="bio-panel-index">04</span>
        <div class="bio-panel-heading">
          <small>BIOMETRIA FACIAL</small>
          <strong>Confirme sua identidade</strong>
        </div>
        <div class="bio-face-oval">
          <span class="bio-face-icon">${icons.face}</span>
          <span class="bio-face-scan" aria-hidden="true"></span>
          <i class="bio-face-mark bio-face-mark-a"></i>
          <i class="bio-face-mark bio-face-mark-b"></i>
          <i class="bio-face-mark bio-face-mark-c"></i>
          <i class="bio-face-mark bio-face-mark-d"></i>
        </div>
        ${
          phase === "verify"
            ? renderLoader(statusText)
            : `<div class="bio-face-status ${phase === "success" ? "is-success" : ""}">
                ${phase === "success" ? `<span>${icons.check}</span>` : `<i></i>`}
                <strong>${statusText}</strong>
              </div>`
        }
      </div>
    `;
  };

  const renderComplete = () => {
    renderProgress(3, true);
    footerStatus.textContent = "concluído";

    stage.innerHTML = `
      <div class="bio-flow-panel bio-complete-panel is-success">
        <span class="bio-complete-icon">${icons.check}</span>
        <small>VALIDAÇÃO CONCLUÍDA</small>
        <strong>Identidade confirmada</strong>
        <p>Dados protegidos e operação registrada.</p>
        <div class="bio-complete-code"><span></span> ID VG-84F1-C29</div>
      </div>
    `;
  };

  const phases = [
    { duration: 500, enter: () => renderField({ title: "Informe seu CPF", label: "CPF", value: "", step: 0, phase: "typing" }) },
    { duration: 2350, type: "typing", value: "123.456.789-10", step: 0, label: "CPF", title: "Informe seu CPF" },
    { duration: 1100, enter: () => renderField({ title: "Informe seu CPF", label: "CPF", value: "123.456.789-10", step: 0, phase: "loading" }) },
    { duration: 1200, enter: () => renderField({ title: "Informe seu CPF", label: "CPF", value: "123.456.789-10", step: 0, phase: "success" }) },
    { duration: 500, enter: () => renderField({ title: "Qual seu telefone?", label: "TELEFONE", value: "", step: 1, phase: "typing" }) },
    { duration: 2200, type: "typing", value: "(41) 99999-9999", step: 1, label: "TELEFONE", title: "Qual seu telefone?" },
    { duration: 1100, enter: () => renderField({ title: "Qual seu telefone?", label: "TELEFONE", value: "(41) 99999-9999", step: 1, phase: "loading" }) },
    { duration: 1200, enter: () => renderField({ title: "Qual seu telefone?", label: "TELEFONE", value: "(41) 99999-9999", step: 1, phase: "success" }) },
    { duration: 1500, enter: () => renderLocation("prompt") },
    { duration: 900, enter: () => renderLocation("click") },
    { duration: 1500, enter: () => renderLocation("loading") },
    { duration: 1300, enter: () => renderLocation("success") },
    { duration: 1300, enter: () => renderBiometry("prompt") },
    { duration: 3300, enter: () => renderBiometry("scan") },
    { duration: 1300, enter: () => renderBiometry("verify") },
    { duration: 1700, enter: () => renderBiometry("success") },
    { duration: 2400, enter: renderComplete }
  ];

  let phaseIndex = 0;
  let timerId = null;
  let typingTimerId = null;
  let isRunning = false;

  const clearTimers = () => {
    if (timerId !== null) {
      window.clearTimeout(timerId);
      timerId = null;
    }

    if (typingTimerId !== null) {
      window.clearInterval(typingTimerId);
      typingTimerId = null;
    }
  };

  const typeValue = (phase) => {
    renderField({
      title: phase.title,
      label: phase.label,
      value: "",
      step: phase.step,
      phase: "typing"
    });

    const valueElement = stage.querySelector("[data-bio-value]");

    if (!(valueElement instanceof HTMLElement)) {
      return;
    }

    let cursor = 0;
    const interval = Math.max(75, Math.floor((phase.duration - 300) / phase.value.length));

    typingTimerId = window.setInterval(() => {
      cursor += 1;
      valueElement.textContent = phase.value.slice(0, cursor);

      if (cursor >= phase.value.length && typingTimerId !== null) {
        window.clearInterval(typingTimerId);
        typingTimerId = null;
      }
    }, interval);
  };

  const renderPhase = () => {
    const phase = phases[phaseIndex];

    if (phase.type === "typing") {
      typeValue(phase);
    } else {
      phase.enter();
    }
  };

  const scheduleNextPhase = () => {
    if (!isRunning) {
      return;
    }

    const phase = phases[phaseIndex];

    timerId = window.setTimeout(() => {
      phaseIndex = (phaseIndex + 1) % phases.length;
      renderPhase();
      scheduleNextPhase();
    }, phase.duration);
  };

  const start = () => {
    if (isRunning) {
      return;
    }

    isRunning = true;
    renderPhase();
    scheduleNextPhase();
  };

  const stop = () => {
    isRunning = false;
    clearTimers();
  };

  if (prefersReducedMotion) {
    renderComplete();
    screen.classList.add("is-static");
    return;
  }

  renderPhase();

  if (!("IntersectionObserver" in window)) {
    start();
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          start();
          return;
        }

        stop();
      });
    },
    {
      threshold: 0.25
    }
  );

  observer.observe(core);
};

initializeBiometricJourney();

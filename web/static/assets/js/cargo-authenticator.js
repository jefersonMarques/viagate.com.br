const initializeCargoAuthenticatorHero = () => {
  const panel = document.querySelector("[data-auth-hero]");

  if (!(panel instanceof HTMLElement)) {
    return;
  }

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const signalDefinitions = {
    phone: { active: "Confirmando", done: "Confirmado" },
    location: { active: "Capturando", done: "Registrada" },
    biometry: { active: "Validando", done: "Aprovada" }
  };

  const stages = [
    {
      badge: "ORIGEM NÃO CONFIRMADA",
      title: "Bloqueio preventivo ativo",
      status: "BLOQUEADO",
      sourceState: "Entrada externa não confiável",
      sourceValue: "Chave PIX recebida por mensagem",
      linkState: "Link individual disponível",
      lockState: "Aguardando autenticação",
      secureValue: "••••••••••••••••",
      owner: "Motorista ainda não autenticado",
      footer: "AÇÃO SENSÍVEL BLOQUEADA",
      active: null,
      done: []
    },
    {
      badge: "VALIDANDO TELEFONE",
      title: "Conferindo contato",
      status: "EM VALIDAÇÃO",
      sourceState: "Entrada externa mantida bloqueada",
      sourceValue: "Chave PIX recebida por mensagem",
      linkState: "Motorista acessou o link",
      lockState: "Protegida durante a validação",
      secureValue: "••••••••••••••••",
      owner: "Telefone em confirmação",
      footer: "IDENTIDADE EM VALIDAÇÃO",
      active: "phone",
      done: []
    },
    {
      badge: "VALIDANDO LOCALIZAÇÃO",
      title: "Registrando contexto",
      status: "EM VALIDAÇÃO",
      sourceState: "Entrada externa mantida bloqueada",
      sourceValue: "Chave PIX recebida por mensagem",
      linkState: "Telefone confirmado",
      lockState: "Protegida durante a validação",
      secureValue: "••••••••••••••••",
      owner: "Contexto do acesso em validação",
      footer: "CONTEXTO EM VALIDAÇÃO",
      active: "location",
      done: ["phone"]
    },
    {
      badge: "VALIDANDO BIOMETRIA",
      title: "Confirmando identidade e presença",
      status: "EM VALIDAÇÃO",
      sourceState: "Entrada externa mantida bloqueada",
      sourceValue: "Chave PIX recebida por mensagem",
      linkState: "Telefone e localização confirmados",
      lockState: "Protegida durante a prova de vida",
      secureValue: "••••••••••••••••",
      owner: "Motorista em prova de vida",
      footer: "PROVA DE VIDA EM EXECUÇÃO",
      active: "biometry",
      done: ["phone", "location"]
    },
    {
      badge: "IDENTIDADE CONFIRMADA",
      title: "Identity Gate aprovado",
      status: "APROVADO",
      sourceState: "Entrada externa permanece bloqueada",
      sourceValue: "Dado externo não utilizado",
      linkState: "Autenticação concluída",
      lockState: "Liberada para preenchimento",
      secureValue: "CAMPO LIBERADO",
      owner: "Motorista autenticado",
      footer: "ÁREA SEGURA LIBERADA",
      active: null,
      done: ["phone", "location", "biometry"],
      approved: true
    }
  ];

  const iconSvg = (key) => {
    const icons = {
      send: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 2 11 13"/><path d="m22 2-7 20-4-9-9-4Z"/></svg>',
      shield: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/></svg>',
      phone: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M9 18h6"/></svg>',
      location: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg>',
      biometry: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 3H4v4M16 3h4v4M8 21H4v-4M16 21h4v-4"/><circle cx="12" cy="9" r="3"/><path d="M7.5 18c.8-2.4 2.3-3.6 4.5-3.6s3.7 1.2 4.5 3.6"/></svg>',
      receipt: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 2v20l3-2 3 2 2-2 2 2 3-2 3 2V2l-3 2-3-2-2 2-2-2-3 2Z"/><path d="M8 9h8M8 13h6"/></svg>',
      user: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="7" r="4"/><path d="M2 21v-2a7 7 0 0 1 7-7"/><path d="m15 18 2 2 5-5"/></svg>',
      link: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.5.5l2-2a5 5 0 0 0-7-7l-1.1 1.1"/><path d="M14 11a5 5 0 0 0-7.5-.5l-2 2a5 5 0 0 0 7 7l1.1-1.1"/></svg>'
    };

    return icons[key] ?? "";
  };

  const signalMarkup = (key, code, label, icon) => `
    <div class="auth-gate-signal" data-auth-gate-signal="${key}">
      <span>${iconSvg(icon)}</span>
      <div><small>${code}</small><strong>${label}</strong><em data-auth-gate-signal-state>Aguardando</em></div>
      <i aria-hidden="true"></i>
    </div>`;

  panel.classList.remove("auth-hero-panel");
  panel.classList.add("auth-gate-panel");
  panel.setAttribute("aria-label", "Fluxo conceitual do Cargo Autenticador bloqueando uma ação sensível até a confirmação da identidade do motorista");
  panel.innerHTML = `
    <div class="signal-panel-grid" aria-hidden="true"></div>
    <div class="auth-gate-topbar">
      <span><i aria-hidden="true"></i> VIAGATE / CARGO AUTENTICADOR</span>
      <small data-auth-gate-badge>ORIGEM NÃO CONFIRMADA</small>
    </div>
    <div class="auth-gate-body">
      <section class="auth-gate-source" aria-label="Informação recebida por canal externo">
        <div class="auth-gate-block-head"><small>INPUT / EXTERNO</small><strong>Informação recebida</strong></div>
        <div class="auth-gate-source-channel"><span>${iconSvg("send")}</span><div><small>CANAL</small><strong>Mensagem / contato externo</strong></div></div>
        <div class="auth-gate-field"><small>TIPO</small><strong>PIX / dado para pagamento</strong></div>
        <div class="auth-gate-field"><small>INFORMAÇÃO</small><strong data-auth-source-value>Chave PIX recebida por mensagem</strong></div>
        <div class="auth-gate-source-state"><i aria-hidden="true"></i><span data-auth-source-state>Entrada externa não confiável</span></div>
      </section>
      <section class="auth-gate-core" aria-label="Barreira de confirmação de identidade">
        <div class="auth-gate-core-head">
          <span class="auth-gate-core-icon">${iconSvg("shield")}</span>
          <div><small>IDENTITY / GATE</small><strong data-auth-gate-title>Bloqueio preventivo ativo</strong><span class="auth-gate-core-status" data-auth-gate-status>BLOQUEADO</span></div>
        </div>
        <div class="auth-gate-signals">
          ${signalMarkup("phone", "PHONE / 01", "Telefone", "phone")}
          ${signalMarkup("location", "GEO / 02", "Localização", "location")}
          ${signalMarkup("biometry", "BIO / 03", "Biometria + prova de vida", "biometry")}
        </div>
        <div class="auth-gate-source-channel"><span>${iconSvg("link")}</span><div><small>LINK INDIVIDUAL</small><strong data-auth-gate-link>Link individual disponível</strong></div></div>
      </section>
      <section class="auth-gate-secure" aria-label="Área segura liberada somente após autenticação">
        <div class="auth-gate-secure-head"><span class="auth-gate-core-icon">${iconSvg("receipt")}</span><div><small>SECURE / DATA</small><strong>Área protegida</strong></div></div>
        <div class="auth-gate-lock"><span>${iconSvg("shield")}</span><div><small>STATUS</small><strong data-auth-lock-state>Aguardando autenticação</strong></div></div>
        <div class="auth-gate-lock-state"><i aria-hidden="true"></i><span data-auth-lock-label>BLOQUEADA</span></div>
        <div class="auth-gate-field"><small>ETAPA</small><strong>Informar dados para pagamento</strong></div>
        <div class="auth-gate-field auth-gate-sensitive-value"><small>DADO</small><strong data-auth-secure-value>••••••••••••••••</strong></div>
        <div class="auth-gate-owner"><span>${iconSvg("user")}</span><div><small>VÍNCULO</small><strong data-auth-gate-owner>Motorista ainda não autenticado</strong></div></div>
      </section>
    </div>
    <div class="auth-gate-footer">
      <span>Entrada externa</span><span>Identity Gate</span><span>Área segura</span>
      <strong data-auth-gate-footer>AÇÃO SENSÍVEL BLOQUEADA</strong>
    </div>`;

  const signals = new Map(
    Array.from(panel.querySelectorAll("[data-auth-gate-signal]")).map((element) => [element.dataset.authGateSignal, element])
  );
  const badge = panel.querySelector("[data-auth-gate-badge]");
  const title = panel.querySelector("[data-auth-gate-title]");
  const status = panel.querySelector("[data-auth-gate-status]");
  const sourceState = panel.querySelector("[data-auth-source-state]");
  const sourceValue = panel.querySelector("[data-auth-source-value]");
  const linkState = panel.querySelector("[data-auth-gate-link]");
  const lockState = panel.querySelector("[data-auth-lock-state]");
  const lockLabel = panel.querySelector("[data-auth-lock-label]");
  const secureValue = panel.querySelector("[data-auth-secure-value]");
  const owner = panel.querySelector("[data-auth-gate-owner]");
  const footer = panel.querySelector("[data-auth-gate-footer]");
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

      const stateLabel = element.querySelector("[data-auth-gate-signal-state]");
      const isActive = stage.active === key;
      const isDone = doneSet.has(key);

      element.classList.toggle("is-active", isActive);
      element.classList.toggle("is-done", isDone);

      if (stateLabel instanceof HTMLElement) {
        stateLabel.textContent = isDone ? signalDefinitions[key].done : isActive ? signalDefinitions[key].active : "Aguardando";
      }
    });

    const approved = stage.approved === true;
    panel.classList.toggle("is-approved", approved);

    if (badge instanceof HTMLElement) badge.textContent = stage.badge;
    if (title instanceof HTMLElement) title.textContent = stage.title;
    if (status instanceof HTMLElement) status.textContent = stage.status;
    if (sourceState instanceof HTMLElement) sourceState.textContent = stage.sourceState;
    if (sourceValue instanceof HTMLElement) sourceValue.textContent = stage.sourceValue;
    if (linkState instanceof HTMLElement) linkState.textContent = stage.linkState;
    if (lockState instanceof HTMLElement) lockState.textContent = stage.lockState;
    if (lockLabel instanceof HTMLElement) lockLabel.textContent = approved ? "LIBERADA" : "BLOQUEADA";
    if (secureValue instanceof HTMLElement) secureValue.textContent = stage.secureValue;
    if (owner instanceof HTMLElement) owner.textContent = stage.owner;
    if (footer instanceof HTMLElement) footer.textContent = stage.footer;
  };

  const scheduleNext = () => {
    if (!isVisible || prefersReducedMotion) {
      return;
    }

    const delay = stageIndex === stages.length - 1 ? 2600 : 1450;
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
      { threshold: 0.2 }
    );

    observer.observe(panel);
    window.addEventListener("pagehide", () => observer.disconnect(), { once: true });
  }

  window.addEventListener("pagehide", stop, { once: true });
  start();
};

const initializeCargoAuthenticatorProcess = () => {
  const process = document.querySelector("[data-auth-process]");

  if (!(process instanceof HTMLElement)) {
    return;
  }

  const steps = Array.from(process.querySelectorAll("[data-auth-process-step]"));
  const stateLabel = process.querySelector("[data-auth-process-state]");
  const counterLabel = process.querySelector("[data-auth-process-counter]");
  const detailLabel = process.querySelector("[data-auth-process-detail]");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let activeIndex = 0;
  let timerId = null;
  let isVisible = true;

  const applyStep = (index) => {
    const activeStep = steps[index];

    steps.forEach((step, stepIndex) => {
      if (!(step instanceof HTMLElement)) {
        return;
      }

      step.classList.toggle("is-active", stepIndex === index);
      step.classList.toggle("is-done", stepIndex < index);

      if (stepIndex === index) {
        step.setAttribute("aria-current", "step");
      } else {
        step.removeAttribute("aria-current");
      }
    });

    if (!(activeStep instanceof HTMLElement)) {
      return;
    }

    if (stateLabel instanceof HTMLElement) {
      stateLabel.textContent = activeStep.dataset.stepState ?? "Processando";
    }

    if (counterLabel instanceof HTMLElement) {
      counterLabel.textContent = `${String(index + 1).padStart(2, "0")} / ${String(steps.length).padStart(2, "0")}`;
    }

    if (detailLabel instanceof HTMLElement) {
      detailLabel.textContent = activeStep.dataset.stepDetail ?? "";
    }
  };

  const scheduleNext = () => {
    if (!isVisible || prefersReducedMotion) {
      return;
    }

    const delay = activeIndex === steps.length - 1 ? 2800 : 2100;
    timerId = window.setTimeout(() => {
      activeIndex = (activeIndex + 1) % steps.length;
      applyStep(activeIndex);
      scheduleNext();
    }, delay);
  };

  const start = () => {
    if (timerId !== null || prefersReducedMotion) {
      return;
    }

    applyStep(activeIndex);
    scheduleNext();
  };

  const stop = () => {
    if (timerId !== null) {
      window.clearTimeout(timerId);
      timerId = null;
    }
  };

  if (prefersReducedMotion) {
    activeIndex = steps.length - 1;
    applyStep(activeIndex);
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

    observer.observe(process);
    window.addEventListener("pagehide", () => observer.disconnect(), { once: true });
  }

  window.addEventListener("pagehide", stop, { once: true });
  start();
};

initializeCargoAuthenticatorHero();
initializeCargoAuthenticatorProcess();

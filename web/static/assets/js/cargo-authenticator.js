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
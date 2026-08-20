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
    { label: "Link individual gerado", active: null, done: [] },
    { label: "Confirmando telefone", active: "phone", done: [] },
    { label: "Registrando localização", active: "location", done: ["phone"] },
    { label: "Validando biometria", active: "biometry", done: ["phone", "location"] },
    { label: "Identidade confirmada", active: null, done: ["phone", "location", "biometry"], unlocked: true }
  ];

  const signals = new Map(
    Array.from(panel.querySelectorAll("[data-auth-signal]")).map((element) => [element.dataset.authSignal, element])
  );
  const stageLabel = panel.querySelector("[data-auth-hero-stage]");
  const progressLabel = panel.querySelector("[data-auth-hero-progress]");
  const gateLabel = panel.querySelector("[data-auth-hero-gate]");
  const decisionLabel = panel.querySelector("[data-auth-hero-decision]");
  const identity = panel.querySelector("[data-auth-identity]");
  const sensitiveArea = panel.querySelector("[data-auth-sensitive-area]");
  const sensitiveStatus = panel.querySelector("[data-auth-sensitive-status]");
  const sensitiveValue = panel.querySelector("[data-auth-sensitive-value]");
  const sensitiveOwner = panel.querySelector("[data-auth-sensitive-owner]");
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

      const stateLabel = element.querySelector("[data-auth-signal-state]");
      const isActive = stage.active === key;
      const isDone = doneSet.has(key);

      element.classList.toggle("is-active", isActive);
      element.classList.toggle("is-done", isDone);

      if (stateLabel instanceof HTMLElement) {
        stateLabel.textContent = isDone ? signalDefinitions[key].done : isActive ? signalDefinitions[key].active : "Aguardando";
      }
    });

    if (stageLabel instanceof HTMLElement) {
      stageLabel.textContent = stage.label;
    }

    if (progressLabel instanceof HTMLElement) {
      const completed = Math.min(stage.done.length + (stage.active ? 1 : 0), 3);
      progressLabel.textContent = `${String(completed).padStart(2, "0")} / 03 SINAIS`;
    }

    const unlocked = stage.unlocked === true;

    if (identity instanceof HTMLElement) {
      identity.classList.toggle("is-active", !unlocked && index > 0);
      identity.classList.toggle("is-complete", unlocked);
    }

    if (sensitiveArea instanceof HTMLElement) {
      sensitiveArea.classList.toggle("is-unlocked", unlocked);
    }

    if (gateLabel instanceof HTMLElement) {
      gateLabel.textContent = unlocked ? "ÁREA SENSÍVEL LIBERADA" : "DADOS SENSÍVEIS BLOQUEADOS";
      gateLabel.classList.toggle("is-unlocked", unlocked);
    }

    if (decisionLabel instanceof HTMLElement) {
      decisionLabel.textContent = unlocked ? "IDENTIDADE CONFIRMADA / LIBERADO" : "IDENTIDADE EM VALIDAÇÃO";
      decisionLabel.classList.toggle("is-complete", unlocked);
    }

    if (sensitiveStatus instanceof HTMLElement) {
      sensitiveStatus.textContent = unlocked ? "Liberado para preenchimento" : "Aguardando autenticação";
    }

    if (sensitiveValue instanceof HTMLElement) {
      sensitiveValue.textContent = unlocked ? "CAMPO LIBERADO" : "••••••••••••••••";
    }

    if (sensitiveOwner instanceof HTMLElement) {
      sensitiveOwner.textContent = unlocked ? "Motorista autenticado" : "Motorista ainda não validado";
    }
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

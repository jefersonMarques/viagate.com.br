const initializeWhatsAppDialog = () => {
  const openButton = document.querySelector("[data-whatsapp-open]");
  const dialog = document.querySelector("[data-whatsapp-dialog]");

  if (!(openButton instanceof HTMLButtonElement) || !(dialog instanceof HTMLDialogElement)) {
    return;
  }

  openButton.addEventListener("click", () => {
    dialog.showModal();
  });

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      dialog.close();
    }
  });
};

const initializeFadeUp = () => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    return;
  }

  const elements = Array.from(
    document.querySelectorAll("main section > .container > *, main .page-hero > .container > *, main .hero > .container > *")
  );

  if (elements.length === 0) {
    return;
  }

  document.documentElement.classList.add("reveal-ready");

  const parentIndexes = new Map();

  elements.forEach((element) => {
    const parent = element.parentElement;
    const index = parentIndexes.get(parent) ?? 0;

    parentIndexes.set(parent, index + 1);
    element.classList.add("fade-up");
    element.style.setProperty("--fade-delay", `${Math.min(index, 5) * 70}ms`);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -8% 0px"
    }
  );

  elements.forEach((element) => {
    observer.observe(element);
  });
};

const initializeRiskEngine = () => {
  const engine = document.querySelector("[data-risk-engine]");

  if (!(engine instanceof HTMLElement)) {
    return;
  }

  const steps = Array.from(engine.querySelectorAll("[data-process-step]"));
  const signals = Array.from(engine.querySelectorAll("[data-signal-state]"));

  if (steps.length === 0 || signals.length === 0) {
    return;
  }

  const signalPhases = {
    biometry: { start: 2, completeAt: 3 },
    location: { start: 3, completeAt: 4 },
    data: { start: 4, completeAt: 5 },
    documents: { start: 5, completeAt: 6 },
    risk: { start: 6, completeAt: 8 },
    release: { start: 8, completeAt: 9 }
  };

  const lastStepIndex = steps.length - 1;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let currentStepIndex = 0;
  let timerId = null;
  let isRunning = false;

  const updateSignal = (signal, state) => {
    const label = signal.querySelector("[data-signal-label]");

    signal.classList.toggle("is-active", state === "active");
    signal.classList.toggle("is-complete", state === "complete");

    if (!(label instanceof HTMLElement)) {
      return;
    }

    if (state === "complete") {
      label.textContent = signal.dataset.completeLabel ?? "Validado";
      return;
    }

    if (state === "active") {
      label.textContent = signal.dataset.activeLabel ?? "Em validação";
      return;
    }

    label.textContent = signal.dataset.pendingLabel ?? "Aguardando";
  };

  const render = (stepIndex) => {
    steps.forEach((step, index) => {
      const isFinalCompletedStep = stepIndex === lastStepIndex && index === lastStepIndex;

      step.classList.toggle("is-complete", index < stepIndex || isFinalCompletedStep);
      step.classList.toggle("is-active", index === stepIndex && !isFinalCompletedStep);
    });

    signals.forEach((signal) => {
      const key = signal.dataset.signalState;
      const phase = key ? signalPhases[key] : undefined;

      if (!phase || stepIndex < phase.start) {
        updateSignal(signal, "pending");
        return;
      }

      if (stepIndex < phase.completeAt) {
        updateSignal(signal, "active");
        return;
      }

      updateSignal(signal, "complete");
    });

    engine.classList.toggle("is-released", stepIndex === lastStepIndex);
  };

  const stop = () => {
    isRunning = false;

    if (timerId !== null) {
      window.clearTimeout(timerId);
      timerId = null;
    }
  };

  const scheduleNextStep = () => {
    if (!isRunning) {
      return;
    }

    if (currentStepIndex === lastStepIndex) {
      timerId = window.setTimeout(() => {
        currentStepIndex = 0;
        render(currentStepIndex);
        scheduleNextStep();
      }, 2600);
      return;
    }

    timerId = window.setTimeout(() => {
      currentStepIndex += 1;
      render(currentStepIndex);
      scheduleNextStep();
    }, 1050);
  };

  const start = () => {
    if (isRunning) {
      return;
    }

    isRunning = true;
    render(currentStepIndex);
    scheduleNextStep();
  };

  if (prefersReducedMotion) {
    currentStepIndex = lastStepIndex;
    render(currentStepIndex);
    engine.classList.add("is-static");
    return;
  }

  render(currentStepIndex);

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
      threshold: 0.2
    }
  );

  observer.observe(engine);
};

initializeWhatsAppDialog();
initializeFadeUp();
initializeRiskEngine();

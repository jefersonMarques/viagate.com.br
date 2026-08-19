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
  const scenarioLabel = engine.querySelector(".timeline-heading > div > span");
  const scenarioTitle = engine.querySelector(".timeline-heading > div > strong");
  const stepCounter = engine.querySelector(".timeline-heading > p > span");
  const signalHeading = engine.querySelector(".status-heading > span");
  const signalMeta = engine.querySelector(".status-heading > small");

  if (steps.length === 0 || signals.length === 0) {
    return;
  }

  const scenarios = [
    {
      key: "approval",
      scenarioClass: "scenario-approval",
      label: "CENÁRIO 01 · APROVAÇÃO AUTOMÁTICA",
      title: "Validação em tempo real",
      signalMeta: "aprovação automática",
      ariaLabel: "Cenário de aprovação automática e liberação de viagem",
      stepDuration: 650,
      holdDuration: 1800,
      finalClass: "is-approved",
      steps: [
        { label: "Recebendo dados", outcome: "success" },
        { label: "Gerando link", outcome: "success" },
        { label: "Validando biometria", outcome: "success" },
        { label: "Validando localização", outcome: "success" },
        { label: "Analisando dados pessoais", outcome: "success" },
        { label: "Validando CNH", outcome: "success" },
        { label: "Analisando processos", outcome: "success" },
        { label: "Analisando veículo", outcome: "success" },
        { label: "Gerando liberação", outcome: "success" },
        { label: "Liberação concluída", outcome: "success" }
      ],
      signals: [
        {
          category: "IDENTIDADE",
          states: [
            { at: 0, state: "pending", label: "Aguardando biometria" },
            { at: 2, state: "active", label: "Validando biometria" },
            { at: 3, state: "complete", label: "Biometria validada" }
          ]
        },
        {
          category: "LOCALIZAÇÃO",
          states: [
            { at: 0, state: "pending", label: "Aguardando localização" },
            { at: 3, state: "active", label: "Validando localização" },
            { at: 4, state: "complete", label: "Localização confirmada" }
          ]
        },
        {
          category: "CADASTRO",
          states: [
            { at: 0, state: "pending", label: "Aguardando dados" },
            { at: 4, state: "active", label: "Analisando dados" },
            { at: 5, state: "complete", label: "Dados validados" }
          ]
        },
        {
          category: "DOCUMENTAÇÃO",
          states: [
            { at: 0, state: "pending", label: "Aguardando documento" },
            { at: 5, state: "active", label: "Validando CNH" },
            { at: 6, state: "complete", label: "Documentação validada" }
          ]
        },
        {
          category: "CONTEXTO DE RISCO",
          states: [
            { at: 0, state: "pending", label: "Aguardando análise" },
            { at: 6, state: "active", label: "Analisando contexto" },
            { at: 8, state: "complete", label: "Risco analisado" }
          ]
        },
        {
          category: "DECISÃO",
          states: [
            { at: 0, state: "pending", label: "Aguardando liberação" },
            { at: 8, state: "active", label: "Gerando liberação" },
            { at: 10, state: "complete", label: "Liberado para viagem" }
          ]
        }
      ]
    },
    {
      key: "fraud",
      scenarioClass: "scenario-fraud",
      label: "CENÁRIO 02 · SUSPEITA DE FRAUDE",
      title: "Protocolo antifraude em execução",
      signalMeta: "bloqueio ativo",
      ariaLabel: "Cenário de suspeita de fraude com reprovação de registro",
      stepDuration: 610,
      holdDuration: 1900,
      contextFrom: 3,
      contextClass: "is-danger",
      finalClass: "is-rejected",
      steps: [
        { label: "Recebendo dados", outcome: "success" },
        { label: "Gerando link", outcome: "success" },
        { label: "Validando biometria", outcome: "danger", result: "×" },
        { label: "Inconsistência biométrica", outcome: "danger", result: "!" },
        { label: "Confirmando tentativa suspeita", outcome: "danger", result: "!" },
        { label: "Ativando protocolo antifraude", outcome: "danger", result: "!" },
        { label: "Registrando evidências", outcome: "danger", result: "!" },
        { label: "Bloqueando liberação", outcome: "danger", result: "×" },
        { label: "Registrando ocorrência", outcome: "danger", result: "!" },
        { label: "Registro reprovado", outcome: "danger", result: "×" }
      ],
      signals: [
        {
          category: "IDENTIDADE",
          states: [
            { at: 0, state: "pending", label: "Aguardando biometria" },
            { at: 2, state: "active", label: "Validando biometria" },
            { at: 3, state: "danger", label: "Falha biométrica detectada" }
          ]
        },
        {
          category: "ANTIFRAUDE",
          states: [
            { at: 0, state: "pending", label: "Aguardando sinais" },
            { at: 3, state: "active", label: "Analisando inconsistência" },
            { at: 5, state: "danger", label: "Tentativa suspeita confirmada" }
          ]
        },
        {
          category: "EVIDÊNCIAS",
          states: [
            { at: 0, state: "pending", label: "Aguardando evidências" },
            { at: 5, state: "active", label: "Coletando evidências" },
            { at: 7, state: "danger", label: "Evidências registradas" }
          ]
        },
        {
          category: "POLÍTICA",
          states: [
            { at: 0, state: "pending", label: "Aguardando protocolo" },
            { at: 5, state: "active", label: "Ativando protocolo" },
            { at: 8, state: "danger", label: "Protocolo antifraude ativo" }
          ]
        },
        {
          category: "LIBERAÇÃO",
          states: [
            { at: 0, state: "pending", label: "Aguardando decisão" },
            { at: 7, state: "active", label: "Bloqueando liberação" },
            { at: 9, state: "danger", label: "Liberação bloqueada" }
          ]
        },
        {
          category: "DECISÃO",
          states: [
            { at: 0, state: "pending", label: "Aguardando resultado" },
            { at: 8, state: "active", label: "Registrando ocorrência" },
            { at: 10, state: "danger", label: "Registro reprovado" }
          ]
        }
      ]
    },
    {
      key: "review",
      scenarioClass: "scenario-review",
      label: "CENÁRIO 03 · ANÁLISE HUMANA",
      title: "Decisão assistida por análise humana",
      signalMeta: "análise assistida",
      ariaLabel: "Cenário de alerta operacional com análise humana e aprovação manual",
      stepDuration: 650,
      holdDuration: 2000,
      contextFrom: 6,
      contextClass: "is-warning",
      finalClass: "is-manual-approved",
      steps: [
        { label: "Recebendo dados", outcome: "success" },
        { label: "Gerando link", outcome: "success" },
        { label: "Validando biometria", outcome: "success" },
        { label: "Validando localização", outcome: "success" },
        { label: "Analisando dados cadastrais", outcome: "success" },
        { label: "Validando CNH", outcome: "success" },
        { label: "Analisando processos", outcome: "warning", result: "!" },
        { label: "Enviando para análise humana", outcome: "warning", result: "→" },
        { label: "Aprovado manualmente", outcome: "success" },
        { label: "Registrando operação", outcome: "success" }
      ],
      signals: [
        {
          category: "IDENTIDADE",
          states: [
            { at: 0, state: "pending", label: "Aguardando biometria" },
            { at: 2, state: "active", label: "Validando biometria" },
            { at: 3, state: "complete", label: "Biometria validada" }
          ]
        },
        {
          category: "LOCALIZAÇÃO",
          states: [
            { at: 0, state: "pending", label: "Aguardando localização" },
            { at: 3, state: "active", label: "Validando localização" },
            { at: 4, state: "complete", label: "Localização confirmada" }
          ]
        },
        {
          category: "CADASTRO",
          states: [
            { at: 0, state: "pending", label: "Aguardando dados" },
            { at: 4, state: "active", label: "Analisando dados" },
            { at: 5, state: "complete", label: "Dados validados" }
          ]
        },
        {
          category: "DOCUMENTAÇÃO",
          states: [
            { at: 0, state: "pending", label: "Aguardando documento" },
            { at: 5, state: "active", label: "Validando CNH" },
            { at: 6, state: "complete", label: "Documentação validada" }
          ]
        },
        {
          category: "CONTEXTO",
          states: [
            { at: 0, state: "pending", label: "Aguardando análise" },
            { at: 6, state: "active", label: "Analisando processos" },
            { at: 7, state: "warning", label: "Alerta de contexto identificado" }
          ]
        },
        {
          category: "DECISÃO",
          states: [
            { at: 0, state: "pending", label: "Aguardando decisão" },
            { at: 7, state: "warning", label: "Análise humana acionada" },
            { at: 8, state: "active", label: "Análise manual em andamento" },
            { at: 9, state: "complete", label: "Aprovado manualmente" },
            { at: 10, state: "complete", label: "Cadastro aprovado" }
          ]
        }
      ]
    }
  ];

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const stateClasses = ["is-active", "is-complete", "is-danger", "is-warning"];
  const engineStateClasses = [
    "scenario-approval",
    "scenario-fraud",
    "scenario-review",
    "is-danger",
    "is-warning",
    "is-approved",
    "is-rejected",
    "is-manual-approved",
    "is-released"
  ];
  let scenarioIndex = 0;
  let currentStepIndex = 0;
  let timerId = null;
  let isRunning = false;

  const getSignalState = (signal, stepIndex) => {
    let resolvedState = signal.states[0];

    signal.states.forEach((state) => {
      if (stepIndex >= state.at) {
        resolvedState = state;
      }
    });

    return resolvedState;
  };

  const renderSignal = (element, config, stepIndex) => {
    const category = element.querySelector("small");
    const label = element.querySelector("[data-signal-label]");
    const result = element.querySelector(".signal-state-check");
    const resolvedState = getSignalState(config, stepIndex);

    stateClasses.forEach((className) => element.classList.remove(className));

    if (resolvedState.state !== "pending") {
      element.classList.add(`is-${resolvedState.state}`);
    }

    if (category instanceof HTMLElement) {
      category.textContent = config.category;
    }

    if (label instanceof HTMLElement) {
      label.textContent = resolvedState.label;
    }

    if (result instanceof HTMLElement) {
      result.textContent = resolvedState.state === "danger" ? "×" : resolvedState.state === "warning" ? "!" : "✓";
    }
  };

  const renderStep = (element, config, index, stepIndex) => {
    const indexLabel = element.querySelector(".process-index");
    const label = element.querySelector(".process-step-body strong");
    const result = element.querySelector(".process-result");
    const isComplete = index < stepIndex;
    const isActive = index === stepIndex && stepIndex < steps.length;

    element.classList.remove(
      "is-active",
      "is-complete",
      "is-outcome-success",
      "is-outcome-danger",
      "is-outcome-warning"
    );
    element.classList.toggle("is-complete", isComplete);
    element.classList.toggle("is-active", isActive);

    if (isComplete) {
      element.classList.add(`is-outcome-${config.outcome}`);
    }

    if (indexLabel instanceof HTMLElement) {
      indexLabel.textContent = String(index + 1).padStart(2, "0");
    }

    if (label instanceof HTMLElement) {
      label.textContent = config.label;
    }

    if (result instanceof HTMLElement) {
      result.textContent = config.result ?? (config.outcome === "warning" ? "!" : config.outcome === "danger" ? "×" : "✓");
    }
  };

  const render = () => {
    const scenario = scenarios[scenarioIndex];
    const isScenarioComplete = currentStepIndex >= scenario.steps.length;

    engineStateClasses.forEach((className) => engine.classList.remove(className));
    engine.classList.add(scenario.scenarioClass);

    if (!isScenarioComplete && scenario.contextClass && currentStepIndex >= scenario.contextFrom) {
      engine.classList.add(scenario.contextClass);
    }

    if (isScenarioComplete) {
      engine.classList.add(scenario.finalClass);

      if (scenario.key === "approval") {
        engine.classList.add("is-released");
      }
    }

    engine.setAttribute("aria-label", scenario.ariaLabel);

    if (scenarioLabel instanceof HTMLElement) {
      scenarioLabel.textContent = scenario.label;
    }

    if (scenarioTitle instanceof HTMLElement) {
      scenarioTitle.textContent = scenario.title;
    }

    if (stepCounter instanceof HTMLElement) {
      stepCounter.textContent = `${scenario.steps.length} etapas`;
    }

    if (signalHeading instanceof HTMLElement) {
      signalHeading.textContent = "SINAIS";
    }

    if (signalMeta instanceof HTMLElement) {
      signalMeta.textContent = scenario.signalMeta;
    }

    steps.forEach((step, index) => {
      renderStep(step, scenario.steps[index], index, currentStepIndex);
    });

    signals.forEach((signal, index) => {
      renderSignal(signal, scenario.signals[index], currentStepIndex);
    });
  };

  const stop = () => {
    isRunning = false;

    if (timerId !== null) {
      window.clearTimeout(timerId);
      timerId = null;
    }
  };

  const advanceScenario = () => {
    scenarioIndex = (scenarioIndex + 1) % scenarios.length;
    currentStepIndex = 0;
    render();
  };

  const scheduleNextStep = () => {
    if (!isRunning) {
      return;
    }

    const scenario = scenarios[scenarioIndex];

    if (currentStepIndex >= scenario.steps.length) {
      timerId = window.setTimeout(() => {
        advanceScenario();
        scheduleNextStep();
      }, scenario.holdDuration);
      return;
    }

    timerId = window.setTimeout(() => {
      currentStepIndex += 1;
      render();
      scheduleNextStep();
    }, scenario.stepDuration);
  };

  const start = () => {
    if (isRunning) {
      return;
    }

    isRunning = true;
    render();
    scheduleNextStep();
  };

  if (prefersReducedMotion) {
    scenarioIndex = 0;
    currentStepIndex = scenarios[0].steps.length;
    render();
    engine.classList.add("is-static");
    return;
  }

  render();

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

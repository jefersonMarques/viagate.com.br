const initializePreventionVehicleHero = () => {
  const panel = document.querySelector("[data-prevention-vehicle-panel]");

  if (!(panel instanceof HTMLElement)) {
    return;
  }

  const checks = Array.from(panel.querySelectorAll("[data-prevention-check]"));
  const plate = panel.querySelector("[data-prevention-plate]");
  const plateState = panel.querySelector("[data-prevention-plate-state]");
  const vehicleType = panel.querySelector("[data-prevention-vehicle-type]");
  const vehicleModel = panel.querySelector("[data-prevention-vehicle-model]");
  const vehicleYear = panel.querySelector("[data-prevention-vehicle-year]");
  const vehicleConfig = panel.querySelector("[data-prevention-vehicle-config]");
  const recordState = panel.querySelector("[data-prevention-record-state]");
  const cycleLabel = panel.querySelector("[data-prevention-cycle]");
  const analysisCount = panel.querySelector("[data-prevention-analysis-count]");
  const headerState = panel.querySelector("[data-prevention-header-state]");
  const footer = panel.querySelector("[data-prevention-footer]");

  if (!checks.length) {
    return;
  }

  const dossiers = [
    {
      plate: "ABC1D23",
      type: "CAVALO MECÂNICO",
      model: "VOLVO FH 540",
      year: "2024 / 2024",
      configuration: "6x2",
      checks: [
        { final: "02 REGISTROS", result: "warning" },
        { final: "PENDÊNCIA", result: "warning" },
        { final: "REGULAR", result: "done" },
        { final: "SEM ALERTAS", result: "done" },
        { final: "CONSULTADO", result: "done" }
      ]
    },
    {
      plate: "RSK4B19",
      type: "CAMINHÃO BAÚ",
      model: "IVECO TECTOR 17-280",
      year: "2023 / 2024",
      configuration: "4x2",
      checks: [
        { final: "REGULAR", result: "done" },
        { final: "REGULAR", result: "done" },
        { final: "REGULAR", result: "done" },
        { final: "01 ALERTA", result: "warning" },
        { final: "CONSULTADO", result: "done" }
      ]
    },
    {
      plate: "QWE7H52",
      type: "CAMINHÃO RÍGIDO",
      model: "M.BENZ ATEGO 2429",
      year: "2022 / 2022",
      configuration: "6x2",
      checks: [
        { final: "01 REGISTRO", result: "warning" },
        { final: "REGULAR", result: "done" },
        { final: "VENC. PRÓXIMO", result: "warning" },
        { final: "SEM ALERTAS", result: "done" },
        { final: "CONSULTADO", result: "done" }
      ]
    }
  ];

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const timers = new Set();
  let dossierIndex = 0;
  let isVisible = true;

  const schedule = (callback, delay) => {
    const id = window.setTimeout(() => {
      timers.delete(id);
      callback();
    }, delay);

    timers.add(id);
    return id;
  };

  const clearTimers = () => {
    timers.forEach((id) => window.clearTimeout(id));
    timers.clear();
  };

  const resetChecks = () => {
    checks.forEach((check) => {
      if (!(check instanceof HTMLElement)) {
        return;
      }

      check.classList.remove("is-processing", "is-done", "is-warning");
      const state = check.querySelector("[data-prevention-check-state]");

      if (state instanceof HTMLElement) {
        state.textContent = "AGUARDANDO";
      }
    });

    if (analysisCount instanceof HTMLElement) {
      analysisCount.textContent = `00 / ${String(checks.length).padStart(2, "0")}`;
    }
  };

  const applyDossier = (index) => {
    const dossier = dossiers[index];

    if (!dossier) {
      return;
    }

    if (plate instanceof HTMLElement) plate.textContent = dossier.plate;
    if (vehicleType instanceof HTMLElement) vehicleType.textContent = dossier.type;
    if (vehicleModel instanceof HTMLElement) vehicleModel.textContent = dossier.model;
    if (vehicleYear instanceof HTMLElement) vehicleYear.textContent = dossier.year;
    if (vehicleConfig instanceof HTMLElement) vehicleConfig.textContent = dossier.configuration;

    if (cycleLabel instanceof HTMLElement) {
      cycleLabel.textContent = `${String(index + 1).padStart(2, "0")} / ${String(dossiers.length).padStart(2, "0")}`;
    }

    checks.forEach((check, checkIndex) => {
      if (!(check instanceof HTMLElement)) {
        return;
      }

      const result = dossier.checks[checkIndex];

      if (!result) {
        return;
      }

      check.dataset.final = result.final;
      check.dataset.result = result.result;
    });
  };

  const runScan = () => {
    panel.classList.remove("is-scanning");
    void panel.offsetWidth;
    panel.classList.add("is-scanning");
  };

  const finishDossier = () => {
    const dossier = dossiers[dossierIndex];
    const warningCount = dossier.checks.filter((check) => check.result === "warning").length;

    panel.classList.add("is-complete");

    if (headerState instanceof HTMLElement) headerState.textContent = "DOSSIÊ CONCLUÍDO";
    if (plateState instanceof HTMLElement) plateState.textContent = "VEÍCULO ANALISADO";
    if (recordState instanceof HTMLElement) recordState.textContent = "CADASTRO CONSOLIDADO";

    if (footer instanceof HTMLElement) {
      footer.textContent = warningCount > 0
        ? `${String(warningCount).padStart(2, "0")} ALERTAS IDENTIFICADOS / TRATATIVA PREVENTIVA`
        : "VEÍCULO SEM ALERTAS / CONSULTA CONCLUÍDA";
    }

    schedule(() => {
      dossierIndex = (dossierIndex + 1) % dossiers.length;
      startDossierCycle();
    }, 2100);
  };

  const processCheck = (index) => {
    if (!isVisible) {
      return;
    }

    if (index >= checks.length) {
      finishDossier();
      return;
    }

    const check = checks[index];

    if (!(check instanceof HTMLElement)) {
      processCheck(index + 1);
      return;
    }

    const state = check.querySelector("[data-prevention-check-state]");
    check.classList.add("is-processing");

    if (state instanceof HTMLElement) {
      state.textContent = "PROCESSANDO";
    }

    if (analysisCount instanceof HTMLElement) {
      analysisCount.textContent = `${String(index + 1).padStart(2, "0")} / ${String(checks.length).padStart(2, "0")}`;
    }

    schedule(() => {
      check.classList.remove("is-processing");
      check.classList.add(check.dataset.result === "warning" ? "is-warning" : "is-done");

      if (state instanceof HTMLElement) {
        state.textContent = check.dataset.final ?? "CONCLUÍDO";
      }

      processCheck(index + 1);
    }, 760);
  };

  const startDossierCycle = () => {
    if (!isVisible) {
      return;
    }

    clearTimers();
    panel.classList.remove("is-complete");
    resetChecks();
    applyDossier(dossierIndex);
    runScan();

    if (headerState instanceof HTMLElement) headerState.textContent = "IDENTIFICANDO VEÍCULO";
    if (plateState instanceof HTMLElement) plateState.textContent = "CONSULTANDO CADASTRO";
    if (recordState instanceof HTMLElement) recordState.textContent = "LOCALIZANDO DADOS";
    if (footer instanceof HTMLElement) footer.textContent = "CONSULTANDO REGISTROS DO VEÍCULO";

    schedule(() => {
      if (headerState instanceof HTMLElement) headerState.textContent = "VEÍCULO IDENTIFICADO";
      if (plateState instanceof HTMLElement) plateState.textContent = "PLACA CONFIRMADA";
      if (recordState instanceof HTMLElement) recordState.textContent = "DADOS LOCALIZADOS";
      processCheck(0);
    }, 1120);
  };

  const renderReducedMotionState = () => {
    dossierIndex = 0;
    applyDossier(dossierIndex);
    resetChecks();

    checks.forEach((check, index) => {
      if (!(check instanceof HTMLElement)) {
        return;
      }

      const state = check.querySelector("[data-prevention-check-state]");
      check.classList.add(check.dataset.result === "warning" ? "is-warning" : "is-done");

      if (state instanceof HTMLElement) {
        state.textContent = check.dataset.final ?? "CONCLUÍDO";
      }

      if (analysisCount instanceof HTMLElement) {
        analysisCount.textContent = `${String(index + 1).padStart(2, "0")} / ${String(checks.length).padStart(2, "0")}`;
      }
    });

    panel.classList.add("is-complete");
    if (headerState instanceof HTMLElement) headerState.textContent = "DOSSIÊ CONCLUÍDO";
    if (plateState instanceof HTMLElement) plateState.textContent = "VEÍCULO ANALISADO";
    if (recordState instanceof HTMLElement) recordState.textContent = "CADASTRO CONSOLIDADO";
    if (footer instanceof HTMLElement) footer.textContent = "02 ALERTAS IDENTIFICADOS / TRATATIVA PREVENTIVA";
  };

  if (prefersReducedMotion) {
    renderReducedMotionState();
    return;
  }

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;

          if (isVisible) {
            startDossierCycle();
          } else {
            clearTimers();
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(panel);
    window.addEventListener("pagehide", () => observer.disconnect(), { once: true });
  }

  window.addEventListener("pagehide", clearTimers, { once: true });
  startDossierCycle();
};

initializePreventionVehicleHero();

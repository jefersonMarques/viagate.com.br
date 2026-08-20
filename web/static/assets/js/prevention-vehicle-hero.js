const initializePreventionVehicleHero = () => {
  const panel = document.querySelector("[data-prevention-vehicle-panel]");

  if (!(panel instanceof HTMLElement)) {
    return;
  }

  const slides = Array.from(panel.querySelectorAll("[data-prevention-vehicle]"));
  const checks = Array.from(panel.querySelectorAll("[data-prevention-check]"));
  const plate = panel.querySelector("[data-prevention-plate]");
  const plateState = panel.querySelector("[data-prevention-plate-state]");
  const vehicleType = panel.querySelector("[data-prevention-vehicle-type]");
  const cycleLabel = panel.querySelector("[data-prevention-cycle]");
  const headerState = panel.querySelector("[data-prevention-header-state]");
  const footer = panel.querySelector("[data-prevention-footer]");

  if (!slides.length || !checks.length) {
    return;
  }

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const timers = new Set();
  let vehicleIndex = 0;
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
  };

  const showVehicle = (index) => {
    const slide = slides[index];

    slides.forEach((item, itemIndex) => {
      item.classList.toggle("is-active", itemIndex === index);
    });

    if (!(slide instanceof HTMLElement)) {
      return;
    }

    if (plate instanceof HTMLElement) {
      plate.textContent = slide.dataset.plate ?? "ABC1D23";
    }

    if (vehicleType instanceof HTMLElement) {
      vehicleType.textContent = slide.dataset.type ?? "VEÍCULO";
    }

    if (cycleLabel instanceof HTMLElement) {
      cycleLabel.textContent = `${String(index + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
    }
  };

  const runScan = () => {
    panel.classList.remove("is-scanning");
    void panel.offsetWidth;
    panel.classList.add("is-scanning");
  };

  const processCheck = (index) => {
    if (!isVisible) {
      return;
    }

    if (index >= checks.length) {
      panel.classList.add("is-complete");

      if (headerState instanceof HTMLElement) {
        headerState.textContent = "ANÁLISE CONCLUÍDA";
      }

      if (plateState instanceof HTMLElement) {
        plateState.textContent = "VEÍCULO ANALISADO";
      }

      if (footer instanceof HTMLElement) {
        footer.textContent = "PENDÊNCIAS IDENTIFICADAS / TRATATIVA PREVENTIVA";
      }

      schedule(() => {
        vehicleIndex = (vehicleIndex + 1) % slides.length;
        startVehicleCycle();
      }, 1900);
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

    schedule(() => {
      check.classList.remove("is-processing");

      const resultClass = check.dataset.result === "warning" ? "is-warning" : "is-done";
      check.classList.add(resultClass);

      if (state instanceof HTMLElement) {
        state.textContent = check.dataset.final ?? "CONCLUÍDO";
      }

      processCheck(index + 1);
    }, 820);
  };

  const startVehicleCycle = () => {
    if (!isVisible) {
      return;
    }

    clearTimers();
    panel.classList.remove("is-complete");
    resetChecks();
    showVehicle(vehicleIndex);
    runScan();

    if (headerState instanceof HTMLElement) {
      headerState.textContent = "IDENTIFICANDO VEÍCULO";
    }

    if (plateState instanceof HTMLElement) {
      plateState.textContent = "LENDO PLACA";
    }

    if (footer instanceof HTMLElement) {
      footer.textContent = "CONSULTANDO REGISTROS DO VEÍCULO";
    }

    schedule(() => {
      if (headerState instanceof HTMLElement) {
        headerState.textContent = "VEÍCULO IDENTIFICADO";
      }

      if (plateState instanceof HTMLElement) {
        plateState.textContent = "PLACA VALIDADA";
      }

      processCheck(0);
    }, 1180);
  };

  const renderReducedMotionState = () => {
    showVehicle(0);
    panel.classList.add("is-complete");

    checks.forEach((check) => {
      if (!(check instanceof HTMLElement)) {
        return;
      }

      const state = check.querySelector("[data-prevention-check-state]");
      check.classList.add(check.dataset.result === "warning" ? "is-warning" : "is-done");

      if (state instanceof HTMLElement) {
        state.textContent = check.dataset.final ?? "CONCLUÍDO";
      }
    });

    if (headerState instanceof HTMLElement) headerState.textContent = "ANÁLISE CONCLUÍDA";
    if (plateState instanceof HTMLElement) plateState.textContent = "VEÍCULO ANALISADO";
    if (footer instanceof HTMLElement) footer.textContent = "PENDÊNCIAS IDENTIFICADAS / TRATATIVA PREVENTIVA";
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
            startVehicleCycle();
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
  startVehicleCycle();
};

initializePreventionVehicleHero();

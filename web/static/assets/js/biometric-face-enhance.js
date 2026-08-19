const initializeBiometricFaceEnhancement = () => {
  const core = document.querySelector(".biometric-core");

  if (!(core instanceof HTMLElement)) {
    return;
  }

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const faceImagePath = "/assets/images/biometric-face-reference.webp";
  const signalItems = [
    { label: "CPF", value: "Confirmado" },
    { label: "Telefone", value: "Verificado" },
    { label: "Localização", value: "Capturada" },
    { label: "Biometria", value: "Aprovada" },
    { label: "CNH", value: "Validada" },
    { label: "ANTT", value: "Consultada" },
    { label: "Processos", value: "Analisados" },
    { label: "Veículo", value: "Verificado" }
  ];

  const createSignal = (positionClass) => {
    const signal = document.createElement("div");
    signal.className = `core-aux-signal ${positionClass}`;

    const indicator = document.createElement("span");
    indicator.className = "core-aux-signal-indicator";
    indicator.setAttribute("aria-hidden", "true");

    const copy = document.createElement("div");
    const label = document.createElement("small");
    const value = document.createElement("strong");

    copy.append(label, value);
    signal.append(indicator, copy);
    core.append(signal);

    return { signal, label, value };
  };

  const signalSlots = [
    createSignal("core-aux-signal-top-right"),
    createSignal("core-aux-signal-bottom-left")
  ];

  let signalCursor = 0;
  let signalTimerId = null;
  let revealTimerId = null;

  const renderSignals = () => {
    signalSlots.forEach(({ signal }) => signal.classList.remove("is-visible"));

    if (revealTimerId !== null) {
      window.clearTimeout(revealTimerId);
    }

    revealTimerId = window.setTimeout(() => {
      signalSlots.forEach((slot, index) => {
        const item = signalItems[(signalCursor + index) % signalItems.length];

        slot.label.textContent = item.label;
        slot.value.textContent = item.value;
        slot.signal.classList.add("is-visible");
      });

      signalCursor = (signalCursor + signalSlots.length) % signalItems.length;
      revealTimerId = null;
    }, prefersReducedMotion ? 0 : 240);
  };

  const startSignals = () => {
    renderSignals();

    if (prefersReducedMotion || signalTimerId !== null) {
      return;
    }

    signalTimerId = window.setInterval(renderSignals, 3400);
  };

  const stopSignals = () => {
    if (signalTimerId !== null) {
      window.clearInterval(signalTimerId);
      signalTimerId = null;
    }

    if (revealTimerId !== null) {
      window.clearTimeout(revealTimerId);
      revealTimerId = null;
    }
  };

  const applyFace = () => {
    core.querySelectorAll(".bio-face-oval").forEach((oval) => {
      if (!(oval instanceof HTMLElement) || oval.querySelector(".bio-face-photo")) {
        return;
      }

      const image = document.createElement("img");
      image.className = "bio-face-photo";
      image.src = faceImagePath;
      image.alt = "";
      image.decoding = "async";
      image.setAttribute("aria-hidden", "true");

      oval.prepend(image);
    });
  };

  const faceObserver = new MutationObserver(applyFace);
  faceObserver.observe(core, {
    childList: true,
    subtree: true
  });

  applyFace();

  window.addEventListener(
    "pagehide",
    () => {
      stopSignals();
      faceObserver.disconnect();
    },
    { once: true }
  );

  if (!("IntersectionObserver" in window)) {
    startSignals();
    return;
  }

  const visibilityObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          startSignals();
          return;
        }

        stopSignals();
      });
    },
    {
      threshold: 0.2
    }
  );

  visibilityObserver.observe(core);
};

initializeBiometricFaceEnhancement();

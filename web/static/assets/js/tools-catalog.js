const initializeToolsCatalog = () => {
  if (window.location.pathname !== "/ferramentas") {
    return;
  }

  const consoleElement = document.querySelector("[data-tools-hero]");

  if (!(consoleElement instanceof HTMLElement)) {
    return;
  }

  const items = Array.from(consoleElement.querySelectorAll("[data-tools-hero-item]"));
  const currentIndex = consoleElement.querySelector("[data-tools-current-index]");
  const currentTitle = consoleElement.querySelector("[data-tools-current-title]");
  const currentSummary = consoleElement.querySelector("[data-tools-current-summary]");
  const currentState = consoleElement.querySelector("[data-tools-current-state]");
  const pulse = consoleElement.querySelector("[data-tools-pulse]");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (items.length === 0) {
    return;
  }

  let activeIndex = 0;
  let timerId = null;
  let isVisible = true;

  const setText = (element, value) => {
    if (element instanceof HTMLElement) {
      element.textContent = value;
    }
  };

  const selectItem = (index, animate = true) => {
    const item = items[index];

    if (!(item instanceof HTMLElement)) {
      return;
    }

    activeIndex = index;

    items.forEach((candidate, candidateIndex) => {
      candidate.classList.toggle("is-active", candidateIndex === index);
    });

    setText(currentIndex, String(index + 1).padStart(2, "0"));
    setText(currentTitle, item.dataset.toolTitle || "Ferramenta Viagate");
    setText(currentSummary, item.dataset.toolSummary || "Capacidade conectada à operação.");
    setText(currentState, "ACTIVE / READY");

    if (pulse instanceof HTMLElement && animate && !prefersReducedMotion) {
      pulse.classList.remove("is-active");
      void pulse.offsetWidth;
      pulse.classList.add("is-active");
    }
  };

  const stop = () => {
    if (timerId !== null) {
      window.clearInterval(timerId);
      timerId = null;
    }
  };

  const start = () => {
    stop();

    if (prefersReducedMotion || !isVisible || items.length < 2) {
      return;
    }

    timerId = window.setInterval(() => {
      selectItem((activeIndex + 1) % items.length);
    }, 2300);
  };

  items.forEach((item, index) => {
    item.addEventListener("click", () => {
      selectItem(index);
      start();
    });
  });

  selectItem(0, false);

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        isVisible = entry.isIntersecting;

        if (isVisible) {
          start();
        } else {
          stop();
        }
      });
    }, { threshold: 0.2 });

    observer.observe(consoleElement);
    window.addEventListener("pagehide", () => observer.disconnect(), { once: true });
  } else {
    start();
  }

  window.addEventListener("pagehide", stop, { once: true });
};

initializeToolsCatalog();

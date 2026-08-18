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
    document.querySelectorAll("main section > .container > *, main .page-hero > .container > *, main .hero > .container > *"),
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
      rootMargin: "0px 0px -8% 0px",
    },
  );

  elements.forEach((element) => {
    observer.observe(element);
  });
};

initializeWhatsAppDialog();
initializeFadeUp();

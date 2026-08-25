const toolVisualAssets = {
  "cargo-score": {
    src: "/assets/images/menu/biometric_interface.webp",
    catalogSlug: "pesquisa-cadastral-de-motoristas",
    alt: "Interface biométrica usada no fluxo do Cargo Score"
  },
  "cargo-auth": {
    src: "/assets/images/menu/authenticator.webp",
    catalogSlug: "autenticador-de-seguranca",
    alt: "Interface do Cargo Autenticador"
  }
};

const analysisReferencePaths = {
  "Biometria facial e prova de vida": "/analises/biometria-facial-prova-de-vida",
  "Dados cadastrais": "/analises/dados-cadastrais",
  "Autenticação de identidade": "/analises/autenticacao-de-identidade",
  "Telefone e contexto do acesso": "/analises/telefone-contexto-acesso",
  "CNH e informações da habilitação": "/analises/cnh-informacoes-habilitacao",
  "ANTT e RNTRC": "/analises/antt-rntrc",
  "Processos e contexto judicial": "/analises/processos-contexto-judicial",
  "Políticas e critérios operacionais": "/analises/politicas-criterios-operacionais",
  "Histórico veicular": "/analises/historico-veicular",
  "Multas, débitos e restrições": "/analises/multas-debitos-restricoes",
  "Monitoramento e alertas": "/analises/monitoramento-alertas",
  "Viagem e contexto operacional": "/analises/viagem-contexto-operacional"
};

const initializeAnalysisReferenceLinks = (header) => {
  const analysisMenu = header.querySelector("#menu-analysis");
  if (analysisMenu instanceof HTMLElement) {
    analysisMenu.querySelectorAll(".analysis-menu-link").forEach((link) => {
      if (!(link instanceof HTMLAnchorElement)) {
        return;
      }

      const path = analysisReferencePaths[link.textContent.trim()];
      if (path) {
        link.href = path;
      }
    });

    const footerLink = analysisMenu.querySelector(".mega-menu-footer a");
    if (footerLink instanceof HTMLAnchorElement) {
      footerLink.href = "/analises";
      footerLink.textContent = "Ver todos os tipos de análise ↗";
    }
  }

  const mobileLabels = Array.from(header.querySelectorAll(".mobile-nav-label"));
  const analysisLabel = mobileLabels.find((label) => label.textContent.trim() === "Tipos de análises");
  if (!(analysisLabel instanceof HTMLElement) || !(analysisLabel.parentElement instanceof HTMLElement)) {
    return;
  }

  let sibling = analysisLabel.nextElementSibling;
  while (sibling && !sibling.classList.contains("mobile-nav-label")) {
    const next = sibling.nextElementSibling;
    sibling.remove();
    sibling = next;
  }

  const fragment = document.createDocumentFragment();
  Object.entries(analysisReferencePaths).forEach(([label, path]) => {
    const link = document.createElement("a");
    link.href = path;
    link.textContent = label;
    fragment.append(link);
  });

  const allLink = document.createElement("a");
  allLink.href = "/analises";
  allLink.textContent = "Ver todos os tipos de análise";
  fragment.append(allLink);
  analysisLabel.after(fragment);
};

const initializeToolCatalogVisuals = () => {
  Object.values(toolVisualAssets).forEach((asset) => {
    const visual = document.querySelector(`[data-tool-catalog-visual="${asset.catalogSlug}"]`);
    if (!(visual instanceof HTMLElement)) {
      return;
    }

    const placeholder = visual.querySelector(".tool-catalog-placeholder");
    if (!(placeholder instanceof HTMLElement)) {
      return;
    }

    const image = document.createElement("img");
    image.className = "tool-catalog-asset";
    image.src = asset.src;
    image.alt = asset.alt;
    image.loading = "lazy";
    image.decoding = "async";
    image.style.position = "relative";
    image.style.zIndex = "2";
    image.style.width = "auto";
    image.style.height = "auto";
    image.style.maxWidth = "100%";
    image.style.maxHeight = "360px";
    image.style.objectFit = "contain";
    image.style.opacity = "0";
    image.style.transform = "translateY(8px) scale(.985)";
    image.style.transition = "opacity 260ms ease, transform 260ms ease";

    Array.from(placeholder.children).forEach((child) => {
      if (child instanceof HTMLElement) {
        child.style.display = "none";
      }
    });

    placeholder.append(image);

    requestAnimationFrame(() => {
      image.style.opacity = "1";
      image.style.transform = "translateY(0) scale(1)";
    });
  });
};

const initializeHeaderScrollVisibility = (header, closeMenus) => {
  const mobileMenu = header.querySelector(".mobile-menu");
  let lastScrollY = Math.max(0, window.scrollY);
  let upwardTravel = 0;
  let downwardTravel = 0;
  let ticking = false;

  const revealHeader = () => {
    header.classList.remove("is-hidden");
  };

  const hideHeader = () => {
    if (header.classList.contains("is-hidden")) {
      return;
    }

    closeMenus();

    if (mobileMenu instanceof HTMLDetailsElement && mobileMenu.open) {
      mobileMenu.open = false;
    }

    header.classList.add("is-hidden");
  };

  const updateHeader = () => {
    const currentScrollY = Math.max(0, window.scrollY);
    const delta = currentScrollY - lastScrollY;

    if (currentScrollY <= 18) {
      upwardTravel = 0;
      downwardTravel = 0;
      revealHeader();
    } else if (delta > 0) {
      upwardTravel = 0;
      downwardTravel += delta;

      if (currentScrollY > header.offsetHeight + 24 && downwardTravel >= 10) {
        hideHeader();
      }
    } else if (delta < 0) {
      downwardTravel = 0;
      upwardTravel += Math.abs(delta);

      if (upwardTravel >= 4) {
        revealHeader();
      }
    }

    lastScrollY = currentScrollY;
    ticking = false;
  };

  window.addEventListener("scroll", () => {
    if (ticking) {
      return;
    }

    ticking = true;
    window.requestAnimationFrame(updateHeader);
  }, { passive: true });

  header.addEventListener("focusin", revealHeader);
};

const initializeHeaderMegaMenu = () => {
  const header = document.querySelector(".site-header");

  if (!(header instanceof HTMLElement)) {
    return;
  }

  initializeAnalysisReferenceLinks(header);

  const clusters = Array.from(header.querySelectorAll("[data-mega-cluster]"));
  let closeTimerId = null;

  const clearCloseTimer = () => {
    if (closeTimerId === null) {
      return;
    }

    window.clearTimeout(closeTimerId);
    closeTimerId = null;
  };

  const setClusterOpen = (cluster, open) => {
    cluster.classList.toggle("is-open", open);

    const trigger = cluster.querySelector("[data-mega-trigger]");
    if (trigger instanceof HTMLButtonElement) {
      trigger.setAttribute("aria-expanded", open ? "true" : "false");
    }
  };

  const closeAll = (except = null) => {
    clearCloseTimer();

    clusters.forEach((cluster) => {
      if (cluster !== except) {
        setClusterOpen(cluster, false);
      }
    });
  };

  clusters.forEach((cluster) => {
    const trigger = cluster.querySelector("[data-mega-trigger]");
    const menu = cluster.querySelector(".mega-menu");

    if (!(trigger instanceof HTMLButtonElement)) {
      return;
    }

    const open = () => {
      clearCloseTimer();
      closeAll(cluster);
      setClusterOpen(cluster, true);
    };

    const scheduleClose = () => {
      clearCloseTimer();

      closeTimerId = window.setTimeout(() => {
        const pointerStillInside = cluster.matches(":hover");
        const focusStillInside = cluster.contains(document.activeElement);

        if (pointerStillInside || focusStillInside) {
          closeTimerId = null;
          return;
        }

        setClusterOpen(cluster, false);
        closeTimerId = null;
      }, 280);
    };

    trigger.addEventListener("mouseenter", open);
    cluster.addEventListener("mouseenter", clearCloseTimer);
    cluster.addEventListener("mouseleave", scheduleClose);

    if (menu instanceof HTMLElement) {
      menu.addEventListener("mouseenter", clearCloseTimer);
      menu.addEventListener("mouseleave", scheduleClose);
    }

    trigger.addEventListener("click", () => {
      clearCloseTimer();
      const nextOpenState = !cluster.classList.contains("is-open");
      closeAll(cluster);
      setClusterOpen(cluster, nextOpenState);
    });

    cluster.addEventListener("focusin", open);
    cluster.addEventListener("focusout", () => {
      window.setTimeout(() => {
        if (!cluster.contains(document.activeElement)) {
          setClusterOpen(cluster, false);
        }
      }, 0);
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") {
      return;
    }

    const activeCluster = clusters.find((cluster) => cluster.classList.contains("is-open"));
    closeAll();

    const trigger = activeCluster?.querySelector("[data-mega-trigger]");
    if (trigger instanceof HTMLButtonElement) {
      trigger.focus();
    }
  });

  document.addEventListener("pointerdown", (event) => {
    if (!(event.target instanceof Node) || header.contains(event.target)) {
      return;
    }

    closeAll();
  });

  initializeHeaderScrollVisibility(header, closeAll);

  const toolMenu = header.querySelector("[data-tool-menu]");
  if (!(toolMenu instanceof HTMLElement)) {
    return;
  }

  const options = Array.from(toolMenu.querySelectorAll("[data-tool-option]"));
  const panels = Array.from(toolMenu.querySelectorAll("[data-tool-panel]"));
  const previewDescription = toolMenu.querySelector("[data-tool-preview-description]");

  const selectTool = (option) => {
    const toolId = option.dataset.toolId ?? "cargo-score";
    const toolDescription = option.dataset.toolDescription ?? "";

    options.forEach((item) => item.classList.toggle("is-active", item === option));

    panels.forEach((panel) => {
      if (!(panel instanceof HTMLElement)) {
        return;
      }

      const active = panel.dataset.toolPanel === toolId;
      panel.classList.toggle("is-active", active);
      panel.setAttribute("aria-hidden", active ? "false" : "true");
    });

    if (previewDescription instanceof HTMLElement) {
      previewDescription.textContent = toolDescription;
    }
  };

  options.forEach((option) => {
    option.addEventListener("mouseenter", () => selectTool(option));
    option.addEventListener("focus", () => selectTool(option));
  });

  const initialOption = options.find((option) => option.classList.contains("is-active")) ?? options[0];
  if (initialOption instanceof HTMLElement) {
    selectTool(initialOption);
  }
};

initializeToolCatalogVisuals();
initializeHeaderMegaMenu();

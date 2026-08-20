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

const initializeHeaderMegaMenu = () => {
  const header = document.querySelector(".site-header");

  if (!(header instanceof HTMLElement)) {
    return;
  }

  const clusters = Array.from(header.querySelectorAll("[data-mega-cluster]"));
  let closeTimerId = null;

  const setClusterOpen = (cluster, open) => {
    cluster.classList.toggle("is-open", open);

    const trigger = cluster.querySelector("[data-mega-trigger]");
    if (trigger instanceof HTMLButtonElement) {
      trigger.setAttribute("aria-expanded", open ? "true" : "false");
    }
  };

  const closeAll = (except = null) => {
    clusters.forEach((cluster) => {
      if (cluster !== except) {
        setClusterOpen(cluster, false);
      }
    });
  };

  clusters.forEach((cluster) => {
    const trigger = cluster.querySelector("[data-mega-trigger]");

    if (!(trigger instanceof HTMLButtonElement)) {
      return;
    }

    const open = () => {
      if (closeTimerId !== null) {
        window.clearTimeout(closeTimerId);
        closeTimerId = null;
      }

      closeAll(cluster);
      setClusterOpen(cluster, true);
    };

    const scheduleClose = () => {
      if (closeTimerId !== null) {
        window.clearTimeout(closeTimerId);
      }

      closeTimerId = window.setTimeout(() => {
        setClusterOpen(cluster, false);
        closeTimerId = null;
      }, 130);
    };

    cluster.addEventListener("mouseenter", open);
    cluster.addEventListener("mouseleave", scheduleClose);

    trigger.addEventListener("click", () => {
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

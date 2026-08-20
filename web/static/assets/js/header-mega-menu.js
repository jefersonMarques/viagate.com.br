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
  const previewCanvas = toolMenu.querySelector("[data-tool-preview-canvas]");
  const previewPlaceholder = toolMenu.querySelector("[data-tool-preview-placeholder]");
  const previewCode = toolMenu.querySelector("[data-tool-preview-code]");
  const previewTitle = toolMenu.querySelector("[data-tool-preview-title]");
  const previewDescription = toolMenu.querySelector("[data-tool-preview-description]");
  let previewTimerId = null;

  const selectTool = (option) => {
    const toolId = option.dataset.toolId ?? "tool";
    const toolCode = option.dataset.toolCode ?? "TOOL";
    const toolTitle = option.dataset.toolTitle ?? "FERRAMENTA";
    const toolDescription = option.dataset.toolDescription ?? "";

    options.forEach((item) => item.classList.toggle("is-active", item === option));

    if (previewPlaceholder instanceof HTMLElement) {
      previewPlaceholder.classList.add("is-changing");
    }

    if (previewTimerId !== null) {
      window.clearTimeout(previewTimerId);
    }

    previewTimerId = window.setTimeout(() => {
      if (previewCanvas instanceof HTMLElement) {
        previewCanvas.dataset.tool = toolId;
      }

      if (previewCode instanceof HTMLElement) {
        previewCode.textContent = toolCode;
      }

      if (previewTitle instanceof HTMLElement) {
        previewTitle.textContent = toolTitle;
      }

      if (previewDescription instanceof HTMLElement) {
        previewDescription.textContent = toolDescription;
      }

      if (previewPlaceholder instanceof HTMLElement) {
        previewPlaceholder.classList.remove("is-changing");
      }

      previewTimerId = null;
    }, 120);
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

initializeHeaderMegaMenu();

const toolVisualAssets = {
  "cargo-score": "/assets/images/tools/cargo-score.svg"
};

const createToolPreviewImage = (container, className) => {
  if (!(container instanceof HTMLElement)) {
    return null;
  }

  const existingImage = container.querySelector(`.${className}`);
  if (existingImage instanceof HTMLImageElement) {
    return existingImage;
  }

  const image = document.createElement("img");
  image.className = className;
  image.alt = "";
  image.setAttribute("aria-hidden", "true");
  image.style.position = "absolute";
  image.style.zIndex = "3";
  image.style.inset = "18px";
  image.style.width = "calc(100% - 36px)";
  image.style.height = "calc(100% - 36px)";
  image.style.objectFit = "contain";
  image.style.opacity = "0";
  image.style.transform = "translateY(6px) scale(.985)";
  image.style.transition = "opacity 160ms ease, transform 160ms ease";
  image.style.pointerEvents = "none";
  container.append(image);

  return image;
};

const initializeToolCatalogVisuals = () => {
  const cargoScoreVisual = document.querySelector('[data-tool-catalog-visual="pesquisa-cadastral-de-motoristas"]');
  if (!(cargoScoreVisual instanceof HTMLElement)) {
    return;
  }

  const placeholder = cargoScoreVisual.querySelector(".tool-catalog-placeholder");
  if (!(placeholder instanceof HTMLElement)) {
    return;
  }

  const image = document.createElement("img");
  image.src = toolVisualAssets["cargo-score"];
  image.alt = "Visual industrial do Cargo Score";
  image.loading = "lazy";
  image.decoding = "async";
  image.style.position = "relative";
  image.style.zIndex = "2";
  image.style.width = "100%";
  image.style.height = "360px";
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
  const previewCanvas = toolMenu.querySelector("[data-tool-preview-canvas]");
  const previewPlaceholder = toolMenu.querySelector("[data-tool-preview-placeholder]");
  const previewCode = toolMenu.querySelector("[data-tool-preview-code]");
  const previewTitle = toolMenu.querySelector("[data-tool-preview-title]");
  const previewDescription = toolMenu.querySelector("[data-tool-preview-description]");
  const previewImage = createToolPreviewImage(previewCanvas, "tool-preview-asset");
  let previewTimerId = null;

  const selectTool = (option) => {
    const toolId = option.dataset.toolId ?? "tool";
    const toolCode = option.dataset.toolCode ?? "TOOL";
    const toolTitle = option.dataset.toolTitle ?? "FERRAMENTA";
    const toolDescription = option.dataset.toolDescription ?? "";
    const visualAsset = toolVisualAssets[toolId] ?? "";

    options.forEach((item) => item.classList.toggle("is-active", item === option));

    if (previewPlaceholder instanceof HTMLElement) {
      previewPlaceholder.classList.add("is-changing");
    }

    if (previewImage instanceof HTMLImageElement) {
      previewImage.style.opacity = "0";
      previewImage.style.transform = "translateY(6px) scale(.985)";
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

      if (previewImage instanceof HTMLImageElement && visualAsset !== "") {
        previewImage.src = visualAsset;
        previewImage.style.opacity = "1";
        previewImage.style.transform = "translateY(0) scale(1)";
      }

      if (previewPlaceholder instanceof HTMLElement) {
        previewPlaceholder.classList.remove("is-changing");
        previewPlaceholder.style.opacity = visualAsset === "" ? "1" : "0";
        previewPlaceholder.style.pointerEvents = visualAsset === "" ? "auto" : "none";
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

initializeToolCatalogVisuals();
initializeHeaderMegaMenu();

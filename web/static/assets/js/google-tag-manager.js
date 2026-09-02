(() => {
  const script = document.currentScript;
  const containerID = script?.dataset?.containerId?.trim();

  if (!containerID) {
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    "gtm.start": Date.now(),
    event: "gtm.js",
  });

  const tagManager = document.createElement("script");
  tagManager.async = true;
  tagManager.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(containerID)}`;
  document.head.appendChild(tagManager);
})();

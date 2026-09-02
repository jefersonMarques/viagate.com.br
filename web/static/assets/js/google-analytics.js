(() => {
  const script = document.currentScript;
  const measurementID = script?.dataset?.measurementId?.trim();

  if (!measurementID) {
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () {
    window.dataLayer.push(arguments);
  };

  window.gtag("js", new Date());
  window.gtag("config", measurementID);
})();

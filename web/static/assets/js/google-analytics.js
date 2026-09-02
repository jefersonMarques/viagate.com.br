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

  const googleTag = document.createElement("script");
  googleTag.async = true;
  googleTag.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementID)}`;
  document.head.appendChild(googleTag);

  window.gtag("js", new Date());
  window.gtag("config", measurementID);
})();

const initializeRiskEngineProfile = () => {
  const engine = document.querySelector("[data-risk-engine]");

  if (!(engine instanceof HTMLElement)) {
    return;
  }

  const heading = engine.querySelector(".timeline-heading");

  if (!(heading instanceof HTMLElement)) {
    return;
  }

  const profile = document.createElement("div");
  profile.className = "driver-profile";

  const photo = document.createElement("div");
  photo.className = "driver-profile-photo";

  const image = document.createElement("img");
  image.src = "/assets/images/biometric-silhouette-transparent.svg";
  image.alt = "Silhueta biométrica do motorista";
  image.width = 60;
  image.height = 60;
  image.decoding = "async";
  photo.append(image);

  const copy = document.createElement("div");
  copy.className = "driver-profile-copy";

  const name = document.createElement("div");
  name.className = "driver-profile-name";

  const nameText = document.createElement("strong");
  nameText.textContent = "João da Silva";

  const age = document.createElement("span");
  age.textContent = "39 anos";

  name.append(nameText, age);

  const cpf = document.createElement("span");
  cpf.className = "driver-profile-cpf";
  cpf.textContent = "CPF: 123.456.789-10";

  copy.append(name, cpf);

  const status = document.createElement("div");
  status.className = "driver-profile-status";

  const statusDot = document.createElement("i");
  statusDot.setAttribute("aria-hidden", "true");

  const statusText = document.createElement("span");
  statusText.textContent = "Em análise";

  status.append(statusDot, statusText);
  profile.append(photo, copy, status);
  heading.replaceChildren(profile);

  const syncState = () => {
    profile.classList.remove("is-success", "is-warning", "is-danger");

    if (engine.classList.contains("is-rejected")) {
      profile.classList.add("is-danger");
      statusText.textContent = "Reprovado";
      return;
    }

    if (engine.classList.contains("is-danger")) {
      profile.classList.add("is-danger");
      statusText.textContent = "Alerta de fraude";
      return;
    }

    if (engine.classList.contains("is-warning")) {
      profile.classList.add("is-warning");
      statusText.textContent = "Análise humana";
      return;
    }

    if (
      engine.classList.contains("is-approved") ||
      engine.classList.contains("is-manual-approved") ||
      engine.classList.contains("is-released")
    ) {
      profile.classList.add("is-success");
      statusText.textContent = "Aprovado";
      return;
    }

    statusText.textContent = "Em análise";
  };

  const observer = new MutationObserver(syncState);
  observer.observe(engine, {
    attributes: true,
    attributeFilter: ["class"]
  });

  syncState();
};

initializeRiskEngineProfile();

const initializeRiskEngineProfile = () => {
  const engine = document.querySelector("[data-risk-engine]");

  if (!(engine instanceof HTMLElement)) {
    return;
  }

  const heading = engine.querySelector(".timeline-heading");

  if (!(heading instanceof HTMLElement)) {
    return;
  }

  const identities = [
    { name: "João da Silva", age: 39, cpf: "123.456.789-10" },
    { name: "Carlos Eduardo", age: 42, cpf: "214.587.963-01" },
    { name: "Marcos Vinicius", age: 36, cpf: "315.902.478-22" },
    { name: "Rafael Mendes", age: 44, cpf: "426.173.850-33" },
    { name: "Paulo Henrique", age: 31, cpf: "537.264.981-44" },
    { name: "André Luiz", age: 47, cpf: "648.395.172-55" },
    { name: "Felipe Rocha", age: 34, cpf: "759.486.203-66" },
    { name: "Tiago Martins", age: 40, cpf: "860.517.394-77" },
    { name: "Bruno Almeida", age: 38, cpf: "971.628.405-88" },
    { name: "Leandro Costa", age: 45, cpf: "082.739.516-99" }
  ];

  const profile = document.createElement("div");
  profile.className = "driver-profile";

  const photo = document.createElement("div");
  photo.className = "driver-profile-photo";

  const silhouette = document.createElement("span");
  silhouette.className = "driver-profile-silhouette";
  silhouette.setAttribute("role", "img");
  silhouette.setAttribute("aria-label", "Silhueta biométrica do motorista");
  photo.append(silhouette);

  const copy = document.createElement("div");
  copy.className = "driver-profile-copy";

  const name = document.createElement("div");
  name.className = "driver-profile-name";

  const nameText = document.createElement("strong");
  const age = document.createElement("span");
  name.append(nameText, age);

  const cpf = document.createElement("span");
  cpf.className = "driver-profile-cpf";
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

  let currentIdentityIndex = 0;
  let lastScenarioKey = null;

  const renderIdentity = () => {
    const identity = identities[currentIdentityIndex % identities.length];

    nameText.textContent = identity.name;
    age.textContent = `${identity.age} anos`;
    cpf.textContent = `CPF: ${identity.cpf}`;
  };

  const getScenarioKey = () => {
    if (engine.classList.contains("scenario-fraud")) {
      return "fraud";
    }

    if (engine.classList.contains("scenario-review")) {
      return "review";
    }

    if (engine.classList.contains("scenario-approval")) {
      return "approval";
    }

    return null;
  };

  const syncIdentity = () => {
    const scenarioKey = getScenarioKey();

    if (scenarioKey === null) {
      return;
    }

    if (lastScenarioKey === null) {
      lastScenarioKey = scenarioKey;
      renderIdentity();
      return;
    }

    if (scenarioKey === lastScenarioKey) {
      return;
    }

    lastScenarioKey = scenarioKey;
    currentIdentityIndex = (currentIdentityIndex + 1) % identities.length;
    renderIdentity();
  };

  const syncState = () => {
    syncIdentity();
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

  renderIdentity();
  syncState();
};

initializeRiskEngineProfile();

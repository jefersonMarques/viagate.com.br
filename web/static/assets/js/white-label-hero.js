const initializeWhiteLabelHero = () => {
  if (window.location.pathname !== "/white-label") {
    return;
  }

  const panel = document.querySelector(".solution-command-grid .solution-signal-panel");

  if (!(panel instanceof HTMLElement)) {
    return;
  }

  panel.className = "solution-signal-panel white-label-panel";
  panel.setAttribute("aria-label", "Representação conceitual de uma mesma plataforma operando com diferentes identidades visuais white label");
  panel.innerHTML = `
    <div class="signal-panel-grid" aria-hidden="true"></div>
    <div class="wl-panel-topbar">
      <span><i aria-hidden="true"></i> WHITE LABEL / LIVE PREVIEW</span>
      <small data-wl-status>BRAND PROFILE / CARGO</small>
    </div>

    <div class="wl-app-frame" data-wl-app>
      <header class="wl-app-menu">
        <div class="wl-brand" data-wl-brand>CARGO</div>
        <nav aria-label="Menu demonstrativo">
          <span class="is-active">Transporte</span>
          <span>Score</span>
          <span>Prevenção</span>
        </nav>
        <div class="wl-user">
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3"></circle><path d="M5 20c.7-4 3-6 7-6s6.3 2 7 6"></path></svg>
          <span>Usuário</span>
        </div>
      </header>

      <main class="wl-app-content">
        <div class="wl-list-head">
          <div><small>OPERAÇÃO / MOTORISTAS</small><strong>Análises recentes</strong></div>
          <span><i></i> SISTEMA ATIVO</span>
        </div>

        <div class="wl-people-list">
          <article>
            <span class="wl-person-index">01</span>
            <div><strong>Marcos Oliveira</strong><small>CPF •••.482.•••-09</small></div>
            <span class="wl-person-context">TRANSPORTE</span>
            <b class="is-approved"><i></i> APROVADO</b>
          </article>
          <article>
            <span class="wl-person-index">02</span>
            <div><strong>Rafael Martins</strong><small>CPF •••.731.•••-42</small></div>
            <span class="wl-person-context">SCORE</span>
            <b class="is-warning"><i></i> ATENÇÃO</b>
          </article>
          <article>
            <span class="wl-person-index">03</span>
            <div><strong>Daniel Ferreira</strong><small>CPF •••.196.•••-51</small></div>
            <span class="wl-person-context">TRANSPORTE</span>
            <b class="is-approved"><i></i> APROVADO</b>
          </article>
          <article>
            <span class="wl-person-index">04</span>
            <div><strong>Lucas Almeida</strong><small>CPF •••.845.•••-27</small></div>
            <span class="wl-person-context">PREVENÇÃO</span>
            <b class="is-warning"><i></i> ATENÇÃO</b>
          </article>
        </div>
      </main>

      <footer class="wl-brand-controls">
        <div class="wl-brand-controls-copy">
          <small>IDENTIDADE / PERFIL</small>
          <strong data-wl-profile-label>CARGO / ORIGINAL</strong>
        </div>
        <div class="wl-brand-options" aria-label="Perfis de marca demonstrativos">
          <button class="is-active" type="button" data-wl-theme="0"><i></i><span>CARGO</span></button>
          <button type="button" data-wl-theme="1"><i></i><span>NEXA</span></button>
          <button type="button" data-wl-theme="2"><i></i><span>ROTA</span></button>
          <button type="button" data-wl-theme="3"><i></i><span>VECTRA</span></button>
          <span class="wl-click-pulse" data-wl-pulse aria-hidden="true"></span>
        </div>
      </footer>
    </div>

    <div class="wl-panel-footer">
      <span>MESMA BASE TECNOLÓGICA</span>
      <strong data-wl-footer>MARCA • COR • EXPERIÊNCIA</strong>
    </div>
  `;

  const app = panel.querySelector("[data-wl-app]");
  const brand = panel.querySelector("[data-wl-brand]");
  const status = panel.querySelector("[data-wl-status]");
  const profileLabel = panel.querySelector("[data-wl-profile-label]");
  const footer = panel.querySelector("[data-wl-footer]");
  const pulse = panel.querySelector("[data-wl-pulse]");
  const buttons = Array.from(panel.querySelectorAll("[data-wl-theme]"));
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!(app instanceof HTMLElement) || !(pulse instanceof HTMLElement) || buttons.length === 0) {
    return;
  }

  const themes = [
    { name: "CARGO", label: "CARGO / ORIGINAL", color: "#ff6400", rgb: "255, 100, 0" },
    { name: "NEXA", label: "NEXA / BLUE", color: "#418cff", rgb: "65, 140, 255" },
    { name: "ROTA", label: "ROTA / GREEN", color: "#39c98a", rgb: "57, 201, 138" },
    { name: "VECTRA", label: "VECTRA / MAGENTA", color: "#d75cff", rgb: "215, 92, 255" }
  ];

  let currentIndex = 0;
  let cycleToken = 0;
  let isVisible = true;

  const setText = (element, value) => {
    if (element instanceof HTMLElement) {
      element.textContent = value;
    }
  };

  const wait = (delay, token) => new Promise((resolve) => {
    window.setTimeout(() => resolve(token === cycleToken && isVisible), delay);
  });

  const positionPulse = (button) => {
    if (!(button instanceof HTMLElement)) {
      return;
    }

    const options = button.parentElement;
    if (!(options instanceof HTMLElement)) {
      return;
    }

    const buttonRect = button.getBoundingClientRect();
    const optionsRect = options.getBoundingClientRect();
    pulse.style.left = `${buttonRect.left - optionsRect.left + (buttonRect.width / 2)}px`;
    pulse.style.top = `${buttonRect.top - optionsRect.top + (buttonRect.height / 2)}px`;
  };

  const applyTheme = (index) => {
    const theme = themes[index];
    const activeButton = buttons[index];

    currentIndex = index;
    app.style.setProperty("--wl-accent", theme.color);
    app.style.setProperty("--wl-accent-rgb", theme.rgb);
    setText(brand, theme.name);
    setText(status, `BRAND PROFILE / ${theme.name}`);
    setText(profileLabel, theme.label);
    setText(footer, `${theme.name} • COR • EXPERIÊNCIA`);

    buttons.forEach((button, buttonIndex) => {
      button.classList.toggle("is-active", buttonIndex === index);
    });

    if (activeButton instanceof HTMLElement) {
      positionPulse(activeButton);
    }
  };

  const clickTheme = async (index, token) => {
    const button = buttons[index];
    if (!(button instanceof HTMLElement)) {
      return false;
    }

    positionPulse(button);
    pulse.classList.remove("is-clicking");
    void pulse.offsetWidth;
    pulse.classList.add("is-clicking");

    if (!(await wait(prefersReducedMotion ? 0 : 430, token))) {
      return false;
    }

    app.classList.add("is-switching");
    applyTheme(index);

    if (!(await wait(prefersReducedMotion ? 0 : 260, token))) {
      return false;
    }

    app.classList.remove("is-switching");
    return true;
  };

  const runCycle = async (token) => {
    if (!(await wait(1700, token))) return;

    while (token === cycleToken && isVisible) {
      const nextIndex = (currentIndex + 1) % themes.length;
      if (!(await clickTheme(nextIndex, token))) return;
      if (!(await wait(2200, token))) return;
    }
  };

  buttons.forEach((button, index) => {
    button.addEventListener("click", () => {
      cycleToken += 1;
      isVisible = true;
      void clickTheme(index, cycleToken).then(() => {
        if (!prefersReducedMotion && isVisible) {
          void runCycle(cycleToken);
        }
      });
    });
  });

  applyTheme(0);

  if (prefersReducedMotion) {
    pulse.classList.add("is-static");
    return;
  }

  const start = () => {
    isVisible = true;
    cycleToken += 1;
    void runCycle(cycleToken);
  };

  const stop = () => {
    isVisible = false;
    cycleToken += 1;
  };

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          start();
        } else {
          stop();
        }
      });
    }, { threshold: 0.2 });

    observer.observe(panel);
    window.addEventListener("pagehide", () => observer.disconnect(), { once: true });
  } else {
    start();
  }

  window.addEventListener("resize", () => {
    const activeButton = buttons[currentIndex];
    if (activeButton instanceof HTMLElement) {
      positionPulse(activeButton);
    }
  }, { passive: true });

  window.addEventListener("pagehide", stop, { once: true });
};

initializeWhiteLabelHero();
import { apiRequest } from "./api.js";

const form = document.querySelector("#volleyRegistrationForm");
const message = document.querySelector("#volleyFormMessage");
const teamsContainer = document.querySelector("#volleyTeams");
const playerGrid = document.querySelector("#volleyPlayerGrid");
const addPlayerButton = document.querySelector("#addVolleyPlayer");
const colorGrid = document.querySelector("#volleyColorGrid");
const extraColorGrid = document.querySelector("#volleyExtraColorGrid");
const colorSummary = document.querySelector("#volleyColorSummary");
const ruleNotice = document.querySelector("#volleyRuleNotice");
const minimumPlayers = 5;
const ruleNoticeStorageKey = "betel-volley-five-player-rule-notice-20260607";
const teamNameCache = new Set();
const defaultLanguage = "ro";
const supportedLanguages = new Set(["ro", "es"]);
const i18nAssetVersion = "i18n-20260608-contact-note";
const translations = {};
let shirtColors = [];
let approvedTeams = [];
let selectedShirtColor = "";
let lang = supportedLanguages.has(localStorage.getItem("betel-lang")) ? localStorage.getItem("betel-lang") : defaultLanguage;

function tx(key) {
  return translations[lang]?.[key] || translations[defaultLanguage]?.[key] || key;
}

async function loadLanguageFile(language) {
  if (translations[language]) return translations[language];
  try {
    const response = await fetch(`/i18n/${language}.json?v=${i18nAssetVersion}`);
    if (!response.ok) throw new Error(`Could not load ${language} translations`);
    translations[language] = await response.json();
  } catch {
    translations[language] = {};
  }
  return translations[language];
}

async function loadTranslations(language = lang) {
  await loadLanguageFile(defaultLanguage);
  if (language !== defaultLanguage) await loadLanguageFile(language);
}

function formatTx(key, replacements = {}) {
  return Object.entries(replacements).reduce((text, [token, value]) => text.replaceAll(`{${token}}`, value), tx(key));
}

function escapeHtml(value = "") {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function colorName(color) {
  if (!color) return "";
  return color[lang] || color.es || color.ro || color.id;
}

function colorById(colorId) {
  return shirtColors.find((color) => color.id === colorId);
}

function colorSwatch(colorId) {
  const color = colorById(colorId);
  if (!color) return "";
  const label = colorName(color);
  return `<span class="volley-team-color" style="--shirt-color: ${escapeHtml(color.hex)}" aria-label="${escapeHtml(label)}" title="${escapeHtml(label)}"></span>`;
}

function setMessage(text, state = "") {
  if (!message) return;
  message.textContent = text;
  if (state) message.removeAttribute("data-i18n");
  message.className = `volley-form-note${state ? ` is-${state}` : ""}`;
}

let revealObserver = null;
const revealSelectors = [
  ".volley-section > div",
  ".volley-facts article",
  ".volley-rule-list article",
  ".volley-regulation-grid article",
  ".volley-form",
  ".volley-teams article"
];

function prepareRevealElements(root = document) {
  if (!revealObserver) return;
  root.querySelectorAll(revealSelectors.join(",")).forEach((element, index) => {
    if (element.classList.contains("reveal-on-scroll")) return;
    element.classList.add("reveal-on-scroll");
    element.style.setProperty("--reveal-delay", `${Math.min(index % 6, 5) * 45}ms`);
    revealObserver.observe(element);
  });
}

function revealVisibleElements(root = document) {
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  root.querySelectorAll(".reveal-on-scroll:not(.is-visible)").forEach((element) => {
    const rect = element.getBoundingClientRect();
    if (rect.top < viewportHeight * 0.92 && rect.bottom > 0) {
      element.classList.add("is-visible");
      revealObserver?.unobserve(element);
    }
  });
}

function revealCurrentAnchorElements() {
  if (!window.location.hash) {
    revealVisibleElements();
    return;
  }

  let targetId = window.location.hash.slice(1);
  try {
    targetId = decodeURIComponent(targetId);
  } catch {
    targetId = window.location.hash.slice(1);
  }

  const target = document.getElementById(targetId);
  if (!target) {
    revealVisibleElements();
    return;
  }

  if (target.getBoundingClientRect().bottom > 0) {
    target.querySelectorAll(".reveal-on-scroll").forEach((element) => {
      element.classList.add("is-visible");
      revealObserver?.unobserve(element);
    });
    return;
  }

  revealVisibleElements();
}

function scheduleAnchorReveal() {
  revealCurrentAnchorElements();
  requestAnimationFrame(revealCurrentAnchorElements);
  window.setTimeout(revealCurrentAnchorElements, 120);
  window.setTimeout(revealCurrentAnchorElements, 420);
}

function setupAnchorReveal() {
  scheduleAnchorReveal();
  window.addEventListener("hashchange", () => {
    requestAnimationFrame(scheduleAnchorReveal);
  });
}

function setupVolleyEffects() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.querySelectorAll(".volley-hero-copy > *, .volley-poster").forEach((element) => {
      element.style.animation = "none";
    });
    document.querySelectorAll(revealSelectors.join(",")).forEach((element) => {
      element.classList.add("reveal-on-scroll", "is-visible");
    });
    return;
  }

  if (!("IntersectionObserver" in window)) {
    document.querySelectorAll(revealSelectors.join(",")).forEach((element) => {
      element.classList.add("reveal-on-scroll", "is-visible");
    });
    return;
  }

  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -12% 0px", threshold: 0.15 });

  prepareRevealElements();
  setupAnchorReveal();
}

function applyLanguage() {
  document.documentElement.lang = lang;
  document.title = tx("volleyPageTitle");
  const metaDescription = document.querySelector("meta[name='description']");
  if (metaDescription) metaDescription.content = tx("volleyPageDescription");
  const toggle = document.querySelector("#langToggle");
  if (toggle) toggle.textContent = lang === "ro" ? "ES" : "RO";
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const key = node.dataset.i18n;
    const value = tx(key);
    if (value !== key) node.textContent = value;
  });
  document.querySelectorAll("[data-i18n-alt]").forEach((node) => {
    const key = node.dataset.i18nAlt;
    const value = tx(key);
    if (value !== key) node.alt = value;
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
    const key = node.dataset.i18nPlaceholder;
    const value = tx(key);
    if (value !== key) node.placeholder = value;
  });
  renderColorPicker();
  renumberPlayers();
  loadApprovedTeams();
}

function selectedColor() {
  return shirtColors.find((color) => color.id === selectedShirtColor);
}

function setSelectedColor(colorId) {
  const color = shirtColors.find((item) => item.id === colorId);
  selectedShirtColor = color && !color.full ? color.id : "";
  renderColorPicker();
}

function renderColorSummary() {
  if (!colorSummary) return;
  const color = selectedColor();
  if (!color) {
    colorSummary.textContent = tx("volleyNoColorSelected");
    return;
  }
  colorSummary.textContent = formatTx("volleyColorSelected", {
    color: colorName(color),
    remaining: color.remaining
  });
}

function renderColorPicker() {
  if (!colorGrid || !extraColorGrid || !shirtColors.length) return;
  const featuredColors = shirtColors.slice(0, 8);
  const extraColors = shirtColors.slice(8);
  const colorButton = (color, isCompact = false) => {
    const selected = color.id === selectedShirtColor;
    const label = colorName(color);
    return `
      <button class="volley-color-option${isCompact ? " is-compact" : ""}${selected ? " is-selected" : ""}${color.full ? " is-full" : ""}" type="button" data-color="${escapeHtml(color.id)}" aria-label="${escapeHtml(label)}" title="${escapeHtml(label)}" ${color.full ? "disabled" : ""}>
        <span class="volley-color-swatch" style="--shirt-color: ${escapeHtml(color.hex)}"></span>
        ${isCompact ? "" : `<strong>${escapeHtml(label)}</strong>
        <small>${color.full ? tx("volleyColorComplete") : formatTx("volleyColorAvailability", { remaining: color.remaining, capacity: color.capacity })}</small>`}
      </button>
    `;
  };
  colorGrid.innerHTML = featuredColors.map((color) => colorButton(color)).join("");
  extraColorGrid.innerHTML = extraColors.map((color) => colorButton(color, true)).join("");
  renderColorSummary();
}

function setupExtraColorScroller() {
  if (!extraColorGrid) return;
  let isDragging = false;
  let didDrag = false;
  let suppressClick = false;
  let startX = 0;
  let startScrollLeft = 0;

  const canScroll = () => extraColorGrid.scrollWidth > extraColorGrid.clientWidth + 2;

  extraColorGrid.addEventListener("wheel", (event) => {
    if (!canScroll()) return;
    const horizontalDelta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
    if (!horizontalDelta) return;
    event.preventDefault();
    extraColorGrid.scrollLeft += horizontalDelta;
  }, { passive: false });

  extraColorGrid.addEventListener("pointerdown", (event) => {
    if (event.button !== 0 || !canScroll()) return;
    isDragging = true;
    didDrag = false;
    startX = event.clientX;
    startScrollLeft = extraColorGrid.scrollLeft;
    extraColorGrid.classList.add("is-dragging");
    extraColorGrid.setPointerCapture?.(event.pointerId);
  });

  extraColorGrid.addEventListener("pointermove", (event) => {
    if (!isDragging) return;
    const delta = event.clientX - startX;
    if (Math.abs(delta) > 3) didDrag = true;
    extraColorGrid.scrollLeft = startScrollLeft - delta;
    event.preventDefault();
  });

  const stopDragging = (event) => {
    if (!isDragging) return;
    isDragging = false;
    extraColorGrid.classList.remove("is-dragging");
    extraColorGrid.releasePointerCapture?.(event.pointerId);
    if (didDrag) {
      suppressClick = true;
      window.setTimeout(() => {
        suppressClick = false;
      }, 0);
    }
  };

  extraColorGrid.addEventListener("pointerup", stopDragging);
  extraColorGrid.addEventListener("pointercancel", stopDragging);
  extraColorGrid.addEventListener("click", (event) => {
    if (!suppressClick) return;
    event.preventDefault();
    event.stopPropagation();
  }, true);
}

function setupVolleyHeaderScroll() {
  const header = document.querySelector(".volley-header");
  if (!header) return;
  const desktopQuery = window.matchMedia("(min-width: 901px)");
  let lastY = window.scrollY;
  let ticking = false;

  const update = () => {
    const currentY = Math.max(0, window.scrollY);
    if (!desktopQuery.matches || currentY < 96) {
      header.classList.remove("is-hidden-on-scroll");
    } else if (currentY > lastY + 8) {
      header.classList.add("is-hidden-on-scroll");
    } else if (currentY < lastY - 8) {
      header.classList.remove("is-hidden-on-scroll");
    }
    lastY = currentY;
    ticking = false;
  };

  window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  }, { passive: true });

  desktopQuery.addEventListener?.("change", () => {
    header.classList.remove("is-hidden-on-scroll");
    lastY = window.scrollY;
  });
}

function dismissRuleNotice() {
  if (!ruleNotice) return;
  ruleNotice.hidden = true;
  ruleNotice.setAttribute("aria-hidden", "true");
  try {
    localStorage.setItem(ruleNoticeStorageKey, "dismissed");
  } catch {
    // Storage can be unavailable in restricted browser modes.
  }
}

function setupRuleNotice() {
  try {
    if (!ruleNotice || localStorage.getItem(ruleNoticeStorageKey) === "dismissed") return;
  } catch {
    if (!ruleNotice) return;
  }
  ruleNotice.hidden = false;
  ruleNotice.setAttribute("aria-hidden", "false");
  ruleNotice.querySelectorAll("[data-volley-rule-notice-close]").forEach((button) => {
    button.addEventListener("click", dismissRuleNotice);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !ruleNotice.hidden) dismissRuleNotice();
  });
}

async function loadColorAvailability() {
  if (!colorGrid || !extraColorGrid) return;
  try {
    const data = await apiRequest("/api/volley/colors");
    shirtColors = data.colors || [];
    if (selectedShirtColor && selectedColor()?.full) selectedShirtColor = "";
    renderColorPicker();
    renderTeams(approvedTeams);
  } catch {
    shirtColors = [];
  }
}

function playerValues() {
  if (!playerGrid) return [];
  return [...new Set([...playerGrid.querySelectorAll("input[name='players[]']")]
    .map((input) => input.value.trim())
    .filter(Boolean))];
}

function normalizeComparable(value = "") {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function createPlayerCard(index, value = "") {
  const label = document.createElement("label");
  label.className = "volley-player-card";
  const canRemove = index >= minimumPlayers;
  label.innerHTML = `
    <span>${tx("volleyPlayer")} ${index + 1}</span>
    ${canRemove ? `<button class="volley-remove-player" type="button" aria-label="${tx("volleyRemovePlayer")}">×</button>` : ""}
    <input name="players[]" placeholder="${tx("volleyFullNamePlaceholder")}" value="${escapeHtml(value)}" />
  `;
  return label;
}

function renumberPlayers() {
  if (!playerGrid) return;
  [...playerGrid.querySelectorAll(".volley-player-card")].forEach((card, index) => {
    card.querySelector("span").textContent = `${tx("volleyPlayer")} ${index + 1}`;
    card.querySelector("input").placeholder = tx("volleyFullNamePlaceholder");
    card.querySelector(".volley-remove-player")?.remove();
    if (index >= minimumPlayers) {
      card.insertAdjacentHTML("beforeend", `<button class="volley-remove-player" type="button" aria-label="${tx("volleyRemovePlayer")}">×</button>`);
    }
  });
}

function addPlayer(value = "") {
  if (!playerGrid) return;
  playerGrid.append(createPlayerCard(playerGrid.children.length, value));
}

function resetPlayerGrid() {
  if (!playerGrid) return;
  playerGrid.innerHTML = "";
  for (let index = 0; index < minimumPlayers; index += 1) {
    addPlayer();
  }
  renumberPlayers();
}

function renderTeams(teams) {
  if (!teamsContainer) return;
  teamNameCache.clear();
  approvedTeams = teams;
  teams.forEach((team) => teamNameCache.add(normalizeComparable(team.teamName)));
  teamsContainer.innerHTML = teams.map((team) => `
    <article class="volley-team-card">
      <div class="volley-team-meta">
        <span>${team.players.length} ${tx("volleyConfirmedCount")}</span>
        ${team.shirtColor ? colorSwatch(team.shirtColor) : ""}
      </div>
      <h3>${escapeHtml(team.teamName)}</h3>
      <div class="volley-team-info">
        ${team.churchName ? `<span>${tx("volleyChurch")}: ${escapeHtml(team.churchName)}</span>` : ""}
        <span>${tx("volleyRepresentative")}: ${escapeHtml(team.representativeName)}</span>
      </div>
      <details class="volley-team-players">
        <summary>${tx("volleyPlayersLabel")}</summary>
        <small>${team.players.map(escapeHtml).join(", ")}</small>
      </details>
    </article>
  `).join("") || `<p>${tx("volleyNoTeams")}</p>`;
  prepareRevealElements(teamsContainer);
  revealVisibleElements(teamsContainer);
}

async function loadApprovedTeams() {
  if (!teamsContainer) return;
  try {
    const data = await apiRequest("/api/volley/teams");
    renderTeams(data.teams || []);
  } catch {
    teamsContainer.innerHTML = `<p>${tx("volleyTeamsLoadError")}</p>`;
  }
}

form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const submitButton = form.querySelector("button[type='submit']");
  const data = new FormData(form);
  const players = playerValues();
  const payload = {
    representativeName: data.get("representative").trim(),
    teamName: data.get("team").trim(),
    churchName: data.get("church").trim(),
    shirtColor: selectedShirtColor,
    players,
    notes: data.get("notes").trim(),
    website: data.get("website")?.trim() || "",
    gdprConsent: data.get("gdprConsent") === "on"
  };

  if (payload.website) {
    setMessage(tx("volleyGenericError"), "error");
    return;
  }

  if (!payload.representativeName) {
    setMessage(tx("volleyRepresentativeMissing"), "error");
    return;
  }

  if (!payload.teamName) {
    setMessage(tx("volleyTeamMissing"), "error");
    return;
  }

  if (!payload.churchName) {
    setMessage(tx("volleyChurchMissing"), "error");
    return;
  }

  if (teamNameCache.has(normalizeComparable(payload.teamName))) {
    setMessage(tx("volleyAcceptedDuplicate"), "error");
    return;
  }

  const chosenColor = selectedColor();
  if (!chosenColor) {
    setMessage(tx("volleyColorMissing"), "error");
    return;
  }

  if (chosenColor.full) {
    setMessage(tx("volleyColorUnavailable"), "error");
    return;
  }

  if (players.length < minimumPlayers) {
    setMessage(tx("volleyPlayersMissing"), "error");
    return;
  }

  if (!payload.gdprConsent) {
    setMessage(tx("volleyGdprMissing"), "error");
    return;
  }

  submitButton.disabled = true;
  setMessage(tx("volleySubmitting"), "loading");
  try {
    await apiRequest("/api/volley/registrations", { method: "POST", body: payload });
    form.reset();
    selectedShirtColor = "";
    resetPlayerGrid();
    setMessage(tx("volleySuccess"), "success");
    await loadColorAvailability();
    await loadApprovedTeams();
  } catch (error) {
    if (error.status === 409) {
      setMessage(error.message?.toLowerCase().includes("color") ? tx("volleyColorUnavailable") : tx("volleyDuplicate"), "error");
    } else if (error.status === 429) {
      setMessage(tx("volleyRateLimited"), "error");
    } else {
      setMessage(tx("volleySubmitError"), "error");
    }
  } finally {
    submitButton.disabled = false;
  }
});

colorGrid?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-color]");
  if (!button || button.disabled) return;
  setSelectedColor(button.dataset.color);
});

extraColorGrid?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-color]");
  if (!button || button.disabled) return;
  setSelectedColor(button.dataset.color);
});

addPlayerButton?.addEventListener("click", () => {
  addPlayer();
  renumberPlayers();
  const inputs = playerGrid?.querySelectorAll("input[name='players[]']");
  inputs?.[inputs.length - 1]?.focus();
});

playerGrid?.addEventListener("click", (event) => {
  const removeButton = event.target.closest(".volley-remove-player");
  if (!removeButton) return;
  removeButton.closest(".volley-player-card")?.remove();
  renumberPlayers();
});

async function initializeVolleyPage() {
  await loadTranslations(lang);

  resetPlayerGrid();
  setupVolleyEffects();
  applyLanguage();
  setupExtraColorScroller();
  setupVolleyHeaderScroll();
  setupRuleNotice();
  loadColorAvailability();

  document.querySelector("#langToggle")?.addEventListener("click", async () => {
    lang = lang === "ro" ? "es" : "ro";
    localStorage.setItem("betel-lang", lang);
    await loadTranslations(lang);
    applyLanguage();
  });
}

initializeVolleyPage();

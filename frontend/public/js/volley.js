import { apiRequest } from "./api.js";

const form = document.querySelector("#volleyRegistrationForm");
const message = document.querySelector("#volleyFormMessage");
const teamsContainer = document.querySelector("#volleyTeams");
const playerGrid = document.querySelector("#volleyPlayerGrid");
const addPlayerButton = document.querySelector("#addVolleyPlayer");
const colorGrid = document.querySelector("#volleyColorGrid");
const extraColorGrid = document.querySelector("#volleyExtraColorGrid");
const colorSummary = document.querySelector("#volleyColorSummary");
const minimumPlayers = 6;
const teamNameCache = new Set();
let shirtColors = [];
let approvedTeams = [];
let selectedShirtColor = "";
let lang = localStorage.getItem("betel-lang") || "ro";

const translations = {
  ro: {
    volleyPageTitle: "Turneu de volley Reus | Betel Reus",
    volleyPageDescription: "Informații și înscriere pentru a 4-a ediție a turneului de volley organizat de tinerii Betel Reus pe 13 iunie 2026.",
    volleyHeroMeta: "A 4-a ediție · Reus · 13 Iunie 2026 · 10:00",
    volleyHeroTitleLine1: "Turneu",
    volleyHeroTitleLine2: "Volley",
    volleyHeroText: "A patra ediție a turneului adună echipe, prieteni și tineri în Reus în jurul sportului, respectului și unui ambient sănătos.",
    volleyPosterAlt: "Jucători de volley sărind în fața unei mingi",
    volleyNavHome: "Acasă",
    volleyNavRules: "Reguli",
    volleyNavRegistration: "Înscrieri",
    volleyRegisterCta: "Înscrie echipa",
    volleyInfoCta: "Vezi informațiile",
    volleyInfoEyebrow: "Informații principale",
    volleyInfoTitle: "Turneu de volley în Reus",
    volleyInfoText: "Turneul va avea loc sâmbătă, 13 iunie 2026, la ora 10:00. Este a 4-a ediție și prima pregătită în acest format online, cu înscriere și echipe confirmate pe pagină.",
    volleyDateLabel: "Data",
    volleyDateValue: "13 Iunie 2026",
    volleyTimeLabel: "Ora",
    volleyContactLabel: "Contact",
    volleyLocationLabel: "Locație",
    volleyLocationValue: "Reus · locația exactă va fi confirmată",
    volleyEditionLabel: "Ediție",
    volleyEditionValue: "A 4-a ediție",
    volleyRulesEyebrow: "Participare",
    volleyRulesTitle: "Condițiile turneului",
    volleyTeamsRuleTitle: "Echipe",
    volleyTeamsRuleText: "Echipele sunt mixte. Pe teren joacă 5 persoane, cu cel puțin o fată și un băiat în orice moment. Pot exista rezerve înscrise în echipă.",
    volleySpiritRuleTitle: "Ambient",
    volleySpiritRuleText: "Cerem respect, punctualitate și spirit sportiv. Comportamentul nepotrivit poate fi sancționat de organizare sau arbitru.",
    volleyRegistrationRuleTitle: "Înscriere",
    volleyRegistrationRuleText: "Înscrierea rămâne în așteptare până când administratorul o verifică și o acceptă. Echipele acceptate vor apărea pe această pagină.",
    volleyRegulationEyebrow: "Regulament",
    volleyRegulationTitle: "Reguli pe scurt",
    volleyRegulationText: "Regulamentul este bazat pe normele folosite în ediția precedentă. Organizarea poate ajusta detalii punctuale în funcție de numărul echipelor și de condițiile zilei.",
    volleyFormatTitle: "Format",
    volleyFormatText: "Faza grupelor se joacă în sistem toți contra toți. Primele două echipe din fiecare grupă avansează în faza eliminatorie.",
    volleyClassificationTitle: "Clasament",
    volleyClassificationText: "Criteriile principale sunt meciurile câștigate, diferența de puncte și rezultatul direct între echipele aflate la egalitate.",
    volleyGameRulesTitle: "Joc",
    volleyGameRulesText: "Nu sunt permise mai mult de trei atingeri pe echipă. Rotirea este obligatorie și se permite atingerea mingii cu piciorul dacă nu se comite altă greșeală.",
    volleyNetTitle: "Fileu și greșeli",
    volleyNetText: "Atingerea fileului sau invadarea terenului advers pot fi sancționate. Din sferturi, semifinală și finală regulile se aplică mai strict.",
    volleyMatchFormatTitle: "Meciuri",
    volleyMatchFormatText: "În grupe se joacă un set de 25 de puncte. În fazele finale se joacă la seturi de 15 puncte, cu set decisiv dacă este nevoie.",
    volleyRefereeTitle: "Arbitraj",
    volleyRefereeText: "Arbitrul are decizia finală pe teren. Publicul poate ajuta doar în situații evidente, fără a întrerupe jocul sau a favoriza o echipă.",
    volleyFormEyebrow: "Preînscriere",
    volleyFormTitle: "Înscriere echipă",
    volleyFormText: "Reprezentantul lasă datele echipei și va fi persoana de contact cu organizarea. Verifică numele înainte de a trimite înscrierea.",
    volleyRepresentativeLabel: "Numele reprezentantului",
    volleyFullNamePlaceholder: "Nume și prenume",
    volleyTeamNameLabel: "Numele echipei",
    volleyTeamNamePlaceholder: "Numele echipei",
    volleyShirtColorLabel: "Culoarea tricoului",
    volleyShirtColorLimit: "Maximum 5 echipe pe culoare",
    volleyShirtColorHelp: "Toți jucătorii echipei ar trebui să vină, pe cât posibil, cu tricou de aceeași culoare. Culorile complete apar dezactivate.",
    volleyMoreColorsLabel: "Mai multe culori",
    volleyNoColorSelected: "Alege culoarea tricoului echipei.",
    volleyColorSelected: "Ai ales {color}. Mai sunt {remaining} loc(uri) pentru această culoare.",
    volleyColorFull: "Culoarea {color} este completă.",
    volleyColorAvailability: "{remaining} din {capacity} locuri disponibile",
    volleyColorComplete: "Complet",
    volleyPlayersLabel: "Jucători",
    volleyMinimumPlayers: "Minimum 6 jucători",
    volleyAddPlayer: "+ Adaugă jucător",
    volleyNotesLabel: "Note",
    volleyNotesPlaceholder: "Comentarii, întrebări sau nevoi ale echipei",
    volleySubmit: "Trimite înscrierea",
    volleyInitialMessage: "Echipa va rămâne în așteptarea aprobării.",
    volleyLegalNote: "Prin trimiterea înscrierii accepți ca Betel Reus să folosească aceste date doar pentru organizarea turneului și contactarea reprezentantului. Datele nu vor fi publicate, cu excepția numelui echipei, reprezentantului și jucătorilor atunci când echipa este acceptată.",
    volleyConfirmedEyebrow: "Echipe confirmate",
    volleyConfirmedTitle: "Echipe înscrise",
    volleyConfirmedText: "Apar doar echipele acceptate de administrator.",
    volleyPlayer: "Jucător",
    volleyRemovePlayer: "Elimină jucătorul",
    volleyConfirmedCount: "jucători",
    volleyRepresentative: "Reprezentant",
    volleyNoTeams: "Încă nu există echipe confirmate.",
    volleyTeamsLoadError: "Nu s-au putut încărca echipele confirmate.",
    volleyGenericError: "Nu s-a putut trimite înscrierea. Încearcă din nou.",
    volleyRepresentativeMissing: "Adaugă numele reprezentantului echipei.",
    volleyTeamMissing: "Adaugă numele echipei.",
    volleyColorMissing: "Alege culoarea tricoului echipei.",
    volleyColorUnavailable: "Culoarea aleasă este completă. Alege altă culoare.",
    volleyAcceptedDuplicate: "Există deja o echipă acceptată cu acest nume. Folosește alt nume sau contactează organizarea.",
    volleyPlayersMissing: "Adaugă cel puțin 6 jucători cu nume și prenume.",
    volleySubmitting: "Se trimite înscrierea...",
    volleySuccess: "Înscriere trimisă corect. Rămâne în așteptarea aprobării.",
    volleyDuplicate: "Există deja o înscriere cu acest nume de echipă. Folosește alt nume sau contactează organizarea.",
    volleyRateLimited: "Ai trimis prea multe solicitări într-un timp scurt. Așteaptă un minut și încearcă din nou.",
    volleySubmitError: "Nu s-a putut trimite înscrierea. Verifică datele și încearcă din nou."
  },
  es: {
    volleyPageTitle: "Torneo de volley Reus | Betel Reus",
    volleyPageDescription: "Información e inscripción para la 4ª edición del torneo de volley organizado por los jóvenes de Betel Reus el 13 de junio de 2026.",
    volleyHeroMeta: "4ª edición · Reus · 13 Junio 2026 · 10:00",
    volleyHeroTitleLine1: "Torneo",
    volleyHeroTitleLine2: "Volley",
    volleyHeroText: "La cuarta edición del torneo reúne equipos, amigos y jóvenes en Reus alrededor del deporte, el respeto y un ambiente sano.",
    volleyPosterAlt: "Jugadores de volley saltando frente a una pelota",
    volleyNavHome: "Inicio",
    volleyNavRules: "Reglas",
    volleyNavRegistration: "Inscripciones",
    volleyRegisterCta: "Inscribir equipo",
    volleyInfoCta: "Ver información",
    volleyInfoEyebrow: "Información principal",
    volleyInfoTitle: "Torneo de volley en Reus",
    volleyInfoText: "El torneo se celebrará el sábado 13 de junio de 2026 a las 10:00. Es la 4ª edición y la primera preparada en este formato online, con inscripción y equipos confirmados en la página.",
    volleyDateLabel: "Fecha",
    volleyDateValue: "13 Junio 2026",
    volleyTimeLabel: "Hora",
    volleyContactLabel: "Contacto",
    volleyLocationLabel: "Ubicación",
    volleyLocationValue: "Reus · ubicación exacta por confirmar",
    volleyEditionLabel: "Edición",
    volleyEditionValue: "4ª edición",
    volleyRulesEyebrow: "Participación",
    volleyRulesTitle: "Condiciones del torneo",
    volleyTeamsRuleTitle: "Equipos",
    volleyTeamsRuleText: "Los equipos son mixtos. En el campo juegan 5 personas, con al menos una chica y un chico en todo momento. Puede haber jugadores reserva inscritos.",
    volleySpiritRuleTitle: "Ambiente",
    volleySpiritRuleText: "Pedimos respeto, puntualidad y espíritu deportivo. Las conductas inadecuadas podrán ser sancionadas por la organización o el árbitro.",
    volleyRegistrationRuleTitle: "Inscripción",
    volleyRegistrationRuleText: "La inscripción queda pendiente hasta que el administrador la revise y la acepte. Los equipos aceptados aparecerán en esta página.",
    volleyRegulationEyebrow: "Reglamento",
    volleyRegulationTitle: "Reglas principales",
    volleyRegulationText: "El reglamento se basa en las normas usadas en la edición anterior. La organización podrá ajustar detalles puntuales según el número de equipos y las condiciones del día.",
    volleyFormatTitle: "Formato",
    volleyFormatText: "La fase de grupos se juega con sistema todos contra todos. Los dos primeros equipos de cada grupo pasan a la fase eliminatoria.",
    volleyClassificationTitle: "Clasificación",
    volleyClassificationText: "Los criterios principales son partidos ganados, diferencia de puntos y resultado directo entre equipos empatados.",
    volleyGameRulesTitle: "Juego",
    volleyGameRulesText: "No se permiten más de tres toques por equipo. La rotación es obligatoria y se permite tocar el balón con el pie si no se comete otra falta.",
    volleyNetTitle: "Red y faltas",
    volleyNetText: "Tocar la red o invadir el campo rival puede ser sancionado. Desde cuartos, semifinal y final las reglas se aplican de forma más estricta.",
    volleyMatchFormatTitle: "Partidos",
    volleyMatchFormatText: "En grupos se juega un set de 25 puntos. En las fases finales se juega con sets de 15 puntos, con set decisivo si hace falta.",
    volleyRefereeTitle: "Arbitraje",
    volleyRefereeText: "El árbitro tiene la decisión final en el campo. El público puede ayudar solo en situaciones evidentes, sin interrumpir el juego ni favorecer a un equipo.",
    volleyFormEyebrow: "Preinscripción",
    volleyFormTitle: "Inscripción de equipo",
    volleyFormText: "El representante deja los datos del equipo y será la persona de contacto con la organización. Revisa los nombres antes de enviar la inscripción.",
    volleyRepresentativeLabel: "Nombre del representante",
    volleyFullNamePlaceholder: "Nombre y apellidos",
    volleyTeamNameLabel: "Nombre del equipo",
    volleyTeamNamePlaceholder: "Nombre del equipo",
    volleyShirtColorLabel: "Color de camiseta",
    volleyShirtColorLimit: "Máximo 5 equipos por color",
    volleyShirtColorHelp: "Todos los jugadores del equipo deberían venir, en la medida de lo posible, con una camiseta del mismo color. Los colores completos aparecen deshabilitados.",
    volleyMoreColorsLabel: "Más colores",
    volleyNoColorSelected: "Elige el color de camiseta del equipo.",
    volleyColorSelected: "Has escogido {color}. Quedan {remaining} plaza(s) para este color.",
    volleyColorFull: "El color {color} está completo.",
    volleyColorAvailability: "{remaining} de {capacity} plazas disponibles",
    volleyColorComplete: "Completo",
    volleyPlayersLabel: "Jugadores",
    volleyMinimumPlayers: "Mínimo 6 jugadores",
    volleyAddPlayer: "+ Añadir jugador",
    volleyNotesLabel: "Notas",
    volleyNotesPlaceholder: "Comentarios, dudas o necesidades del equipo",
    volleySubmit: "Enviar inscripción",
    volleyInitialMessage: "El equipo quedará pendiente de aprobación.",
    volleyLegalNote: "Al enviar la inscripción aceptas que Betel Reus trate estos datos únicamente para organizar el torneo y contactar con el representante. Los datos no se publicarán salvo el nombre del equipo, el representante y los jugadores cuando el equipo sea aceptado.",
    volleyConfirmedEyebrow: "Equipos confirmados",
    volleyConfirmedTitle: "Equipos inscritos",
    volleyConfirmedText: "Solo aparecen los equipos aceptados por el administrador.",
    volleyPlayer: "Jugador",
    volleyRemovePlayer: "Eliminar jugador",
    volleyConfirmedCount: "jugadores",
    volleyRepresentative: "Representante",
    volleyNoTeams: "Todavía no hay equipos confirmados.",
    volleyTeamsLoadError: "No se pudieron cargar los equipos confirmados.",
    volleyGenericError: "No se pudo enviar la inscripción. Inténtalo de nuevo.",
    volleyRepresentativeMissing: "Añade el nombre del representante del equipo.",
    volleyTeamMissing: "Añade el nombre del equipo.",
    volleyColorMissing: "Elige el color de camiseta del equipo.",
    volleyColorUnavailable: "El color elegido está completo. Elige otro color.",
    volleyAcceptedDuplicate: "Ya existe un equipo aceptado con ese nombre. Usa otro nombre o contacta con la organización.",
    volleyPlayersMissing: "Añade al menos 6 jugadores con nombre y apellidos.",
    volleySubmitting: "Enviando inscripción...",
    volleySuccess: "Inscripción enviada correctamente. Queda pendiente de aprobación.",
    volleyDuplicate: "Ya existe una inscripción con ese nombre de equipo. Usa otro nombre o contacta con la organización.",
    volleyRateLimited: "Has enviado demasiadas solicitudes seguidas. Espera un minuto e inténtalo de nuevo.",
    volleySubmitError: "No se pudo enviar la inscripción. Revisa los datos e inténtalo de nuevo."
  }
};

function tx(key) {
  return translations[lang]?.[key] || translations.ro[key] || key;
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
    if (translations[lang][key]) node.textContent = translations[lang][key];
  });
  document.querySelectorAll("[data-i18n-alt]").forEach((node) => {
    const key = node.dataset.i18nAlt;
    if (translations[lang][key]) node.alt = translations[lang][key];
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
    const key = node.dataset.i18nPlaceholder;
    if (translations[lang][key]) node.placeholder = translations[lang][key];
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
      <button class="volley-color-option${isCompact ? " is-compact" : ""}${selected ? " is-selected" : ""}${color.full ? " is-full" : ""}" type="button" data-color="${escapeHtml(color.id)}" ${color.full ? "disabled" : ""}>
        <span class="volley-color-swatch" style="--shirt-color: ${escapeHtml(color.hex)}"></span>
        <strong>${escapeHtml(label)}</strong>
        <small>${color.full ? tx("volleyColorComplete") : formatTx("volleyColorAvailability", { remaining: color.remaining, capacity: color.capacity })}</small>
      </button>
    `;
  };
  colorGrid.innerHTML = featuredColors.map((color) => colorButton(color)).join("");
  extraColorGrid.innerHTML = extraColors.map((color) => colorButton(color, true)).join("");
  renderColorSummary();
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
    <article>
      <span>${team.players.length} ${tx("volleyConfirmedCount")}</span>
      <h3>${escapeHtml(team.teamName)}</h3>
      <p>${tx("volleyRepresentative")}: ${escapeHtml(team.representativeName)}</p>
      ${team.shirtColor ? `<p>${tx("volleyShirtColorLabel")}: ${escapeHtml(colorName(colorById(team.shirtColor)) || team.shirtColor)}</p>` : ""}
      <small>${team.players.map(escapeHtml).join(", ")}</small>
    </article>
  `).join("") || `<p>${tx("volleyNoTeams")}</p>`;
  prepareRevealElements(teamsContainer);
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
    shirtColor: selectedShirtColor,
    players,
    notes: data.get("notes").trim(),
    website: data.get("website")?.trim() || ""
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

resetPlayerGrid();
setupVolleyEffects();
applyLanguage();
loadColorAvailability();

document.querySelector("#langToggle")?.addEventListener("click", () => {
  lang = lang === "ro" ? "es" : "ro";
  localStorage.setItem("betel-lang", lang);
  applyLanguage();
});

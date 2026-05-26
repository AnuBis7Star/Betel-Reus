import { apiRequest } from "./api.js";

const form = document.querySelector("#volleyRegistrationForm");
const message = document.querySelector("#volleyFormMessage");
const teamsContainer = document.querySelector("#volleyTeams");
const playerGrid = document.querySelector("#volleyPlayerGrid");
const addPlayerButton = document.querySelector("#addVolleyPlayer");
const minimumPlayers = 6;
const teamNameCache = new Set();
let lang = localStorage.getItem("betel-lang") || "ro";

const translations = {
  ro: {
    volleyPageTitle: "Turneu de volley Reus | Betel Reus",
    volleyPageDescription: "Informații și înscriere pentru turneul de volley organizat de tinerii Betel Reus pe 13 iunie 2026.",
    volleyHeroMeta: "Reus · 13 Iunie 2026 · 10:00",
    volleyHeroTitleLine1: "Turneu",
    volleyHeroTitleLine2: "Volley",
    volleyHeroText: "Un turneu deschis pentru a aduna echipe, prieteni și tineri în Reus în jurul sportului, respectului și unui ambient sănătos.",
    volleyPosterAlt: "Jucători de volley sărind în fața unei mingi",
    volleyRegisterCta: "Înscrie echipa",
    volleyInfoCta: "Vezi informațiile",
    volleyInfoEyebrow: "Informații principale",
    volleyInfoTitle: "Turneu de volley în Reus",
    volleyInfoText: "Turneul va avea loc sâmbătă, 13 iunie 2026, la ora 10:00. Fiecare echipă trebuie înscrisă de un reprezentant și să aibă minimum 6 jucători.",
    volleyDateLabel: "Data",
    volleyDateValue: "13 Iunie 2026",
    volleyTimeLabel: "Ora",
    volleyContactLabel: "Contact",
    volleyLocationLabel: "Locație",
    volleyLocationValue: "Reus · locația exactă va fi confirmată",
    volleyRulesEyebrow: "Participare",
    volleyRulesTitle: "Condițiile turneului",
    volleyTeamsRuleTitle: "Echipe",
    volleyTeamsRuleText: "Fiecare echipă trebuie să aibă cel puțin 6 jucători. Poți adăuga jucători în plus din formular dacă echipa va avea rezerve.",
    volleySpiritRuleTitle: "Ambient",
    volleySpiritRuleText: "Cerem respect, punctualitate și spirit sportiv. Organizarea poate ajusta formatul în funcție de numărul echipelor înscrise.",
    volleyRegistrationRuleTitle: "Înscriere",
    volleyRegistrationRuleText: "Înscrierea rămâne în așteptare până când administratorul o verifică și o acceptă. Echipele acceptate vor apărea pe această pagină.",
    volleyFormEyebrow: "Preînscriere",
    volleyFormTitle: "Înscriere echipă",
    volleyFormText: "Reprezentantul lasă datele echipei și va fi persoana de contact cu organizarea. Verifică numele înainte de a trimite înscrierea.",
    volleyRepresentativeLabel: "Numele reprezentantului",
    volleyFullNamePlaceholder: "Nume și prenume",
    volleyTeamNameLabel: "Numele echipei",
    volleyTeamNamePlaceholder: "Numele echipei",
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
    volleyPageDescription: "Información e inscripción para el torneo de volley organizado por los jóvenes de Betel Reus el 13 de junio de 2026.",
    volleyHeroMeta: "Reus · 13 Junio 2026 · 10:00",
    volleyHeroTitleLine1: "Torneo",
    volleyHeroTitleLine2: "Volley",
    volleyHeroText: "Un torneo abierto para reunir equipos, amigos y jóvenes en Reus alrededor del deporte, el respeto y un ambiente sano.",
    volleyPosterAlt: "Jugadores de volley saltando frente a una pelota",
    volleyRegisterCta: "Inscribir equipo",
    volleyInfoCta: "Ver información",
    volleyInfoEyebrow: "Información principal",
    volleyInfoTitle: "Torneo de volley en Reus",
    volleyInfoText: "El torneo se celebrará el sábado 13 de junio de 2026 a las 10:00. Cada equipo debe inscribirse con un representante y un mínimo de 6 jugadores.",
    volleyDateLabel: "Fecha",
    volleyDateValue: "13 Junio 2026",
    volleyTimeLabel: "Hora",
    volleyContactLabel: "Contacto",
    volleyLocationLabel: "Ubicación",
    volleyLocationValue: "Reus · ubicación exacta por confirmar",
    volleyRulesEyebrow: "Participación",
    volleyRulesTitle: "Condiciones del torneo",
    volleyTeamsRuleTitle: "Equipos",
    volleyTeamsRuleText: "Cada equipo debe tener al menos 6 jugadores. Puedes añadir jugadores extra desde el formulario si el equipo tendrá suplentes.",
    volleySpiritRuleTitle: "Ambiente",
    volleySpiritRuleText: "Pedimos respeto, puntualidad y espíritu deportivo. La organización podrá ajustar el formato según el número de equipos inscritos.",
    volleyRegistrationRuleTitle: "Inscripción",
    volleyRegistrationRuleText: "La inscripción queda pendiente hasta que el administrador la revise y la acepte. Los equipos aceptados aparecerán en esta página.",
    volleyFormEyebrow: "Preinscripción",
    volleyFormTitle: "Inscripción de equipo",
    volleyFormText: "El representante deja los datos del equipo y será la persona de contacto con la organización. Revisa los nombres antes de enviar la inscripción.",
    volleyRepresentativeLabel: "Nombre del representante",
    volleyFullNamePlaceholder: "Nombre y apellidos",
    volleyTeamNameLabel: "Nombre del equipo",
    volleyTeamNamePlaceholder: "Nombre del equipo",
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

function escapeHtml(value = "") {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function setMessage(text, state = "") {
  if (!message) return;
  message.textContent = text;
  if (state) message.removeAttribute("data-i18n");
  message.className = `volley-form-note${state ? ` is-${state}` : ""}`;
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
  renumberPlayers();
  loadApprovedTeams();
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
  teams.forEach((team) => teamNameCache.add(normalizeComparable(team.teamName)));
  teamsContainer.innerHTML = teams.map((team) => `
    <article>
      <span>${team.players.length} ${tx("volleyConfirmedCount")}</span>
      <h3>${escapeHtml(team.teamName)}</h3>
      <p>${tx("volleyRepresentative")}: ${escapeHtml(team.representativeName)}</p>
      <small>${team.players.map(escapeHtml).join(", ")}</small>
    </article>
  `).join("") || `<p>${tx("volleyNoTeams")}</p>`;
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

  if (players.length < minimumPlayers) {
    setMessage(tx("volleyPlayersMissing"), "error");
    return;
  }

  submitButton.disabled = true;
  setMessage(tx("volleySubmitting"), "loading");
  try {
    await apiRequest("/api/volley/registrations", { method: "POST", body: payload });
    form.reset();
    resetPlayerGrid();
    setMessage(tx("volleySuccess"), "success");
    await loadApprovedTeams();
  } catch (error) {
    if (error.status === 409) {
      setMessage(tx("volleyDuplicate"), "error");
    } else if (error.status === 429) {
      setMessage(tx("volleyRateLimited"), "error");
    } else {
      setMessage(tx("volleySubmitError"), "error");
    }
  } finally {
    submitButton.disabled = false;
  }
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
applyLanguage();

document.querySelector("#langToggle")?.addEventListener("click", () => {
  lang = lang === "ro" ? "es" : "ro";
  localStorage.setItem("betel-lang", lang);
  applyLanguage();
});

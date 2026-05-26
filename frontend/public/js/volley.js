import { apiRequest } from "./api.js";

const form = document.querySelector("#volleyRegistrationForm");
const message = document.querySelector("#volleyFormMessage");
const teamsContainer = document.querySelector("#volleyTeams");
const playerGrid = document.querySelector("#volleyPlayerGrid");
const addPlayerButton = document.querySelector("#addVolleyPlayer");
const minimumPlayers = 6;

function escapeHtml(value = "") {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function setMessage(text, state = "") {
  if (!message) return;
  message.textContent = text;
  message.className = `volley-form-note${state ? ` is-${state}` : ""}`;
}

function playerValues() {
  if (!playerGrid) return [];
  return [...new Set([...playerGrid.querySelectorAll("input[name='players[]']")]
    .map((input) => input.value.trim())
    .filter(Boolean))];
}

function createPlayerCard(index, value = "") {
  const label = document.createElement("label");
  label.className = "volley-player-card";
  label.innerHTML = `
    <span>Jugador ${index + 1}</span>
    <input name="players[]" placeholder="Nombre y apellidos" value="${escapeHtml(value)}" />
  `;
  return label;
}

function renumberPlayers() {
  if (!playerGrid) return;
  [...playerGrid.querySelectorAll(".volley-player-card span")].forEach((label, index) => {
    label.textContent = `Jugador ${index + 1}`;
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
  teamsContainer.innerHTML = teams.map((team) => `
    <article>
      <span>${team.players.length} jugadores</span>
      <h3>${escapeHtml(team.teamName)}</h3>
      <p>Representante: ${escapeHtml(team.representativeName)}</p>
      <small>${team.players.map(escapeHtml).join(", ")}</small>
    </article>
  `).join("") || "<p>Todavía no hay equipos confirmados.</p>";
}

async function loadApprovedTeams() {
  if (!teamsContainer) return;
  try {
    const data = await apiRequest("/api/volley/teams");
    renderTeams(data.teams || []);
  } catch {
    teamsContainer.innerHTML = "<p>No se pudieron cargar los equipos confirmados.</p>";
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
    notes: data.get("notes").trim()
  };

  if (!payload.representativeName || !payload.teamName || players.length < minimumPlayers) {
    setMessage("Añade el representante, el nombre del equipo y al menos 6 jugadores.", "error");
    return;
  }

  submitButton.disabled = true;
  setMessage("Enviando inscripción...", "loading");
  try {
    await apiRequest("/api/volley/registrations", { method: "POST", body: payload });
    form.reset();
    resetPlayerGrid();
    setMessage("Inscripción enviada correctamente. Queda pendiente de aprobación.", "success");
    await loadApprovedTeams();
  } catch {
    setMessage("No se pudo enviar la inscripción. Inténtalo de nuevo.", "error");
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

resetPlayerGrid();
loadApprovedTeams();

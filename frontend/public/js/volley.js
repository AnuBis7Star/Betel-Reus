import { apiRequest } from "./api.js";

const form = document.querySelector("#volleyRegistrationForm");
const message = document.querySelector("#volleyFormMessage");
const teamsContainer = document.querySelector("#volleyTeams");
const playerGrid = document.querySelector("#volleyPlayerGrid");
const addPlayerButton = document.querySelector("#addVolleyPlayer");
const minimumPlayers = 6;
const teamNameCache = new Set();

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
    <span>Jugador ${index + 1}</span>
    ${canRemove ? '<button class="volley-remove-player" type="button" aria-label="Eliminar jugador">×</button>' : ""}
    <input name="players[]" placeholder="Nombre y apellidos" value="${escapeHtml(value)}" />
  `;
  return label;
}

function renumberPlayers() {
  if (!playerGrid) return;
  [...playerGrid.querySelectorAll(".volley-player-card")].forEach((card, index) => {
    card.querySelector("span").textContent = `Jugador ${index + 1}`;
    card.querySelector(".volley-remove-player")?.remove();
    if (index >= minimumPlayers) {
      card.insertAdjacentHTML("beforeend", '<button class="volley-remove-player" type="button" aria-label="Eliminar jugador">×</button>');
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
    notes: data.get("notes").trim(),
    website: data.get("website")?.trim() || ""
  };

  if (payload.website) {
    setMessage("No se pudo enviar la inscripción. Inténtalo de nuevo.", "error");
    return;
  }

  if (!payload.representativeName) {
    setMessage("Añade el nombre del representante del equipo.", "error");
    return;
  }

  if (!payload.teamName) {
    setMessage("Añade el nombre del equipo.", "error");
    return;
  }

  if (teamNameCache.has(normalizeComparable(payload.teamName))) {
    setMessage("Ya existe un equipo aceptado con ese nombre. Usa otro nombre o contacta con la organización.", "error");
    return;
  }

  if (players.length < minimumPlayers) {
    setMessage("Añade al menos 6 jugadores con nombre y apellidos.", "error");
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
  } catch (error) {
    if (error.status === 409) {
      setMessage("Ya existe una inscripción con ese nombre de equipo. Usa otro nombre o contacta con la organización.", "error");
    } else if (error.status === 429) {
      setMessage("Has enviado demasiadas solicitudes seguidas. Espera un minuto e inténtalo de nuevo.", "error");
    } else {
      setMessage("No se pudo enviar la inscripción. Revisa los datos e inténtalo de nuevo.", "error");
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
loadApprovedTeams();

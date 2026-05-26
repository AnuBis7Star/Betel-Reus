import { apiRequest } from "./api.js";

const form = document.querySelector("#volleyRegistrationForm");
const message = document.querySelector("#volleyFormMessage");
const teamsContainer = document.querySelector("#volleyTeams");

function escapeHtml(value = "") {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function playersFromText(value = "") {
  return [...new Set(String(value).split(/\r?\n|,/).map((item) => item.trim()).filter(Boolean))];
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
  const players = playersFromText(data.get("players"));
  const payload = {
    representativeName: data.get("representative").trim(),
    teamName: data.get("team").trim(),
    players,
    notes: data.get("notes").trim()
  };

  if (!payload.representativeName || !payload.teamName || players.length === 0) {
    message.textContent = "Añade el representante, el nombre del equipo y al menos un jugador.";
    return;
  }

  submitButton.disabled = true;
  message.textContent = "Enviando inscripción...";
  try {
    await apiRequest("/api/volley/registrations", { method: "POST", body: payload });
    form.reset();
    message.textContent = "Inscripción enviada. Queda pendiente de aprobación.";
    await loadApprovedTeams();
  } catch {
    message.textContent = "No se pudo enviar la inscripción. Inténtalo de nuevo.";
  } finally {
    submitButton.disabled = false;
  }
});

loadApprovedTeams();

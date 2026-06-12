import { apiRequest } from "./api.js";

const API_PATH = "/api/volley/tournament-state";

const TEXT = {
  pending: "Pendiente",
  groupPhase: "Fase de grupos",
  playoffs: "Eliminatorias",
  championDecided: "Campeón decidido",
  complete: "Completo",
  missingScore: "Falta puntuación",
  enterBothScores: "Introduce ambos puntos",
  winner: "Ganador",
  court1: "Campo 1",
  court2: "Campo 2",
  court3: "Campo 3",
  slot: "Franja",
  buffer: "Margen",
  delayRecovery: "Recuperar retrasos",
  refereeBreak: "Descanso árbitro",
  flexibleSlot: "Franja flexible",
  live: "En directo",
  qualifiers: "Clasificados",
  qNoteLive: "El Top 2 se muestra en directo, pero la clasificación final queda fijada cuando todos los partidos de grupo tienen puntuación.",
  ready: "Listo",
  waiting: "Esperando",
  enterScore: "Introduce puntos",
  waitingPrevious: "Esperando partido anterior",
  clearConfirm: "¿Borrar todos los puntos de grupos y eliminatorias?",
  saveIdle: "Sincronizado",
  savePending: "Guardando…",
  saveError: "Error al guardar",
  saveOffline: "Sin conexión"
};

const groups = {
  "Grupo A": ["Beteliștii", "Leones de Judá", "Team Spirit", "Luculescu’s Team"],
  "Grupo B": ["Groapa cu Lei", "Torre Fuerte", "Kojaska", "TNS Volley"],
  "Grupo C": ["Los Titanes", "Santos Rematadores", "Playeros", "Mancos Team"],
  "Grupo D": ["Remate de Fe", "TOISS", "Vida Real"]
};

const groupClasses = {
  "Grupo A": "group-a",
  "Grupo B": "group-b",
  "Grupo C": "group-c",
  "Grupo D": "group-d"
};

const groupSlots = [
  { slot: 1, c1: "G-A-1", c2: "G-B-3", c3: "G-C-3" },
  { slot: 2, c1: "G-A-2", c2: "G-B-4", c3: "G-C-4" },
  { slot: 3, c1: "G-D-1", c2: "G-A-4", c3: "G-A-5" },
  { slot: 4, c1: "G-B-1", c2: "G-C-1", c3: "G-C-5" },
  { slot: 5, c1: "G-B-2", c2: "G-D-3", c3: "G-A-6" },
  { slot: 6, c1: "G-D-2", c2: "G-C-2", c3: "G-B-6" },
  { slot: 7, c1: "G-A-3", c2: "G-B-5", c3: "G-C-6" }
];

const groupMatches = {
  "G-A-1": { group: "Grupo A", teamA: "Beteliștii", teamB: "Leones de Judá" },
  "G-A-2": { group: "Grupo A", teamA: "Luculescu’s Team", teamB: "Team Spirit" },
  "G-A-3": { group: "Grupo A", teamA: "Beteliștii", teamB: "Team Spirit" },
  "G-A-4": { group: "Grupo A", teamA: "Beteliștii", teamB: "Luculescu’s Team" },
  "G-A-5": { group: "Grupo A", teamA: "Leones de Judá", teamB: "Team Spirit" },
  "G-A-6": { group: "Grupo A", teamA: "Luculescu’s Team", teamB: "Leones de Judá" },

  "G-B-1": { group: "Grupo B", teamA: "Kojaska", teamB: "Groapa cu Lei" },
  "G-B-2": { group: "Grupo B", teamA: "TNS Volley", teamB: "Torre Fuerte" },
  "G-B-3": { group: "Grupo B", teamA: "Kojaska", teamB: "TNS Volley" },
  "G-B-4": { group: "Grupo B", teamA: "Groapa cu Lei", teamB: "Torre Fuerte" },
  "G-B-5": { group: "Grupo B", teamA: "Torre Fuerte", teamB: "Kojaska" },
  "G-B-6": { group: "Grupo B", teamA: "Groapa cu Lei", teamB: "TNS Volley" },

  "G-C-1": { group: "Grupo C", teamA: "Los Titanes", teamB: "Mancos Team" },
  "G-C-2": { group: "Grupo C", teamA: "Playeros", teamB: "Mancos Team" },
  "G-C-3": { group: "Grupo C", teamA: "Los Titanes", teamB: "Playeros" },
  "G-C-4": { group: "Grupo C", teamA: "Santos Rematadores", teamB: "Mancos Team" },
  "G-C-5": { group: "Grupo C", teamA: "Playeros", teamB: "Santos Rematadores" },
  "G-C-6": { group: "Grupo C", teamA: "Los Titanes", teamB: "Santos Rematadores" },

  "G-D-1": { group: "Grupo D", teamA: "Remate de Fe", teamB: "TOISS" },
  "G-D-2": { group: "Grupo D", teamA: "Remate de Fe", teamB: "Vida Real" },
  "G-D-3": { group: "Grupo D", teamA: "Vida Real", teamB: "TOISS" }
};

const playoffStructure = {
  "QF1": { label: "CF1", round: "Cuartos de final", sourceA: "1A", sourceB: "2B" },
  "QF2": { label: "CF2", round: "Cuartos de final", sourceA: "1B", sourceB: "2A" },
  "QF3": { label: "CF3", round: "Cuartos de final", sourceA: "1C", sourceB: "2D" },
  "QF4": { label: "CF4", round: "Cuartos de final", sourceA: "1D", sourceB: "2C" },
  "SF1": { label: "SF1", round: "Semifinales", sourceA: "W-QF1", sourceB: "W-QF3" },
  "SF2": { label: "SF2", round: "Semifinales", sourceA: "W-QF2", sourceB: "W-QF4" },
  "F": { label: "Final", round: "Final", sourceA: "W-SF1", sourceB: "W-SF2" },
  "P3": { label: "3.º puesto", round: "Final", sourceA: "L-SF1", sourceB: "L-SF2" }
};

let state = {
  groupScores: {},
  playoffScores: {}
};

let remoteLoaded = false;
let saveStatusElement = null;
let saveToken = 0;

function defaultState() {
  return { groupScores: {}, playoffScores: {} };
}

function sanitizeScoreEntry(value) {
  if (!value || typeof value !== "object") return { a: "", b: "" };
  const a = value.a === "" || value.a === null || value.a === undefined ? "" : Number(value.a);
  const b = value.b === "" || value.b === null || value.b === undefined ? "" : Number(value.b);
  return {
    a: a === "" ? "" : (Number.isFinite(a) ? a : ""),
    b: b === "" ? "" : (Number.isFinite(b) ? b : "")
  };
}

function sanitizeRemoteState(record) {
  const result = defaultState();
  const incoming = record && typeof record === "object" ? record.state : null;
  if (!incoming || typeof incoming !== "object") return result;
  const groups = incoming.groupScores && typeof incoming.groupScores === "object" ? incoming.groupScores : {};
  const playoffs = incoming.playoffScores && typeof incoming.playoffScores === "object" ? incoming.playoffScores : {};
  for (const [key, value] of Object.entries(groups)) {
    if (typeof key === "string" && key.length <= 64) result.groupScores[key] = sanitizeScoreEntry(value);
  }
  for (const [key, value] of Object.entries(playoffs)) {
    if (typeof key === "string" && key.length <= 64) result.playoffScores[key] = sanitizeScoreEntry(value);
  }
  return result;
}

function hasUserInput() {
  return Object.keys(state.groupScores).length > 0 || Object.keys(state.playoffScores).length > 0;
}

function setSaveStatus(status) {
  if (!saveStatusElement) return;
  const labels = {
    idle: TEXT.saveIdle,
    pending: TEXT.savePending,
    error: TEXT.saveError,
    offline: TEXT.saveOffline,
    loading: TEXT.savePending
  };
  saveStatusElement.dataset.status = status;
  saveStatusElement.textContent = labels[status] || TEXT.saveIdle;
}

async function persistState() {
  if (!remoteLoaded) return;
  const token = ++saveToken;
  setSaveStatus("pending");
  try {
    const result = await apiRequest(API_PATH, {
      method: "POST",
      body: { groupScores: state.groupScores, playoffScores: state.playoffScores }
    });
    if (token !== saveToken) return;
    if (result && result.state) {
      const sanitized = sanitizeRemoteState(result);
      state.groupScores = sanitized.groupScores;
      state.playoffScores = sanitized.playoffScores;
    }
    setSaveStatus("idle");
  } catch (error) {
    if (token !== saveToken) return;
    console.warn("No se pudo guardar el estado del torneo.", error);
    setSaveStatus(navigator.onLine === false ? "offline" : "error");
  }
}

async function loadRemoteState() {
  setSaveStatus("loading");
  try {
    const result = await apiRequest(API_PATH);
    const sanitized = sanitizeRemoteState(result);
    const hadLocalInput = hasUserInput();
    state.groupScores = { ...sanitized.groupScores, ...state.groupScores };
    state.playoffScores = { ...sanitized.playoffScores, ...state.playoffScores };
    remoteLoaded = true;
    if (hadLocalInput) {
      persistState();
    } else {
      setSaveStatus("idle");
    }
  } catch (error) {
    console.warn("No se pudo cargar el estado guardado.", error);
    remoteLoaded = true;
    setSaveStatus(navigator.onLine === false ? "offline" : "error");
  }
  renderAll();
}

function getScore(collection, matchId) {
  return collection[matchId] || { a: "", b: "" };
}

function isComplete(score) {
  return score.a !== "" && score.b !== "" && Number(score.a) !== Number(score.b);
}

function getWinner(match, score) {
  if (!isComplete(score)) return null;
  return Number(score.a) > Number(score.b) ? match.teamA : match.teamB;
}

function getLoser(match, score) {
  if (!isComplete(score)) return null;
  return Number(score.a) > Number(score.b) ? match.teamB : match.teamA;
}

function setGroupScore(matchId, side, value) {
  if (!state.groupScores[matchId]) state.groupScores[matchId] = { a: "", b: "" };
  state.groupScores[matchId][side] = value === "" ? "" : Math.max(0, Number(value));
  persistState();
  renderAll();
}

function setPlayoffScore(matchId, side, value) {
  if (!state.playoffScores[matchId]) state.playoffScores[matchId] = { a: "", b: "" };
  state.playoffScores[matchId][side] = value === "" ? "" : Math.max(0, Number(value));
  persistState();
  renderAll();
}

function calculateStandings() {
  const standings = {};

  Object.entries(groups).forEach(([groupName, teams]) => {
    standings[groupName] = {};
    teams.forEach(team => {
      standings[groupName][team] = {
        team,
        played: 0,
        wins: 0,
        losses: 0,
        pointsFor: 0,
        pointsAgainst: 0,
        diff: 0,
        headToHead: {}
      };
    });
  });

  Object.entries(groupMatches).forEach(([matchId, match]) => {
    const score = getScore(state.groupScores, matchId);
    if (!isComplete(score)) return;

    const a = standings[match.group][match.teamA];
    const b = standings[match.group][match.teamB];
    const scoreA = Number(score.a);
    const scoreB = Number(score.b);

    a.played += 1;
    b.played += 1;
    a.pointsFor += scoreA;
    a.pointsAgainst += scoreB;
    b.pointsFor += scoreB;
    b.pointsAgainst += scoreA;

    if (scoreA > scoreB) {
      a.wins += 1;
      b.losses += 1;
      a.headToHead[match.teamB] = 1;
      b.headToHead[match.teamA] = -1;
    } else {
      b.wins += 1;
      a.losses += 1;
      b.headToHead[match.teamA] = 1;
      a.headToHead[match.teamB] = -1;
    }

    a.diff = a.pointsFor - a.pointsAgainst;
    b.diff = b.pointsFor - b.pointsAgainst;
  });

  const sorted = {};
  Object.entries(standings).forEach(([groupName, table]) => {
    sorted[groupName] = Object.values(table).sort((x, y) => {
      if (y.wins !== x.wins) return y.wins - x.wins;
      if (y.diff !== x.diff) return y.diff - x.diff;
      if (y.pointsFor !== x.pointsFor) return y.pointsFor - x.pointsFor;
      const h2h = y.headToHead[x.team] || 0;
      if (h2h !== 0) return h2h;
      return x.team.localeCompare(y.team);
    });
  });

  return sorted;
}

function getCompletedGroupCount() {
  return Object.keys(groupMatches).filter(id => isComplete(getScore(state.groupScores, id))).length;
}

function allGroupsComplete() {
  return getCompletedGroupCount() === Object.keys(groupMatches).length;
}

function getQualifiers() {
  const standings = calculateStandings();
  if (!allGroupsComplete()) return {};

  return {
    "1A": standings["Grupo A"][0]?.team,
    "2A": standings["Grupo A"][1]?.team,
    "1B": standings["Grupo B"][0]?.team,
    "2B": standings["Grupo B"][1]?.team,
    "1C": standings["Grupo C"][0]?.team,
    "2C": standings["Grupo C"][1]?.team,
    "1D": standings["Grupo D"][0]?.team,
    "2D": standings["Grupo D"][1]?.team
  };
}

function resolveSource(source) {
  const qualifiers = getQualifiers();

  if (qualifiers[source]) return qualifiers[source];

  if (source.startsWith("W-")) {
    const matchId = source.replace("W-", "");
    return getPlayoffWinner(matchId);
  }

  if (source.startsWith("L-")) {
    const matchId = source.replace("L-", "");
    return getPlayoffLoser(matchId);
  }

  return null;
}

function getPlayoffMatch(matchId) {
  const structure = playoffStructure[matchId];
  return {
    teamA: resolveSource(structure.sourceA),
    teamB: resolveSource(structure.sourceB),
    group: structure.round
  };
}

function getPlayoffWinner(matchId) {
  const match = getPlayoffMatch(matchId);
  const score = getScore(state.playoffScores, matchId);
  if (!match.teamA || !match.teamB || !isComplete(score)) return null;
  return Number(score.a) > Number(score.b) ? match.teamA : match.teamB;
}

function getPlayoffLoser(matchId) {
  const match = getPlayoffMatch(matchId);
  const score = getScore(state.playoffScores, matchId);
  if (!match.teamA || !match.teamB || !isComplete(score)) return null;
  return Number(score.a) > Number(score.b) ? match.teamB : match.teamA;
}

function getCompletedPlayoffCount() {
  return Object.keys(playoffStructure).filter(id => {
    const match = getPlayoffMatch(id);
    const score = getScore(state.playoffScores, id);
    return match.teamA && match.teamB && isComplete(score);
  }).length;
}

function getChampion() {
  return getPlayoffWinner("F");
}

function renderGroups() {
  const grid = document.getElementById("groupsGrid");
  grid.innerHTML = "";

  Object.entries(groups).forEach(([groupName, teams]) => {
    const article = document.createElement("article");
    article.className = `group ${groupClasses[groupName]}`;
    article.innerHTML = `
      <div class="group-header">${groupName} <small>${teams.length} equipos</small></div>
      <ul class="team-list">
        ${teams.map((team, index) => `
          <li class="team"><span>${team}</span><span class="seed">${index + 1}</span></li>
        `).join("")}
      </ul>
    `;
    grid.appendChild(article);
  });
}

function makeEmptyCourt(courtName) {
  return `
    <article class="court">
      <div class="court-title">${courtName} <span class="status-pill">${TEXT.buffer}</span></div>
      <div class="match-visual">
        <div class="versus">
          <div class="team-chip">${TEXT.delayRecovery}</div>
          <div class="vs">/</div>
          <div class="team-chip">${TEXT.refereeBreak}</div>
        </div>
        <div class="match-meta">
          <span class="pill warning">${TEXT.flexibleSlot}</span>
        </div>
      </div>
    </article>
  `;
}

function makeGroupCourt(courtName, matchId) {
  const match = groupMatches[matchId];
  const score = getScore(state.groupScores, matchId);
  const complete = isComplete(score);
  const winner = getWinner(match, score);
  const loser = getLoser(match, score);

  return `
    <article class="court" data-teams="${match.teamA}|${match.teamB}">
      <div class="court-title">
        ${courtName}
        <span class="status-pill ${complete ? "complete" : ""}">${complete ? TEXT.complete : TEXT.missingScore}</span>
      </div>
      <div class="match-visual">
        <div class="versus">
          <div class="team-chip ${winner === match.teamA ? "winner" : loser === match.teamA ? "loser" : ""}">${match.teamA}</div>
          <div class="score-box">
            <div class="score-inputs">
              <input type="number" min="0" max="999" step="1" inputmode="numeric" value="${score.a}" data-group-score="${matchId}" data-side="a" aria-label="Puntos ${match.teamA}">
              <input type="number" min="0" max="999" step="1" inputmode="numeric" value="${score.b}" data-group-score="${matchId}" data-side="b" aria-label="Puntos ${match.teamB}">
            </div>
            <div class="vs">PUNTOS</div>
          </div>
          <div class="team-chip ${winner === match.teamB ? "winner" : loser === match.teamB ? "loser" : ""}">${match.teamB}</div>
        </div>
        <div class="match-meta">
          <span class="pill">${match.group}</span>
          ${complete ? `<span class="pill winner">${TEXT.winner}: ${winner}</span>` : `<span class="pill warning">${TEXT.enterBothScores}</span>`}
        </div>
      </div>
    </article>
  `;
}

function renderGroupSchedule() {
  const board = document.getElementById("groupSchedule");
  const selectedTeam = document.getElementById("teamFilter").value;
  board.innerHTML = "";

  groupSlots.forEach(item => {
    const teamsInSlot = [];
    if (item.c1 && groupMatches[item.c1]) teamsInSlot.push(groupMatches[item.c1].teamA, groupMatches[item.c1].teamB);
    if (item.c2 && groupMatches[item.c2]) teamsInSlot.push(groupMatches[item.c2].teamA, groupMatches[item.c2].teamB);
    if (item.c3 && groupMatches[item.c3]) teamsInSlot.push(groupMatches[item.c3].teamA, groupMatches[item.c3].teamB);

    const card = document.createElement("article");
    card.className = "slot-card";
    if (selectedTeam !== "all" && !teamsInSlot.includes(selectedTeam)) card.classList.add("dimmed");
    if (selectedTeam !== "all" && teamsInSlot.includes(selectedTeam)) card.classList.add("highlight");

    card.innerHTML = `
      <div class="slot-badge"><div><small>${TEXT.slot}</small>${item.slot}</div></div>
      <div class="courts">
        ${item.c1 ? makeGroupCourt(TEXT.court1, item.c1) : makeEmptyCourt(TEXT.court1)}
        ${item.c2 ? makeGroupCourt(TEXT.court2, item.c2) : makeEmptyCourt(TEXT.court2)}
        ${item.c3 ? makeGroupCourt(TEXT.court3, item.c3) : makeEmptyCourt(TEXT.court3)}
      </div>
    `;
    board.appendChild(card);
  });

  document.querySelectorAll("[data-group-score]").forEach(input => {
    input.addEventListener("change", event => {
      setGroupScore(event.target.dataset.groupScore, event.target.dataset.side, event.target.value);
    });
  });
}

function renderStandings() {
  const standings = calculateStandings();
  const grid = document.getElementById("standingsGrid");
  grid.innerHTML = "";

  Object.entries(standings).forEach(([groupName, rows]) => {
    const groupComplete = rows.every(row => row.played === (groups[groupName].length - 1));
    const article = document.createElement("article");
    article.className = `group ${groupClasses[groupName]}`;
    article.innerHTML = `
      <div class="group-header">${groupName} <small>${groupComplete ? "completo" : "en directo"}</small></div>
      <table>
        <thead>
          <tr><th>Equipo</th><th>PJ</th><th>V</th><th>D</th><th>Dif.</th></tr>
        </thead>
        <tbody>
          ${rows.map((row, index) => `
            <tr class="${index < 2 ? "qualifier" : ""} ${row.played === 0 ? "pending" : ""}">
              <td>${index + 1}. ${row.team}</td>
              <td>${row.played}</td>
              <td>${row.wins}</td>
              <td>${row.losses}</td>
              <td>${row.diff > 0 ? "+" : ""}${row.diff}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
      <p class="mini-note">
        ${allGroupsComplete()
          ? `${TEXT.qualifiers}: ${rows[0]?.team || "-"} y ${rows[1]?.team || "-"}`
          : TEXT.qNoteLive}
      </p>
    `;
    grid.appendChild(article);
  });
}

function renderBracket() {
  const bracket = document.getElementById("bracket");
  const alert = document.getElementById("playoffAlert");
  bracket.innerHTML = "";

  alert.style.display = allGroupsComplete() ? "none" : "block";

  const rounds = [
    { title: "Cuartos de final", ids: ["QF1", "QF2", "QF3", "QF4"] },
    { title: "Semifinales", ids: ["SF1", "SF2"] },
    { title: "Finales", ids: ["F", "P3"] }
  ];

  rounds.forEach(round => {
    const roundEl = document.createElement("div");
    roundEl.className = "round";
    roundEl.innerHTML = `<h3>${round.title}</h3>`;

    round.ids.forEach(id => {
      const structure = playoffStructure[id];
      const match = getPlayoffMatch(id);
      const score = getScore(state.playoffScores, id);
      const complete = match.teamA && match.teamB && isComplete(score);
      const ready = match.teamA && match.teamB;
      const winner = ready ? getPlayoffWinner(id) : null;
      const loser = ready ? getPlayoffLoser(id) : null;

      const matchEl = document.createElement("article");
      matchEl.className = `bracket-match ${complete ? "complete" : ready ? "pending" : ""}`;
      matchEl.innerHTML = `
        <div class="match-label"><span>${structure.label}</span><span>${ready ? TEXT.ready : TEXT.waiting}</span></div>
        <div class="bracket-team ${winner === match.teamA ? "winner" : loser === match.teamA ? "loser" : ""}">
          <span class="${match.teamA ? "" : "placeholder"}">${match.teamA || structure.sourceA}</span>
          <input class="bracket-score-input" type="number" min="0" max="999" step="1" inputmode="numeric" value="${score.a}" data-playoff-score="${id}" data-side="a" ${ready ? "" : "disabled"} aria-label="Puntos ${match.teamA || structure.sourceA}">
        </div>
        <div class="bracket-team ${winner === match.teamB ? "winner" : loser === match.teamB ? "loser" : ""}">
          <span class="${match.teamB ? "" : "placeholder"}">${match.teamB || structure.sourceB}</span>
          <input class="bracket-score-input" type="number" min="0" max="999" step="1" inputmode="numeric" value="${score.b}" data-playoff-score="${id}" data-side="b" ${ready ? "" : "disabled"} aria-label="Puntos ${match.teamB || structure.sourceB}">
        </div>
        <div class="match-meta">
          ${complete ? `<span class="pill winner">${TEXT.winner}: ${winner}</span>` : ready ? `<span class="pill warning">${TEXT.enterScore}</span>` : `<span class="pill warning">${TEXT.waitingPrevious}</span>`}
        </div>
      `;
      roundEl.appendChild(matchEl);
    });

    bracket.appendChild(roundEl);
  });

  document.querySelectorAll("[data-playoff-score]").forEach(input => {
    input.addEventListener("change", event => {
      setPlayoffScore(event.target.dataset.playoffScore, event.target.dataset.side, event.target.value);
    });
  });

  const champion = getChampion();
  document.getElementById("championName").textContent = champion || TEXT.pending;
}

function renderHeroStats() {
  const teams = Object.values(groups).reduce((sum, list) => sum + list.length, 0);
  const matches = Object.keys(groupMatches).length + Object.keys(playoffStructure).length;
  const courts = new Set();
  for (const slot of groupSlots) {
    if (slot.c1) courts.add("c1");
    if (slot.c2) courts.add("c2");
    if (slot.c3) courts.add("c3");
  }
  const statTeams = document.getElementById("statTeams");
  const statMatches = document.getElementById("statMatches");
  const statCourts = document.getElementById("statCourts");
  if (statTeams) statTeams.textContent = String(teams);
  if (statMatches) statMatches.textContent = String(matches);
  if (statCourts) statCourts.textContent = String(courts.size);
}

function renderSummary() {
  const completedGroups = getCompletedGroupCount();
  const totalGroups = Object.keys(groupMatches).length;
  const totalPlayoffs = Object.keys(playoffStructure).length;
  const totalQualifiers = 2 * Object.keys(groups).length;
  const completedPlayoffs = getCompletedPlayoffCount();
  const champion = getChampion();

  document.getElementById("groupProgress").textContent = `${completedGroups} / ${totalGroups}`;
  document.getElementById("qualifierProgress").textContent = allGroupsComplete() ? `${totalQualifiers} / ${totalQualifiers}` : TEXT.pending;
  document.getElementById("playoffProgress").textContent = `${completedPlayoffs} / ${totalPlayoffs}`;
  document.getElementById("championSummary").textContent = champion || TEXT.pending;
  document.getElementById("statusText").textContent = champion
    ? TEXT.championDecided
    : allGroupsComplete()
      ? TEXT.playoffs
      : TEXT.groupPhase;
}

function renderTeamFilter() {
  const select = document.getElementById("teamFilter");
  if (select.options.length > 1) return;
  Object.values(groups).flat().forEach(team => {
    const option = document.createElement("option");
    option.value = team;
    option.textContent = team;
    select.appendChild(option);
  });
}

function fillSampleScores() {
  const sample = {
    "G-A-1": { a: 25, b: 18 }, "G-A-2": { a: 22, b: 25 }, "G-A-3": { a: 25, b: 21 },
    "G-A-4": { a: 17, b: 25 }, "G-A-5": { a: 25, b: 19 }, "G-A-6": { a: 25, b: 16 },
    "G-B-1": { a: 19, b: 25 }, "G-B-2": { a: 21, b: 25 }, "G-B-3": { a: 14, b: 25 },
    "G-B-4": { a: 20, b: 25 }, "G-B-5": { a: 18, b: 25 }, "G-B-6": { a: 25, b: 17 },
    "G-C-1": { a: 25, b: 12 }, "G-C-2": { a: 25, b: 17 }, "G-C-3": { a: 25, b: 19 },
    "G-C-4": { a: 15, b: 25 }, "G-C-5": { a: 25, b: 21 }, "G-C-6": { a: 25, b: 22 },
    "G-D-1": { a: 25, b: 20 }, "G-D-2": { a: 16, b: 25 }, "G-D-3": { a: 25, b: 18 }
  };

  const playoffs = {
    "QF1": { a: 25, b: 21 },
    "QF2": { a: 25, b: 23 },
    "QF3": { a: 25, b: 19 },
    "QF4": { a: 27, b: 25 },
    "SF1": { a: 25, b: 22 },
    "SF2": { a: 25, b: 20 },
    "F": { a: 25, b: 23 },
    "P3": { a: 25, b: 21 }
  };

  state.groupScores = sample;
  state.playoffScores = playoffs;
  persistState();
  renderAll();
}

function clearScores() {
  if (!confirm(TEXT.clearConfirm)) return;
  state.groupScores = {};
  state.playoffScores = {};
  persistState();
  renderAll();
}

function renderAll() {
  renderHeroStats();
  renderTeamFilter();
  renderGroups();
  renderGroupSchedule();
  renderStandings();
  renderBracket();
  renderSummary();
}

function bindEvents() {
  const tabs = document.querySelectorAll(".tab");
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => {
        t.classList.remove("active");
        t.setAttribute("aria-selected", "false");
      });
      document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));
      tab.classList.add("active");
      tab.setAttribute("aria-selected", "true");
      document.getElementById(tab.dataset.tab).classList.add("active");
    });
  });

  document.getElementById("teamFilter").addEventListener("change", renderGroupSchedule);
  document.getElementById("resetFilterBtn").addEventListener("click", () => {
    document.getElementById("teamFilter").value = "all";
    renderGroupSchedule();
  });
  document.getElementById("demoScoresBtn").addEventListener("click", fillSampleScores);
  document.getElementById("clearScoresBtn").addEventListener("click", clearScores);
}

function init() {
  saveStatusElement = document.getElementById("saveStatus");
  bindEvents();
  setSaveStatus("loading");
  renderAll();
  loadRemoteState();
}

init();

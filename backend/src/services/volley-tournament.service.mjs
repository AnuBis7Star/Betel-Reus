import { memory } from "../config/memory.mjs";
import { pool } from "../config/db.mjs";
import { httpError } from "../utils/response.mjs";

const tournamentStateId = "volley-2026-06-13";
const tournamentStateTitle = "Torneo voleibol 2026";
const maxMatches = 64;

let schemaReady = false;

function defaultState() {
  return { groupScores: {}, playoffScores: {} };
}

async function ensureTournamentSchema(client = pool) {
  if (!client || schemaReady) return;
  await client.query(`
    CREATE TABLE IF NOT EXISTS volley_tournament_states (
      id text PRIMARY KEY,
      title text NOT NULL DEFAULT 'Torneo voleibol 2026',
      state jsonb NOT NULL DEFAULT '{"groupScores": {}, "playoffScores": {}}'::jsonb,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);
  await client.query(
    `INSERT INTO volley_tournament_states (id, title, state)
     VALUES ($1, $2, $3)
     ON CONFLICT (id) DO NOTHING`,
    [tournamentStateId, tournamentStateTitle, JSON.stringify(defaultState())]
  );
  schemaReady = true;
}

function normalizeScoreValue(value) {
  if (value === "" || value === null || value === undefined) return "";
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0 || number > 999) {
    throw httpError(400, "Invalid score value");
  }
  return Math.trunc(number);
}

function normalizeMatchScores(rawValue) {
  if (rawValue === null || rawValue === undefined) return { a: "", b: "" };
  if (typeof rawValue !== "object" || Array.isArray(rawValue)) {
    throw httpError(400, "Invalid match score");
  }
  return {
    a: normalizeScoreValue(rawValue.a),
    b: normalizeScoreValue(rawValue.b)
  };
}

function normalizeScoreCollection(rawValue) {
  if (rawValue === null || rawValue === undefined) return {};
  if (typeof rawValue !== "object" || Array.isArray(rawValue)) {
    throw httpError(400, "Invalid scores collection");
  }
  const entries = Object.entries(rawValue).slice(0, maxMatches);
  const result = {};
  for (const [matchId, scores] of entries) {
    if (!matchId || typeof matchId !== "string") continue;
    if (matchId.length > 64) throw httpError(400, "Invalid match id");
    result[matchId] = normalizeMatchScores(scores);
  }
  return result;
}

function normalizeState(rawValue) {
  const payload = rawValue && typeof rawValue === "object" && !Array.isArray(rawValue) ? rawValue : {};
  return {
    groupScores: normalizeScoreCollection(payload.groupScores),
    playoffScores: normalizeScoreCollection(payload.playoffScores)
  };
}

function normalizePayload(payload = {}) {
  return normalizeState(payload);
}

function rowToState(row) {
  return {
    id: row.id,
    title: row.title,
    state: normalizeState(row.state),
    updatedAt: row.updated_at
  };
}

function memoryToState(record) {
  return {
    id: record.id,
    title: record.title,
    state: normalizeState(record.state),
    updatedAt: record.updatedAt
  };
}

async function getVolleyTournamentState() {
  if (!pool) {
    const existing = memory.volleyTournamentStates[tournamentStateId];
    if (existing) return memoryToState(existing);
    const created = {
      id: tournamentStateId,
      title: tournamentStateTitle,
      state: defaultState(),
      updatedAt: new Date().toISOString()
    };
    memory.volleyTournamentStates[tournamentStateId] = created;
    return created;
  }

  await ensureTournamentSchema();
  const result = await pool.query(
    "SELECT id, title, state, updated_at FROM volley_tournament_states WHERE id = $1",
    [tournamentStateId]
  );
  if (result.rowCount) return rowToState(result.rows[0]);

  const inserted = await pool.query(
    `INSERT INTO volley_tournament_states (id, title, state)
     VALUES ($1, $2, $3)
     ON CONFLICT (id) DO UPDATE SET updated_at = now()
     RETURNING id, title, state, updated_at`,
    [tournamentStateId, tournamentStateTitle, JSON.stringify(defaultState())]
  );
  return rowToState(inserted.rows[0]);
}

async function saveVolleyTournamentState(payload) {
  const nextState = normalizePayload(payload);

  if (!pool) {
    const existing = memory.volleyTournamentStates[tournamentStateId];
    const updated = {
      id: tournamentStateId,
      title: tournamentStateTitle,
      state: nextState,
      updatedAt: new Date().toISOString()
    };
    memory.volleyTournamentStates[tournamentStateId] = updated;
    return { previous: existing ? memoryToState(existing) : null, current: updated };
  }

  await ensureTournamentSchema();
  const before = await pool.query(
    "SELECT id, title, state, updated_at FROM volley_tournament_states WHERE id = $1",
    [tournamentStateId]
  );
  const result = await pool.query(
    `INSERT INTO volley_tournament_states (id, title, state, updated_at)
     VALUES ($1, $2, $3::jsonb, now())
     ON CONFLICT (id) DO UPDATE SET state = EXCLUDED.state, updated_at = now()
     RETURNING id, title, state, updated_at`,
    [tournamentStateId, tournamentStateTitle, JSON.stringify(nextState)]
  );
  return {
    previous: before.rowCount ? rowToState(before.rows[0]) : null,
    current: rowToState(result.rows[0])
  };
}

export { getVolleyTournamentState, saveVolleyTournamentState, tournamentStateId };

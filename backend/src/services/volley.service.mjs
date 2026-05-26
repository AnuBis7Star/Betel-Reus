import { randomUUID } from "node:crypto";

import { memory } from "../config/memory.mjs";
import { pool } from "../config/db.mjs";
import { audit } from "./audit.service.mjs";
import { httpError } from "../utils/response.mjs";
import { isValidUuid, normalizeText } from "../utils/helpers.mjs";

let schemaReady = false;
const minimumPlayers = 6;

async function ensureVolleySchema(client = pool) {
  if (!client || schemaReady) return;
  await client.query("CREATE EXTENSION IF NOT EXISTS pgcrypto");
  await client.query(`
    CREATE TABLE IF NOT EXISTS volley_registrations (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      team_name TEXT NOT NULL,
      representative_name TEXT NOT NULL,
      players JSONB NOT NULL DEFAULT '[]'::jsonb,
      notes TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);
  await client.query("CREATE INDEX IF NOT EXISTS idx_volley_registrations_status_created_at ON volley_registrations(status, created_at DESC)");
  schemaReady = true;
}

function normalizePlayers(value) {
  const list = Array.isArray(value)
    ? value
    : String(value || "")
      .split(/\r?\n|,/)
      .map((item) => item.trim());
  return [...new Set(list.map((item) => normalizeText(item, 120)).filter(Boolean))].slice(0, 16);
}

function comparableTeamName(value = "") {
  return normalizeText(value, 120)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function normalizeVolleyPayload(payload = {}, existing = {}) {
  const teamName = normalizeText(payload.teamName ?? payload.team ?? existing.teamName, 120);
  const representativeName = normalizeText(payload.representativeName ?? payload.representative ?? existing.representativeName, 120);
  const players = normalizePlayers(payload.players ?? existing.players);
  const notes = normalizeText(payload.notes ?? existing.notes, 600);
  const status = normalizeText(payload.status ?? existing.status ?? "pending", 20);

  if (!["pending", "approved", "rejected"].includes(status)) throw httpError(400, "Invalid registration status");

  return { teamName, representativeName, players, notes, status };
}

async function ensureUniqueTeamName(teamName, currentId = null) {
  const comparable = comparableTeamName(teamName);
  if (!comparable) return;

  if (!pool) {
    const duplicate = memory.volleyRegistrations.find((item) =>
      item.id !== currentId && comparableTeamName(item.teamName) === comparable
    );
    if (duplicate) throw httpError(409, "A team with this name is already registered");
    return;
  }

  await ensureVolleySchema();
  const result = await pool.query(
    "SELECT id FROM volley_registrations WHERE lower(trim(team_name)) = lower(trim($1)) AND ($2::uuid IS NULL OR id <> $2::uuid) LIMIT 1",
    [teamName, currentId]
  );
  if (result.rowCount) throw httpError(409, "A team with this name is already registered");
}

function validateVolleyRegistration(registration) {
  if (!registration.teamName) throw httpError(400, "Team name is required");
  if (!registration.representativeName) throw httpError(400, "Representative name is required");
  if (registration.players.length < minimumPlayers) throw httpError(400, `At least ${minimumPlayers} players are required`);
}

function volleyRegistrationFromRow(row) {
  return {
    id: row.id,
    teamName: row.team_name,
    representativeName: row.representative_name,
    players: Array.isArray(row.players) ? row.players : [],
    notes: row.notes || "",
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

async function createVolleyRegistration(payload) {
  if (normalizeText(payload.website, 80)) throw httpError(400, "Invalid registration");
  const registration = normalizeVolleyPayload(payload);
  validateVolleyRegistration(registration);
  await ensureUniqueTeamName(registration.teamName);
  registration.status = "pending";

  if (!pool) {
    const created = { id: randomUUID(), ...registration, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    memory.volleyRegistrations.unshift(created);
    await audit("Înscriere volley trimisă", "volley", created.id, null, created, registration.representativeName);
    return created;
  }

  await ensureVolleySchema();
  const result = await pool.query(
    "INSERT INTO volley_registrations (team_name, representative_name, players, notes, status) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [registration.teamName, registration.representativeName, JSON.stringify(registration.players), registration.notes, registration.status]
  );
  const created = volleyRegistrationFromRow(result.rows[0]);
  await audit("Înscriere volley trimisă", "volley", created.id, null, created, created.representativeName);
  return created;
}

async function listApprovedVolleyTeams() {
  if (!pool) return memory.volleyRegistrations.filter((item) => item.status === "approved");
  await ensureVolleySchema();
  const result = await pool.query("SELECT * FROM volley_registrations WHERE status = 'approved' ORDER BY team_name ASC");
  return result.rows.map(volleyRegistrationFromRow);
}

async function listVolleyRegistrations() {
  if (!pool) return memory.volleyRegistrations;
  await ensureVolleySchema();
  const result = await pool.query("SELECT * FROM volley_registrations ORDER BY created_at DESC");
  return result.rows.map(volleyRegistrationFromRow);
}

async function updateVolleyRegistration(id, payload) {
  if (pool && !isValidUuid(id)) throw httpError(400, "Invalid registration id");

  if (!pool) {
    const index = memory.volleyRegistrations.findIndex((item) => item.id === id);
    if (index === -1) throw httpError(404, "Registration not found");
    const before = { ...memory.volleyRegistrations[index] };
    const updated = { ...before, ...normalizeVolleyPayload(payload, before), updatedAt: new Date().toISOString() };
    validateVolleyRegistration(updated);
    await ensureUniqueTeamName(updated.teamName, id);
    memory.volleyRegistrations[index] = updated;
    await audit("Înscriere volley actualizată", "volley", id, before, updated);
    return updated;
  }

  await ensureVolleySchema();
  const beforeResult = await pool.query("SELECT * FROM volley_registrations WHERE id = $1", [id]);
  if (!beforeResult.rowCount) throw httpError(404, "Registration not found");
  const before = volleyRegistrationFromRow(beforeResult.rows[0]);
  const updatedPayload = normalizeVolleyPayload(payload, before);
  validateVolleyRegistration(updatedPayload);
  await ensureUniqueTeamName(updatedPayload.teamName, id);
  const result = await pool.query(
    "UPDATE volley_registrations SET team_name = $1, representative_name = $2, players = $3, notes = $4, status = $5, updated_at = now() WHERE id = $6 RETURNING *",
    [updatedPayload.teamName, updatedPayload.representativeName, JSON.stringify(updatedPayload.players), updatedPayload.notes, updatedPayload.status, id]
  );
  const updated = volleyRegistrationFromRow(result.rows[0]);
  await audit("Înscriere volley actualizată", "volley", id, before, updated);
  return updated;
}

async function deleteVolleyRegistration(id) {
  if (pool && !isValidUuid(id)) throw httpError(400, "Invalid registration id");

  if (!pool) {
    const before = memory.volleyRegistrations.find((item) => item.id === id);
    if (!before) throw httpError(404, "Registration not found");
    memory.volleyRegistrations = memory.volleyRegistrations.filter((item) => item.id !== id);
    await audit("Înscriere volley ștearsă", "volley", id, before, null);
    return { ok: true };
  }

  await ensureVolleySchema();
  const beforeResult = await pool.query("SELECT * FROM volley_registrations WHERE id = $1", [id]);
  const result = await pool.query("DELETE FROM volley_registrations WHERE id = $1", [id]);
  if (!result.rowCount) throw httpError(404, "Registration not found");
  await audit("Înscriere volley ștearsă", "volley", id, beforeResult.rows[0] ? volleyRegistrationFromRow(beforeResult.rows[0]) : null, null);
  return { ok: true };
}

export {
  createVolleyRegistration,
  deleteVolleyRegistration,
  listApprovedVolleyTeams,
  listVolleyRegistrations,
  updateVolleyRegistration
};

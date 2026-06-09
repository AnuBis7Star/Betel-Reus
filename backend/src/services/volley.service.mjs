import { randomUUID } from "node:crypto";

import { memory } from "../config/memory.mjs";
import { pool } from "../config/db.mjs";
import { audit } from "./audit.service.mjs";
import { httpError } from "../utils/response.mjs";
import { isValidUuid, normalizeText } from "../utils/helpers.mjs";

let schemaReady = false;
const minimumPlayers = 5;
const colorCapacity = 5;
// Registration closes Friday 12 June 2026 at 18:00 Europe/Madrid.
const volleyRegistrationDeadlineIso = "2026-06-12T18:00:00+02:00";
const volleyRegistrationDeadline = new Date(volleyRegistrationDeadlineIso);
const shirtColors = [
  { id: "white", ro: "Alb", es: "Blanco", hex: "#f7f3e8" },
  { id: "black", ro: "Negru", es: "Negro", hex: "#242124" },
  { id: "red", ro: "Roșu", es: "Rojo", hex: "#e8313a" },
  { id: "blue", ro: "Albastru", es: "Azul", hex: "#2f6feb" },
  { id: "green", ro: "Verde", es: "Verde", hex: "#596b36" },
  { id: "yellow", ro: "Galben", es: "Amarillo", hex: "#ffd21d" },
  { id: "pink", ro: "Roz", es: "Rosa", hex: "#e94aa9" },
  { id: "purple", ro: "Mov", es: "Morado", hex: "#7c3aed" },
  { id: "orange", ro: "Portocaliu", es: "Naranja", hex: "#f97316" },
  { id: "turquoise", ro: "Turcoaz", es: "Turquesa", hex: "#14b8a6" },
  { id: "navy", ro: "Bleumarin", es: "Azul marino", hex: "#1e3a8a" },
  { id: "gray", ro: "Gri", es: "Gris", hex: "#8a8f98" },
  { id: "burgundy", ro: "Vișiniu", es: "Granate", hex: "#7f1d1d" },
  { id: "coral", ro: "Coral", es: "Coral", hex: "#fb7185" },
  { id: "sky", ro: "Albastru deschis", es: "Azul claro", hex: "#38bdf8" },
  { id: "mint", ro: "Mentă", es: "Menta", hex: "#86efac" },
  { id: "lime", ro: "Verde lime", es: "Verde lima", hex: "#a3e635" },
  { id: "beige", ro: "Bej", es: "Beige", hex: "#d6c3a5" },
  { id: "brown", ro: "Maro", es: "Marrón", hex: "#7c2d12" },
  { id: "silver", ro: "Argintiu", es: "Plateado", hex: "#cbd5e1" },
  { id: "gold", ro: "Auriu", es: "Dorado", hex: "#fbbf24" },
  { id: "lavender", ro: "Lavandă", es: "Lavanda", hex: "#c084fc" }
];

async function ensureVolleySchema(client = pool) {
  if (!client || schemaReady) return;
  await client.query("CREATE EXTENSION IF NOT EXISTS pgcrypto");
  await client.query(`
    CREATE TABLE IF NOT EXISTS volley_registrations (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      team_name TEXT NOT NULL,
      representative_name TEXT NOT NULL,
      church_name TEXT NOT NULL DEFAULT '',
      shirt_color TEXT NOT NULL DEFAULT '',
      players JSONB NOT NULL DEFAULT '[]'::jsonb,
      notes TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);
  await client.query("ALTER TABLE volley_registrations ADD COLUMN IF NOT EXISTS church_name TEXT NOT NULL DEFAULT ''");
  await client.query("ALTER TABLE volley_registrations ADD COLUMN IF NOT EXISTS shirt_color TEXT NOT NULL DEFAULT ''");
  await client.query("CREATE INDEX IF NOT EXISTS idx_volley_registrations_status_created_at ON volley_registrations(status, created_at DESC)");
  await client.query("CREATE INDEX IF NOT EXISTS idx_volley_registrations_shirt_color_status ON volley_registrations(shirt_color, status)");
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

function normalizeShirtColor(value = "") {
  const color = normalizeText(value, 40).toLowerCase();
  return shirtColors.some((item) => item.id === color) ? color : "";
}

function normalizeVolleyPayload(payload = {}, existing = {}) {
  const teamName = normalizeText(payload.teamName ?? payload.team ?? existing.teamName, 120);
  const representativeName = normalizeText(payload.representativeName ?? payload.representative ?? existing.representativeName, 120);
  const churchName = normalizeText(payload.churchName ?? payload.church ?? existing.churchName, 160);
  const shirtColor = normalizeShirtColor(payload.shirtColor ?? payload.shirt_color ?? existing.shirtColor);
  const players = normalizePlayers(payload.players ?? existing.players);
  const notes = normalizeText(payload.notes ?? existing.notes, 600);
  const status = normalizeText(payload.status ?? existing.status ?? "pending", 20);

  if (!["pending", "approved", "rejected"].includes(status)) throw httpError(400, "Invalid registration status");

  return { teamName, representativeName, churchName, shirtColor, players, notes, status };
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

function colorCountsFromRegistrations(registrations) {
  const counts = new Map(shirtColors.map((color) => [color.id, 0]));
  registrations
    .filter((item) => item.status !== "rejected")
    .forEach((item) => {
      const color = normalizeShirtColor(item.shirtColor);
      if (color) counts.set(color, (counts.get(color) || 0) + 1);
    });
  return counts;
}

function colorAvailabilityFromCounts(counts) {
  return shirtColors.map((color) => {
    const used = counts.get(color.id) || 0;
    return { ...color, used, capacity: colorCapacity, remaining: Math.max(colorCapacity - used, 0), full: used >= colorCapacity };
  });
}

async function listVolleyColorAvailability() {
  if (!pool) return colorAvailabilityFromCounts(colorCountsFromRegistrations(memory.volleyRegistrations));
  await ensureVolleySchema();
  const result = await pool.query("SELECT shirt_color, count(*)::int AS used FROM volley_registrations WHERE status <> 'rejected' AND shirt_color <> '' GROUP BY shirt_color");
  const counts = new Map(shirtColors.map((color) => [color.id, 0]));
  result.rows.forEach((row) => counts.set(row.shirt_color, Number(row.used || 0)));
  return colorAvailabilityFromCounts(counts);
}

async function ensureColorCapacity(shirtColor, currentId = null) {
  if (!shirtColor) throw httpError(400, "Shirt color is required");

  if (!pool) {
    const used = memory.volleyRegistrations.filter((item) =>
      item.id !== currentId && item.status !== "rejected" && normalizeShirtColor(item.shirtColor) === shirtColor
    ).length;
    if (used >= colorCapacity) throw httpError(409, "This shirt color is already full");
    return;
  }

  await ensureVolleySchema();
  const result = await pool.query(
    "SELECT count(*)::int AS used FROM volley_registrations WHERE shirt_color = $1 AND status <> 'rejected' AND ($2::uuid IS NULL OR id <> $2::uuid)",
    [shirtColor, currentId]
  );
  if (Number(result.rows[0]?.used || 0) >= colorCapacity) throw httpError(409, "This shirt color is already full");
}

function validateVolleyRegistration(registration, { allowRejectedIncomplete = false } = {}) {
  if (!registration.teamName) throw httpError(400, "Team name is required");
  if (!registration.representativeName) throw httpError(400, "Representative name is required");
  if (allowRejectedIncomplete && registration.status === "rejected") return;
  if (!registration.churchName) throw httpError(400, "Church name is required");
  if (!registration.shirtColor) throw httpError(400, "Shirt color is required");
  if (registration.players.length < minimumPlayers) throw httpError(400, `At least ${minimumPlayers} players are required`);
}

function isVolleyRegistrationClosed(now = new Date()) {
  return now >= volleyRegistrationDeadline;
}

function volleyRegistrationFromRow(row) {
  return {
    id: row.id,
    teamName: row.team_name,
    representativeName: row.representative_name,
    churchName: row.church_name || "",
    shirtColor: row.shirt_color || "",
    players: Array.isArray(row.players) ? row.players : [],
    notes: row.notes || "",
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

async function createVolleyRegistration(payload) {
  if (isVolleyRegistrationClosed()) throw httpError(403, "Volley registrations are closed");
  if (normalizeText(payload.website, 80)) throw httpError(400, "Invalid registration");
  if (payload.gdprConsent !== true && payload.gdprConsent !== "true" && payload.gdprConsent !== "on") {
    throw httpError(400, "Privacy consent is required");
  }
  const registration = normalizeVolleyPayload(payload);
  validateVolleyRegistration(registration);
  await ensureUniqueTeamName(registration.teamName);
  await ensureColorCapacity(registration.shirtColor);
  registration.status = "pending";

  if (!pool) {
    const created = { id: randomUUID(), ...registration, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    memory.volleyRegistrations.unshift(created);
    await audit("Înscriere volley trimisă", "volley", created.id, null, created, registration.representativeName);
    return created;
  }

  await ensureVolleySchema();
  const result = await pool.query(
    "INSERT INTO volley_registrations (team_name, representative_name, church_name, shirt_color, players, notes, status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
    [registration.teamName, registration.representativeName, registration.churchName, registration.shirtColor, JSON.stringify(registration.players), registration.notes, registration.status]
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
    validateVolleyRegistration(updated, { allowRejectedIncomplete: true });
    await ensureUniqueTeamName(updated.teamName, id);
    if (updated.status !== "rejected") await ensureColorCapacity(updated.shirtColor, id);
    memory.volleyRegistrations[index] = updated;
    await audit("Înscriere volley actualizată", "volley", id, before, updated);
    return updated;
  }

  await ensureVolleySchema();
  const beforeResult = await pool.query("SELECT * FROM volley_registrations WHERE id = $1", [id]);
  if (!beforeResult.rowCount) throw httpError(404, "Registration not found");
  const before = volleyRegistrationFromRow(beforeResult.rows[0]);
  const updatedPayload = normalizeVolleyPayload(payload, before);
  validateVolleyRegistration(updatedPayload, { allowRejectedIncomplete: true });
  await ensureUniqueTeamName(updatedPayload.teamName, id);
  if (updatedPayload.status !== "rejected") await ensureColorCapacity(updatedPayload.shirtColor, id);
  const result = await pool.query(
    "UPDATE volley_registrations SET team_name = $1, representative_name = $2, church_name = $3, shirt_color = $4, players = $5, notes = $6, status = $7, updated_at = now() WHERE id = $8 RETURNING *",
    [updatedPayload.teamName, updatedPayload.representativeName, updatedPayload.churchName, updatedPayload.shirtColor, JSON.stringify(updatedPayload.players), updatedPayload.notes, updatedPayload.status, id]
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
  isVolleyRegistrationClosed,
  listApprovedVolleyTeams,
  listVolleyColorAvailability,
  listVolleyRegistrations,
  volleyRegistrationDeadlineIso,
  updateVolleyRegistration
};

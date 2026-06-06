import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { memory } from "../config/memory.mjs";
import { pool } from "../config/db.mjs";
import { httpError } from "../utils/response.mjs";
import { isValidUuid, normalizeText } from "../utils/helpers.mjs";
import { audit } from "./audit.service.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const defaultUploadsDir = path.resolve(__dirname, "../../../frontend/public/uploads/events");
const uploadsDir = path.resolve(process.env.UPLOADS_DIR || defaultUploadsDir);
const uploadPublicPath = normalizePublicPath(process.env.UPLOADS_PUBLIC_PATH || "/uploads/events");
const maxPosterBytes = 4 * 1024 * 1024;

let schemaReady = false;

function normalizePublicPath(value) {
  const normalized = `/${String(value || "").replace(/^\/+|\/+$/g, "")}`;
  return normalized === "/" ? "/uploads/events" : normalized;
}

async function ensureEventsSchema(client = pool) {
  if (!client || schemaReady) return;
  await client.query("CREATE EXTENSION IF NOT EXISTS pgcrypto");
  await client.query(`
    CREATE TABLE IF NOT EXISTS church_events (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      event_date DATE NOT NULL,
      event_time TEXT NOT NULL DEFAULT '',
      location TEXT NOT NULL DEFAULT '',
      category TEXT NOT NULL DEFAULT '',
      accent_color TEXT NOT NULL DEFAULT '#7f090b',
      published BOOLEAN NOT NULL DEFAULT false,
      featured BOOLEAN NOT NULL DEFAULT false,
      title_ro TEXT NOT NULL DEFAULT '',
      short_description_ro TEXT NOT NULL DEFAULT '',
      full_description_ro TEXT NOT NULL DEFAULT '',
      poster_ro TEXT NOT NULL DEFAULT '',
      title_es TEXT NOT NULL DEFAULT '',
      short_description_es TEXT NOT NULL DEFAULT '',
      full_description_es TEXT NOT NULL DEFAULT '',
      poster_es TEXT NOT NULL DEFAULT '',
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);
  await client.query("CREATE INDEX IF NOT EXISTS idx_church_events_public_date ON church_events(published, event_date, featured)");
  await client.query("CREATE INDEX IF NOT EXISTS idx_church_events_created_at ON church_events(created_at DESC)");
  schemaReady = true;
}

function eventFromRow(row) {
  return {
    id: row.id,
    date: row.event_date instanceof Date ? row.event_date.toISOString().slice(0, 10) : String(row.event_date || "").slice(0, 10),
    time: row.event_time || "",
    location: row.location || "",
    category: row.category || "",
    accentColor: row.accent_color || "#7f090b",
    published: Boolean(row.published),
    featured: Boolean(row.featured),
    titleRo: row.title_ro || "",
    shortDescriptionRo: row.short_description_ro || "",
    fullDescriptionRo: row.full_description_ro || "",
    posterRo: row.poster_ro || "",
    titleEs: row.title_es || "",
    shortDescriptionEs: row.short_description_es || "",
    fullDescriptionEs: row.full_description_es || "",
    posterEs: row.poster_es || "",
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function normalizeColor(value) {
  const color = normalizeText(value || "#7f090b", 24);
  return /^#[0-9a-f]{6}$/i.test(color) ? color.toLowerCase() : "#7f090b";
}

function normalizeBoolean(value) {
  return value === true || value === "true" || value === "on" || value === 1 || value === "1";
}

function normalizeEventPayload(payload = {}, existing = {}) {
  const date = normalizeText(payload.date ?? existing.date, 20);
  const event = {
    date,
    time: normalizeText(payload.time ?? existing.time, 40),
    location: normalizeText(payload.location ?? existing.location, 180),
    category: normalizeText(payload.category ?? existing.category, 80),
    accentColor: normalizeColor(payload.accentColor ?? existing.accentColor),
    published: normalizeBoolean(payload.published ?? existing.published),
    featured: normalizeBoolean(payload.featured ?? existing.featured),
    titleRo: normalizeText(payload.titleRo ?? existing.titleRo, 180),
    shortDescriptionRo: normalizeText(payload.shortDescriptionRo ?? existing.shortDescriptionRo, 260),
    fullDescriptionRo: normalizeText(payload.fullDescriptionRo ?? existing.fullDescriptionRo, 3000),
    posterRo: normalizeText(payload.posterRo ?? existing.posterRo, 500),
    titleEs: normalizeText(payload.titleEs ?? existing.titleEs, 180),
    shortDescriptionEs: normalizeText(payload.shortDescriptionEs ?? existing.shortDescriptionEs, 260),
    fullDescriptionEs: normalizeText(payload.fullDescriptionEs ?? existing.fullDescriptionEs, 3000),
    posterEs: normalizeText(payload.posterEs ?? existing.posterEs, 500),
    posterRoUpload: payload.posterRoUpload || null,
    posterEsUpload: payload.posterEsUpload || null
  };

  if (!/^\d{4}-\d{2}-\d{2}$/.test(event.date)) throw httpError(400, "Event date is required");
  if (!event.titleRo && !event.titleEs) throw httpError(400, "Event title is required");
  return event;
}

function decodeDataUrl(upload) {
  if (!upload?.dataUrl) return null;
  const match = String(upload.dataUrl).match(/^data:(image\/(?:png|jpe?g|webp));base64,([a-z0-9+/=]+)$/i);
  if (!match) throw httpError(400, "Invalid poster image");
  const buffer = Buffer.from(match[2], "base64");
  if (buffer.length > maxPosterBytes) throw httpError(413, "Poster image is too large");
  const extension = { "image/png": "png", "image/jpeg": "jpg", "image/jpg": "jpg", "image/webp": "webp" }[match[1].toLowerCase()];
  return { buffer, extension };
}

async function savePoster(upload, language) {
  const decoded = decodeDataUrl(upload);
  if (!decoded) return "";
  await mkdir(uploadsDir, { recursive: true });
  const filename = `${Date.now()}-${randomUUID()}-${language}.${decoded.extension}`;
  await writeFile(path.join(uploadsDir, filename), decoded.buffer);
  return `${uploadPublicPath}/${filename}`;
}

function posterDiskPaths(publicPath = "") {
  if (!publicPath.startsWith(`${uploadPublicPath}/`)) return [];
  const relativePath = path.normalize(publicPath.slice(uploadPublicPath.length + 1).replaceAll("\\", "/"));
  if (!relativePath || relativePath.startsWith("..") || path.isAbsolute(relativePath)) return [];

  const paths = [path.join(uploadsDir, relativePath)];
  const fallbackPath = path.join(defaultUploadsDir, relativePath);
  if (fallbackPath !== paths[0]) paths.push(fallbackPath);
  return paths;
}

async function deletePosterFile(publicPath) {
  await Promise.all(posterDiskPaths(publicPath).map(async (filePath) => {
    try {
      await unlink(filePath);
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
  }));
}

async function deleteReplacedPosters(before, after) {
  const oldPaths = [before.posterRo, before.posterEs].filter(Boolean);
  const keptPaths = new Set([after.posterRo, after.posterEs].filter(Boolean));
  await Promise.all(oldPaths
    .filter((publicPath) => !keptPaths.has(publicPath))
    .map(deletePosterFile));
}

async function deleteEventPosters(event) {
  await Promise.all([event.posterRo, event.posterEs].filter(Boolean).map(deletePosterFile));
}

async function applyPosterUploads(event) {
  const [posterRo, posterEs] = await Promise.all([
    savePoster(event.posterRoUpload, "ro"),
    savePoster(event.posterEsUpload, "es")
  ]);
  if (posterRo) event.posterRo = posterRo;
  if (posterEs) event.posterEs = posterEs;
  delete event.posterRoUpload;
  delete event.posterEsUpload;
  return event;
}

function publicDateLimit() {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now.toISOString().slice(0, 10);
}

function sortEvents(a, b) {
  const aKey = `${a.date || ""} ${a.time || ""}`;
  const bKey = `${b.date || ""} ${b.time || ""}`;
  return aKey.localeCompare(bKey) || Number(b.featured) - Number(a.featured);
}

async function listPublishedEvents() {
  if (!pool) {
    return memory.events
      .filter((event) => event.published && event.date >= publicDateLimit())
      .sort(sortEvents);
  }
  await ensureEventsSchema();
  const result = await pool.query(
    "SELECT * FROM church_events WHERE published = true AND event_date >= current_date ORDER BY event_date ASC, event_time ASC, featured DESC"
  );
  return result.rows.map(eventFromRow);
}

async function listEvents() {
  if (!pool) return memory.events;
  await ensureEventsSchema();
  const result = await pool.query("SELECT * FROM church_events ORDER BY event_date ASC, event_time ASC, created_at DESC");
  return result.rows.map(eventFromRow);
}

async function createEvent(payload) {
  const event = await applyPosterUploads(normalizeEventPayload(payload));

  if (!pool) {
    const created = { id: randomUUID(), ...event, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    memory.events.unshift(created);
    await audit("Eveniment creat", "event", created.id, null, created);
    return created;
  }

  await ensureEventsSchema();
  const result = await pool.query(
    `INSERT INTO church_events (
      event_date, event_time, location, category, accent_color, published, featured,
      title_ro, short_description_ro, full_description_ro, poster_ro,
      title_es, short_description_es, full_description_es, poster_es
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
    RETURNING *`,
    [
      event.date,
      event.time,
      event.location,
      event.category,
      event.accentColor,
      event.published,
      event.featured,
      event.titleRo,
      event.shortDescriptionRo,
      event.fullDescriptionRo,
      event.posterRo,
      event.titleEs,
      event.shortDescriptionEs,
      event.fullDescriptionEs,
      event.posterEs
    ]
  );
  const created = eventFromRow(result.rows[0]);
  await audit("Eveniment creat", "event", created.id, null, created);
  return created;
}

async function updateEvent(id, payload) {
  if (pool && !isValidUuid(id)) throw httpError(400, "Invalid event id");

  if (!pool) {
    const index = memory.events.findIndex((item) => item.id === id);
    if (index === -1) throw httpError(404, "Event not found");
    const before = { ...memory.events[index] };
    const updatedPayload = await applyPosterUploads(normalizeEventPayload(payload, before));
    const updated = { ...before, ...updatedPayload, updatedAt: new Date().toISOString() };
    memory.events[index] = updated;
    await deleteReplacedPosters(before, updated);
    await audit("Eveniment actualizat", "event", id, before, updated);
    return updated;
  }

  await ensureEventsSchema();
  const beforeResult = await pool.query("SELECT * FROM church_events WHERE id = $1", [id]);
  if (!beforeResult.rowCount) throw httpError(404, "Event not found");
  const before = eventFromRow(beforeResult.rows[0]);
  const event = await applyPosterUploads(normalizeEventPayload(payload, before));
  const result = await pool.query(
    `UPDATE church_events SET
      event_date = $1, event_time = $2, location = $3, category = $4, accent_color = $5,
      published = $6, featured = $7, title_ro = $8, short_description_ro = $9,
      full_description_ro = $10, poster_ro = $11, title_es = $12, short_description_es = $13,
      full_description_es = $14, poster_es = $15, updated_at = now()
    WHERE id = $16 RETURNING *`,
    [
      event.date,
      event.time,
      event.location,
      event.category,
      event.accentColor,
      event.published,
      event.featured,
      event.titleRo,
      event.shortDescriptionRo,
      event.fullDescriptionRo,
      event.posterRo,
      event.titleEs,
      event.shortDescriptionEs,
      event.fullDescriptionEs,
      event.posterEs,
      id
    ]
  );
  const updated = eventFromRow(result.rows[0]);
  await deleteReplacedPosters(before, updated);
  await audit("Eveniment actualizat", "event", id, before, updated);
  return updated;
}

async function deleteEvent(id) {
  if (pool && !isValidUuid(id)) throw httpError(400, "Invalid event id");

  if (!pool) {
    const before = memory.events.find((item) => item.id === id);
    if (!before) throw httpError(404, "Event not found");
    memory.events = memory.events.filter((item) => item.id !== id);
    await deleteEventPosters(before);
    await audit("Eveniment șters", "event", id, before, null);
    return { ok: true };
  }

  await ensureEventsSchema();
  const result = await pool.query("DELETE FROM church_events WHERE id = $1 RETURNING *", [id]);
  if (!result.rowCount) throw httpError(404, "Event not found");
  const deleted = eventFromRow(result.rows[0]);
  await deleteEventPosters(deleted);
  await audit("Eveniment șters", "event", id, deleted, null);
  return { ok: true };
}

export { createEvent, deleteEvent, listEvents, listPublishedEvents, updateEvent };

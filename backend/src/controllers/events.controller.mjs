import { createEvent, deleteEvent, listEvents, listPublishedEvents, updateEvent } from "../services/events.service.mjs";
import { readJson, sendJson } from "../utils/response.mjs";

const eventBodyOptions = { maxBytes: 12 * 1024 * 1024 };

async function getPublicEvents(req, res) {
  return sendJson(res, 200, { events: await listPublishedEvents() });
}

async function getAdminEvents(req, res) {
  return sendJson(res, 200, { events: await listEvents() });
}

async function createAdminEvent(req, res) {
  return sendJson(res, 201, { event: await createEvent(await readJson(req, eventBodyOptions)) });
}

async function updateAdminEvent(req, res, id) {
  return sendJson(res, 200, { event: await updateEvent(id, await readJson(req, eventBodyOptions)) });
}

async function deleteAdminEvent(req, res, id) {
  return sendJson(res, 200, await deleteEvent(id));
}

export { createAdminEvent, deleteAdminEvent, getAdminEvents, getPublicEvents, updateAdminEvent };

import {
  createVolleyRegistration,
  deleteVolleyRegistration,
  exportVolleyRegistrationsWorkbook,
  listApprovedVolleyTeams,
  listVolleyColorAvailability,
  listVolleyRegistrations,
  updateVolleyRegistration
} from "../services/volley.service.mjs";
import { readJson, sendJson } from "../utils/response.mjs";

async function createVolleyRegistrationController(req, res) {
  return sendJson(res, 201, { registration: await createVolleyRegistration(await readJson(req)) });
}

async function getApprovedVolleyTeams(req, res) {
  return sendJson(res, 200, { teams: await listApprovedVolleyTeams() });
}

async function getVolleyColors(req, res) {
  return sendJson(res, 200, { colors: await listVolleyColorAvailability() });
}

async function getAdminVolleyRegistrations(req, res) {
  return sendJson(res, 200, { registrations: await listVolleyRegistrations() });
}

async function exportAdminVolleyRegistrations(req, res) {
  const { buffer, filename } = await exportVolleyRegistrationsWorkbook();
  res.writeHead(200, {
    "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "Content-Disposition": `attachment; filename="${filename}"`,
    "Cache-Control": "no-store",
    "Content-Length": buffer.length
  });
  res.end(buffer);
}

async function updateAdminVolleyRegistration(req, res, id) {
  return sendJson(res, 200, { registration: await updateVolleyRegistration(id, await readJson(req)) });
}

async function deleteAdminVolleyRegistration(req, res, id) {
  return sendJson(res, 200, await deleteVolleyRegistration(id));
}

export {
  createVolleyRegistrationController,
  deleteAdminVolleyRegistration,
  exportAdminVolleyRegistrations,
  getAdminVolleyRegistrations,
  getApprovedVolleyTeams,
  getVolleyColors,
  updateAdminVolleyRegistration
};

import {
  createVolleyRegistration,
  deleteVolleyRegistration,
  listApprovedVolleyTeams,
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

async function getAdminVolleyRegistrations(req, res) {
  return sendJson(res, 200, { registrations: await listVolleyRegistrations() });
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
  getAdminVolleyRegistrations,
  getApprovedVolleyTeams,
  updateAdminVolleyRegistration
};

import {
  createVolleyRegistrationController,
  deleteAdminVolleyRegistration,
  exportAdminVolleyRegistrations,
  getAdminVolleyRegistrations,
  getApprovedVolleyTeams,
  getVolleyColors,
  updateAdminVolleyRegistration
} from "../controllers/volley.controller.mjs";
import { requireAdmin } from "../middleware/admin.middleware.mjs";

async function handleVolleyRoutes(req, res, url) {
  if (url.pathname === "/api/volley/teams" && req.method === "GET") {
    await getApprovedVolleyTeams(req, res);
    return true;
  }

  if (url.pathname === "/api/volley/colors" && req.method === "GET") {
    await getVolleyColors(req, res);
    return true;
  }

  if (url.pathname === "/api/volley/registrations" && req.method === "POST") {
    await createVolleyRegistrationController(req, res);
    return true;
  }

  if (url.pathname === "/api/admin/volley/registrations" && req.method === "GET") {
    if (!requireAdmin(req, res)) return true;
    await getAdminVolleyRegistrations(req, res);
    return true;
  }

  if (url.pathname === "/api/admin/volley/export" && req.method === "GET") {
    if (!requireAdmin(req, res)) return true;
    await exportAdminVolleyRegistrations(req, res);
    return true;
  }

  const registrationMatch = url.pathname.match(/^\/api\/admin\/volley\/registrations\/([^/]+)$/);
  if (registrationMatch) {
    if (!requireAdmin(req, res)) return true;
    if (req.method === "PATCH") {
      await updateAdminVolleyRegistration(req, res, registrationMatch[1]);
      return true;
    }
    if (req.method === "DELETE") {
      await deleteAdminVolleyRegistration(req, res, registrationMatch[1]);
      return true;
    }
  }

  return false;
}

export { handleVolleyRoutes };

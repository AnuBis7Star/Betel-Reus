import { clearAuditLogsController, getAuditLogs } from "../controllers/admin.controller.mjs";
import { requireAdmin } from "../middleware/admin.middleware.mjs";

async function handleAdminRoutes(req, res, url) {
  if (url.pathname === "/api/admin/audit" && req.method === "GET") {
    if (!requireAdmin(req, res)) return true;
    await getAuditLogs(req, res);
    return true;
  }
  if (url.pathname === "/api/admin/audit" && req.method === "DELETE") {
    if (!requireAdmin(req, res)) return true;
    await clearAuditLogsController(req, res);
    return true;
  }
  return false;
}

export { handleAdminRoutes };

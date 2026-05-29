import { sendJson } from "../utils/response.mjs";

const adminCode = process.env.ADMIN_CODE || (process.env.DATABASE_URL ? "" : "ADMIN-BETEL");

function requireAdmin(req, res) {
  if (!adminCode) {
    sendJson(res, 500, { error: "Admin code is not configured" });
    return false;
  }
  if (req.headers["x-admin-code"] === adminCode) return true;
  sendJson(res, 401, { error: "Unauthorized" });
  return false;
}

export { requireAdmin };

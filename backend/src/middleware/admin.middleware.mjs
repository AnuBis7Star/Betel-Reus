import { sendJson } from "../utils/response.mjs";

// TODO: remove the ADMIN-BETEL fallback before final production launch.
const adminCode = process.env.ADMIN_CODE || "ADMIN-BETEL";

function requireAdmin(req, res) {
  if (req.headers["x-admin-code"] === adminCode) return true;
  sendJson(res, 401, { error: "Unauthorized" });
  return false;
}

export { requireAdmin };

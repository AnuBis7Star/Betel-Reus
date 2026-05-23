import { clearAuditLogs, listAuditLogs } from "../services/audit.service.mjs";
import { sendJson } from "../utils/response.mjs";

async function getAuditLogs(req, res) {
  return sendJson(res, 200, { auditLogs: await listAuditLogs() });
}

async function clearAuditLogsController(req, res) {
  return sendJson(res, 200, await clearAuditLogs());
}

export { clearAuditLogsController, getAuditLogs };

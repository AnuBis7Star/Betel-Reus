import { randomUUID } from "node:crypto";

import { memory } from "../config/memory.mjs";
import { pool } from "../config/db.mjs";

async function audit(action, entityType, entityId, beforeData, afterData, actor = "admin") {
  if (pool) {
    await pool.query(
      "INSERT INTO audit_logs (actor, action, entity_type, entity_id, before_data, after_data) VALUES ($1, $2, $3, $4, $5, $6)",
      [actor, action, entityType, entityId, beforeData, afterData]
    );
    return;
  }
  memory.auditLogs.unshift({ id: randomUUID(), actor, action, entity: entityType, entityId, before: beforeData, after: afterData, createdAt: new Date().toISOString() });
}

async function listAuditLogs() {
  if (!pool) return memory.auditLogs.slice(0, 40);
  const result = await pool.query("SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 40");
  return result.rows.map((row) => ({
    id: row.id,
    actor: row.actor,
    action: row.action,
    entity: row.entity_type,
    entityId: row.entity_id,
    before: row.before_data,
    after: row.after_data,
    createdAt: row.created_at
  }));
}

async function clearAuditLogs() {
  if (!pool) {
    memory.auditLogs = [];
    return { ok: true };
  }
  await pool.query("TRUNCATE TABLE audit_logs");
  return { ok: true };
}

export { audit, clearAuditLogs, listAuditLogs };

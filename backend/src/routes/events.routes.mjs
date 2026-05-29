import {
  createAdminEvent,
  deleteAdminEvent,
  getAdminEvents,
  getPublicEvents,
  updateAdminEvent
} from "../controllers/events.controller.mjs";
import { requireAdmin } from "../middleware/admin.middleware.mjs";

async function handleEventsRoutes(req, res, url) {
  if (url.pathname === "/api/events" && req.method === "GET") {
    await getPublicEvents(req, res);
    return true;
  }

  if (url.pathname === "/api/admin/events") {
    if (!requireAdmin(req, res)) return true;
    if (req.method === "GET") {
      await getAdminEvents(req, res);
      return true;
    }
    if (req.method === "POST") {
      await createAdminEvent(req, res);
      return true;
    }
  }

  const eventMatch = url.pathname.match(/^\/api\/admin\/events\/([^/]+)$/);
  if (eventMatch) {
    if (!requireAdmin(req, res)) return true;
    if (req.method === "PATCH") {
      await updateAdminEvent(req, res, eventMatch[1]);
      return true;
    }
    if (req.method === "DELETE") {
      await deleteAdminEvent(req, res, eventMatch[1]);
      return true;
    }
  }

  return false;
}

export { handleEventsRoutes };

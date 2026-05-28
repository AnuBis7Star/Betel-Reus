import { handleApiRoutes } from "./routes/api.routes.mjs";
import { applySecurityHeaders, handleCorsPreflight, isRateLimited } from "./middleware/security.middleware.mjs";
import { sendError, sendJson } from "./utils/response.mjs";
import { serveStatic } from "./utils/static.mjs";

async function app(req, res) {
  const url = new URL(req.url ?? "/", "http://localhost");
  applySecurityHeaders(req, res);

  if (handleCorsPreflight(req, res)) return;

  try {
    if (url.pathname.startsWith("/api/")) {
      if (isRateLimited(req, res, url)) return;
      await handleApiRoutes(req, res, url);
      return;
    }
    await serveStatic(req, url.pathname, res);
  } catch (error) {
    if (!error.status || error.status >= 500) console.error(error);
    sendError(res, error);
  }
}

export { app };

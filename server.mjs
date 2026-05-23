import { createServer } from "node:http";

import { hasDatabase } from "./src/config/db.mjs";
import { handleApiRoutes } from "./src/routes/api.routes.mjs";
import { sendJson } from "./src/utils/response.mjs";
import { serveStatic } from "./src/utils/static.mjs";

const port = process.env.PORT || 3000;

createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", "http://localhost");
  try {
    if (url.pathname.startsWith("/api/")) {
      await handleApiRoutes(req, res, url);
      return;
    }
    await serveStatic(url.pathname, res);
  } catch (error) {
    sendJson(res, 500, { error: error.message });
  }
}).listen(port, () => {
  console.log(`Biserica Betel Reus running on http://localhost:${port}`);
  console.log(hasDatabase() ? "PostgreSQL connected via DATABASE_URL" : "DATABASE_URL missing; using in-memory demo data");
});

import { handleAdminRoutes } from "./admin.routes.mjs";
import { handleBooksRoutes } from "./books.routes.mjs";
import { handleOrdersRoutes } from "./orders.routes.mjs";
import { handleVerseRoutes } from "./verse.routes.mjs";
import { handleYoutubeRoutes } from "./youtube.routes.mjs";
import { sendJson } from "../utils/response.mjs";

async function handleApiRoutes(req, res, url) {
  if (await handleYoutubeRoutes(req, res, url)) return;
  if (await handleVerseRoutes(req, res, url)) return;
  if (await handleBooksRoutes(req, res, url)) return;
  if (await handleOrdersRoutes(req, res, url)) return;
  if (await handleAdminRoutes(req, res, url)) return;

  sendJson(res, 404, { error: "Not found" });
}

export { handleApiRoutes };

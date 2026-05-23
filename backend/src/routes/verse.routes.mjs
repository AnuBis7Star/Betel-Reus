import { getVerseController } from "../controllers/verse.controller.mjs";

async function handleVerseRoutes(req, res, url) {
  if (url.pathname === "/api/verse" && req.method === "GET") {
    await getVerseController(req, res);
    return true;
  }
  return false;
}

export { handleVerseRoutes };

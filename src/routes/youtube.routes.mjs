import { getYoutubeVideosController } from "../controllers/youtube.controller.mjs";

async function handleYoutubeRoutes(req, res, url) {
  if (url.pathname === "/api/youtube" && req.method === "GET") {
    await getYoutubeVideosController(req, res);
    return true;
  }
  return false;
}

export { handleYoutubeRoutes };

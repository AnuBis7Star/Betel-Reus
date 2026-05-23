import { getYoutubeVideos } from "../services/youtube.service.mjs";
import { sendJson } from "../utils/response.mjs";

async function getYoutubeVideosController(req, res) {
  return sendJson(res, 200, await getYoutubeVideos());
}

export { getYoutubeVideosController };

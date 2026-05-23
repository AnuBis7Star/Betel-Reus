import { getDailyVerse } from "../services/verse.service.mjs";
import { sendJson } from "../utils/response.mjs";

async function getVerseController(req, res) {
  return sendJson(res, 200, getDailyVerse());
}

export { getVerseController };

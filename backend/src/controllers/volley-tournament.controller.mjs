import { getVolleyTournamentState, saveVolleyTournamentState } from "../services/volley-tournament.service.mjs";
import { readJson, sendJson } from "../utils/response.mjs";

const tournamentStateBodyOptions = { maxBytes: 8 * 1024 };

async function getVolleyTournamentStateController(req, res) {
  const record = await getVolleyTournamentState();
  return sendJson(res, 200, record);
}

async function saveVolleyTournamentStateController(req, res) {
  const payload = await readJson(req, tournamentStateBodyOptions);
  const { current } = await saveVolleyTournamentState(payload);
  return sendJson(res, 200, current);
}

export { getVolleyTournamentStateController, saveVolleyTournamentStateController };

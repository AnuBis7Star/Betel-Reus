const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml"
};

function json(payload) {
  return JSON.stringify(payload);
}

function sendJson(res, status, payload) {
  res.writeHead(status, { "Content-Type": mime[".json"], "Cache-Control": "no-store" });
  res.end(json(payload));
}

async function readJson(req) {
  let body = "";
  for await (const chunk of req) body += chunk;
  return body ? JSON.parse(body) : {};
}

export { json, mime, readJson, sendJson };

const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8"
};

function json(payload) {
  return JSON.stringify(payload);
}

function sendJson(res, status, payload) {
  res.writeHead(status, { "Content-Type": mime[".json"], "Cache-Control": "no-store" });
  res.end(json(payload));
}

function httpError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function sendError(res, error) {
  const status = Number(error.status || 500);
  sendJson(res, status, { error: status >= 500 ? "Internal server error" : error.message });
}

async function readJson(req) {
  const contentType = String(req.headers["content-type"] || "");
  if (req.method !== "GET" && req.method !== "DELETE" && contentType && !contentType.includes("application/json")) {
    throw httpError(415, "Unsupported media type");
  }

  const maxBytes = Number(process.env.MAX_JSON_BODY_BYTES || 100 * 1024);
  let bytes = 0;
  let body = "";
  for await (const chunk of req) {
    bytes += chunk.length;
    if (bytes > maxBytes) throw httpError(413, "Request body too large");
    body += chunk;
  }
  try {
    return body ? JSON.parse(body) : {};
  } catch {
    throw httpError(400, "Invalid JSON body");
  }
}

export { httpError, json, mime, readJson, sendError, sendJson };

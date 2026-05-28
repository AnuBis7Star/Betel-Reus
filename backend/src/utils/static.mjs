import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";

import { mime } from "./response.mjs";

const root = fileURLToPath(new URL("../../..", import.meta.url));
const publicDir = join(root, "frontend", "public");
const compressedTypes = new Set([".html", ".css", ".js", ".json", ".svg"]);
const immutableTypes = new Set([".png", ".jpg", ".jpeg", ".svg"]);

function cacheControl(ext) {
  if (ext === ".html") return "no-cache";
  if (immutableTypes.has(ext)) return "public, max-age=31536000, immutable";
  if (ext === ".css" || ext === ".js") return "no-cache";
  return "public, max-age=300";
}

function acceptsGzip(req) {
  return String(req.headers["accept-encoding"] || "").includes("gzip");
}

function sendFile(req, res, filePath, file) {
  const ext = extname(filePath);
  const headers = {
    "Content-Type": mime[ext] ?? "application/octet-stream",
    "Cache-Control": cacheControl(ext)
  };
  let body = file;

  if (compressedTypes.has(ext) && acceptsGzip(req)) {
    body = gzipSync(file);
    headers["Content-Encoding"] = "gzip";
    headers.Vary = "Accept-Encoding";
  }

  res.writeHead(200, headers);
  res.end(req.method === "HEAD" ? undefined : body);
}

async function serveStatic(req, pathname, res) {
  const safePath = normalize(decodeURIComponent(pathname)).replace(/^(\.\.[/\\])+/, "");
  const filePath = join(publicDir, safePath === "/" ? "index.html" : safePath);
  if (!filePath.startsWith(publicDir)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  try {
    const file = await readFile(filePath);
    sendFile(req, res, filePath, file);
  } catch {
    const indexPath = join(publicDir, "index.html");
    const index = await readFile(indexPath);
    sendFile(req, res, indexPath, index);
  }
}

export { serveStatic };

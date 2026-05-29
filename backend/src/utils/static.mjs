import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { brotliCompressSync, constants, gzipSync } from "node:zlib";

import { mime } from "./response.mjs";

const root = fileURLToPath(new URL("../../..", import.meta.url));
const publicDir = join(root, "frontend", "public");
const compressedTypes = new Set([".html", ".css", ".js", ".json", ".svg", ".txt", ".xml"]);
const immutableTypes = new Set([".png", ".jpg", ".jpeg", ".svg"]);
const compressedCache = new Map();

function cacheControl(ext, searchParams = new URLSearchParams()) {
  if (ext === ".html") return "no-cache";
  if (searchParams.has("v")) return "public, max-age=31536000, immutable";
  if (immutableTypes.has(ext)) return "public, max-age=31536000, immutable";
  if (ext === ".css" || ext === ".js") return "public, max-age=86400, must-revalidate";
  return "public, max-age=300";
}

function acceptsEncoding(req, encoding) {
  return String(req.headers["accept-encoding"] || "").includes(encoding);
}

function compressedBody(filePath, file, encoding) {
  const key = `${encoding}:${filePath}:${file.length}`;
  const cached = compressedCache.get(key);
  if (cached) return cached;
  const compressed = encoding === "br"
    ? brotliCompressSync(file, { params: { [constants.BROTLI_PARAM_QUALITY]: 5 } })
    : gzipSync(file);
  compressedCache.set(key, compressed);
  return compressed;
}

function sendFile(req, res, filePath, file, searchParams) {
  const ext = extname(filePath);
  const headers = {
    "Content-Type": mime[ext] ?? "application/octet-stream",
    "Cache-Control": cacheControl(ext, searchParams)
  };
  let body = file;

  if (compressedTypes.has(ext) && acceptsEncoding(req, "br")) {
    body = compressedBody(filePath, file, "br");
    headers["Content-Encoding"] = "br";
    headers.Vary = "Accept-Encoding";
  } else if (compressedTypes.has(ext) && acceptsEncoding(req, "gzip")) {
    body = compressedBody(filePath, file, "gzip");
    headers["Content-Encoding"] = "gzip";
    headers.Vary = "Accept-Encoding";
  }

  headers["Content-Length"] = body.length;
  res.writeHead(200, headers);
  res.end(req.method === "HEAD" ? undefined : body);
}

async function serveStatic(req, url, res) {
  const pathname = typeof url === "string" ? url : url.pathname;
  const searchParams = typeof url === "string" ? new URLSearchParams() : url.searchParams;
  const safePath = normalize(decodeURIComponent(pathname)).replace(/^(\.\.[/\\])+/, "");
  const filePath = join(publicDir, safePath === "/" ? "index.html" : safePath);
  if (!filePath.startsWith(publicDir)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  try {
    const file = await readFile(filePath);
    sendFile(req, res, filePath, file, searchParams);
  } catch {
    const indexPath = join(publicDir, "index.html");
    const index = await readFile(indexPath);
    sendFile(req, res, indexPath, index, new URLSearchParams());
  }
}

export { serveStatic };

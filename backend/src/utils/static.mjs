import { readFile } from "node:fs/promises";
import { extname, join, normalize, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { brotliCompressSync, constants, gzipSync } from "node:zlib";

import { mime } from "./response.mjs";

const root = fileURLToPath(new URL("../../..", import.meta.url));
const publicDir = join(root, "frontend", "public");
const defaultUploadsDir = join(publicDir, "uploads", "events");
const uploadsDir = resolve(process.env.UPLOADS_DIR || defaultUploadsDir);
const uploadPublicPath = normalizePublicPath(process.env.UPLOADS_PUBLIC_PATH || "/uploads/events");
const compressedTypes = new Set([".html", ".css", ".js", ".json", ".svg", ".txt", ".xml"]);
const immutableTypes = new Set([".png", ".jpg", ".jpeg", ".svg"]);
const compressedCache = new Map();

function normalizePublicPath(value) {
  const normalized = `/${String(value || "").replace(/^\/+|\/+$/g, "")}`;
  return normalized === "/" ? "/uploads/events" : normalized;
}

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

function isInsideDir(filePath, dirPath) {
  return filePath === dirPath || filePath.startsWith(`${dirPath}${sep}`);
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

async function serveUploadedFile(req, url, res) {
  const pathname = typeof url === "string" ? url : url.pathname;
  const searchParams = typeof url === "string" ? new URLSearchParams() : url.searchParams;
  if (!pathname.startsWith(`${uploadPublicPath}/`)) return false;

  const relativePath = normalize(decodeURIComponent(pathname.slice(uploadPublicPath.length + 1)).replaceAll("\\", "/"));
  if (!relativePath || relativePath.startsWith("..") || relativePath.startsWith("/")) {
    res.writeHead(403);
    res.end("Forbidden");
    return true;
  }

  const candidatePaths = [resolve(uploadsDir, relativePath)];
  const fallbackPath = resolve(defaultUploadsDir, relativePath);
  if (fallbackPath !== candidatePaths[0]) candidatePaths.push(fallbackPath);

  for (const filePath of candidatePaths) {
    const baseDir = isInsideDir(filePath, uploadsDir) ? uploadsDir : defaultUploadsDir;
    if (!isInsideDir(filePath, baseDir)) continue;
    try {
      const file = await readFile(filePath);
      sendFile(req, res, filePath, file, searchParams);
      return true;
    } catch {
      // Try next upload location.
    }
  }

  res.writeHead(404);
  res.end("Not found");
  return true;
}

export { serveStatic, serveUploadedFile };

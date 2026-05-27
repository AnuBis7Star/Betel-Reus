import { sendJson } from "../utils/response.mjs";

const rateBuckets = new Map();

function allowedOrigins() {
  return String(process.env.CORS_ORIGIN || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

function applySecurityHeaders(req, res) {
  const origin = req.headers.origin;
  const origins = allowedOrigins();
  if (origin && origins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }

  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  res.setHeader("Cross-Origin-Resource-Policy", "same-origin");
}

function handleCorsPreflight(req, res) {
  if (req.method !== "OPTIONS") return false;
  res.writeHead(204, {
    "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, x-admin-code",
    "Access-Control-Max-Age": "86400"
  });
  res.end();
  return true;
}

function clientIp(req) {
  return String(req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown").split(",")[0].trim();
}

function rateProfile(req, url) {
  const windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS || 60000);
  if (url.pathname.startsWith("/api/admin/")) return { name: "admin", limit: Number(process.env.ADMIN_RATE_LIMIT_MAX || 120), windowMs };
  if (url.pathname === "/api/volley/registrations") return { name: "volley", limit: Number(process.env.VOLLEY_RATE_LIMIT_MAX || 6), windowMs };
  if (url.pathname === "/api/orders") return { name: "orders", limit: Number(process.env.ORDER_RATE_LIMIT_MAX || 12), windowMs };
  return { name: "api", limit: Number(process.env.RATE_LIMIT_MAX || 240), windowMs };
}

function isRateLimited(req, res, url) {
  const profile = rateProfile(req, url);
  const key = `${profile.name}:${clientIp(req)}`;
  const now = Date.now();
  const current = rateBuckets.get(key);

  if (!current || current.resetAt <= now) {
    rateBuckets.set(key, { count: 1, resetAt: now + profile.windowMs });
    return false;
  }

  current.count += 1;
  if (current.count <= profile.limit) return false;

  res.setHeader("Retry-After", String(Math.ceil((current.resetAt - now) / 1000)));
  sendJson(res, 429, { error: "Too many requests" });
  return true;
}

export { applySecurityHeaders, handleCorsPreflight, isRateLimited };

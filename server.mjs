import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL(".", import.meta.url));
const publicDir = join(root, "public");
const channelId = "UC6dl7mk7XE_VMqBNZqWOjig";
const adminCode = process.env.ADMIN_CODE || "ADMIN-BETEL";

let pool;
if (process.env.DATABASE_URL) {
  const { Pool } = await import("pg");
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_SSL === "false" ? false : { rejectUnauthorized: false }
  });
}

const memory = {
  books: [
    { id: randomUUID(), title: "Viața condusă de scopuri", author: "Rick Warren", category: "General", language: "ro", stock: 4, reserved: 0, price: 12.5 },
    { id: randomUUID(), title: "Creștinul autentic", author: "John Stott", category: "General", language: "ro", stock: 2, reserved: 0, price: 9.99 },
    { id: randomUUID(), title: "Rugăciunea", author: "Timothy Keller", category: "General", language: "ro", stock: 1, reserved: 0, price: 14 },
    { id: randomUUID(), title: "Biblia pentru copii", author: "Resurse familie", category: "Copii", language: "ro", stock: 6, reserved: 0, price: 18 }
  ],
  orders: [],
  auditLogs: []
};

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

const dailyVerses = [
  { reference: "Psalmul 23:1", ro: "Domnul este Păstorul meu: nu voi duce lipsă de nimic.", es: "El Señor es mi pastor; nada me faltará." },
  { reference: "Ioan 3:16", ro: "Fiindcă atât de mult a iubit Dumnezeu lumea, că a dat pe singurul Lui Fiu.", es: "Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito." },
  { reference: "Isaia 41:10", ro: "Nu te teme, căci Eu sunt cu tine; nu te uita cu îngrijorare, căci Eu sunt Dumnezeul tău.", es: "No temas, porque yo estoy contigo; no desmayes, porque yo soy tu Dios." },
  { reference: "Filipeni 4:13", ro: "Pot totul în Hristos, care mă întărește.", es: "Todo lo puedo en Cristo que me fortalece." },
  { reference: "Romani 8:28", ro: "Toate lucrurile lucrează împreună spre binele celor ce iubesc pe Dumnezeu.", es: "Todas las cosas ayudan a bien a los que aman a Dios." },
  { reference: "Matei 11:28", ro: "Veniți la Mine, toți cei trudiți și împovărați, și Eu vă voi da odihnă.", es: "Venid a mí todos los que estáis trabajados y cargados, y yo os haré descansar." },
  { reference: "Psalmul 46:1", ro: "Dumnezeu este adăpostul și sprijinul nostru, un ajutor care nu lipsește niciodată în nevoi.", es: "Dios es nuestro amparo y fortaleza, nuestro pronto auxilio en las tribulaciones." }
];

function escapeHtml(value = "") {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function tagValue(xml, tag) {
  const match = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`));
  return match?.[1]?.replaceAll("<![CDATA[", "").replaceAll("]]>", "").trim() ?? "";
}

function parseVideos(xml) {
  const entries = xml.match(/<entry>[\s\S]*?<\/entry>/g) ?? [];
  return entries.slice(0, 30).map((entry) => {
    const id = tagValue(entry, "yt:videoId");
    return {
      id,
      title: tagValue(entry, "title"),
      published: tagValue(entry, "published"),
      description: tagValue(entry, "media:description"),
      thumbnail: entry.match(/<media:thumbnail[^>]*url="([^"]+)"/)?.[1] ?? `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
      url: `https://www.youtube.com/watch?v=${id}`
    };
  });
}

async function youtubeResponse() {
  const response = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`);
  if (!response.ok) throw new Error(`YouTube RSS failed: ${response.status}`);
  return json({ source: "youtube-rss", videos: parseVideos(await response.text()) });
}

function verseResponse() {
  const start = Date.UTC(new Date().getUTCFullYear(), 0, 0);
  const day = Math.floor((Date.now() - start) / 86400000);
  return json({ source: "local-fallback", verse: dailyVerses[day % dailyVerses.length] });
}

function json(payload) {
  return JSON.stringify(payload);
}

function sendJson(res, status, payload) {
  res.writeHead(status, { "Content-Type": mime[".json"], "Cache-Control": "no-store" });
  res.end(json(payload));
}

function requireAdmin(req, res) {
  if (req.headers["x-admin-code"] === adminCode) return true;
  sendJson(res, 401, { error: "Unauthorized" });
  return false;
}

async function readJson(req) {
  let body = "";
  for await (const chunk of req) body += chunk;
  return body ? JSON.parse(body) : {};
}

const romanianTitleCorrections = {
  "Viata condusa de scopuri": "Viața condusă de scopuri",
  "Crestinul autentic": "Creștinul autentic",
  Rugaciunea: "Rugăciunea"
};

function bookFromRow(row) {
  return {
    id: row.id,
    title: romanianTitleCorrections[row.title] || row.title,
    author: row.author,
    category: row.category,
    language: row.language,
    stock: Number(row.stock || 0),
    reserved: Number(row.reserved || 0),
    price: Number(row.price || 0)
  };
}

function orderFromRow(row) {
  const items = Array.isArray(row.items)
    ? row.items.map((item) => ({ ...item, title: romanianTitleCorrections[item.title] || item.title }))
    : [];
  return {
    id: row.id,
    member: row.member_name,
    contact: row.contact,
    status: row.status,
    total: Number(row.total || 0),
    fulfilled: Boolean(row.fulfilled),
    createdAt: row.created_at,
    items
  };
}

async function audit(action, entityType, entityId, beforeData, afterData, actor = "admin") {
  if (pool) {
    await pool.query(
      "INSERT INTO audit_logs (actor, action, entity_type, entity_id, before_data, after_data) VALUES ($1, $2, $3, $4, $5, $6)",
      [actor, action, entityType, entityId, beforeData, afterData]
    );
    return;
  }
  memory.auditLogs.unshift({ id: randomUUID(), actor, action, entity: entityType, entityId, before: beforeData, after: afterData, createdAt: new Date().toISOString() });
}

async function listBooks() {
  if (!pool) return memory.books;
  const result = await pool.query("SELECT * FROM books WHERE active = true ORDER BY title ASC");
  return result.rows.map(bookFromRow);
}

async function createOrder(payload) {
  const items = Array.isArray(payload.items) ? payload.items : [];
  if (!payload.member || items.length === 0) throw new Error("member and items are required");

  if (!pool) {
    const normalizedItems = items.map((item) => {
      const book = memory.books.find((entry) => entry.id === item.id);
      if (!book) throw new Error(`Book not found: ${item.id}`);
      const quantity = Number(item.quantity || 1);
      if (Number(book.stock) - Number(book.reserved) < quantity) throw new Error(`Not enough stock: ${book.title}`);
      return { id: book.id, title: romanianTitleCorrections[book.title] || book.title, quantity, price: book.price };
    });
    const total = normalizedItems.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1), 0);
    const order = { id: randomUUID(), member: payload.member, contact: payload.contact || "biblioteca", status: "pending", total, fulfilled: false, createdAt: new Date().toISOString(), items: normalizedItems };
    memory.orders.unshift(order);
    await audit("Cerere trimisă de membru", "order", order.id, null, order, payload.member);
    return order;
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const booksResult = await client.query("SELECT * FROM books WHERE id = ANY($1::uuid[]) AND active = true FOR UPDATE", [items.map((item) => item.id)]);
    const booksById = new Map(booksResult.rows.map((row) => [row.id, row]));
    let total = 0;

    for (const item of items) {
      const book = booksById.get(item.id);
      if (!book) throw new Error(`Book not found: ${item.id}`);
      const quantity = Number(item.quantity || 1);
      if (Number(book.stock) - Number(book.reserved) < quantity) throw new Error(`Not enough stock: ${book.title}`);
      total += Number(book.price) * quantity;
    }

    const orderResult = await client.query(
      "INSERT INTO orders (member_name, contact, total) VALUES ($1, $2, $3) RETURNING *",
      [payload.member, payload.contact || "biblioteca", total]
    );
    const order = orderResult.rows[0];

    for (const item of items) {
      const book = booksById.get(item.id);
      const quantity = Number(item.quantity || 1);
      await client.query(
        "INSERT INTO order_items (order_id, book_id, title, quantity, price) VALUES ($1, $2, $3, $4, $5)",
        [order.id, book.id, romanianTitleCorrections[book.title] || book.title, quantity, book.price]
      );
    }

    await client.query(
      "INSERT INTO audit_logs (actor, action, entity_type, entity_id, after_data) VALUES ($1, $2, $3, $4, $5)",
      [payload.member, "Cerere trimisă de membru", "order", order.id, { ...payload, total }]
    );
    await client.query("COMMIT");
    return { ...orderFromRow({ ...order, items }), items };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

async function listOrders(activeOnly = false) {
  if (!pool) {
    return memory.orders.filter((order) => !activeOnly || !["collected", "cancelled"].includes(order.status));
  }
  const statusClause = activeOnly ? "WHERE o.status NOT IN ('collected', 'cancelled')" : "";
  const result = await pool.query(`
    SELECT o.*, COALESCE(json_agg(json_build_object(
      'id', oi.id,
      'bookId', oi.book_id,
      'title', oi.title,
      'quantity', oi.quantity,
      'price', oi.price
    ) ORDER BY oi.title) FILTER (WHERE oi.id IS NOT NULL), '[]') AS items
    FROM orders o
    LEFT JOIN order_items oi ON oi.order_id = o.id
    ${statusClause}
    GROUP BY o.id
    ORDER BY o.created_at DESC
  `);
  return result.rows.map(orderFromRow);
}

async function listAuditLogs() {
  if (!pool) return memory.auditLogs.slice(0, 40);
  const result = await pool.query("SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 40");
  return result.rows.map((row) => ({
    id: row.id,
    actor: row.actor,
    action: row.action,
    entity: row.entity_type,
    entityId: row.entity_id,
    before: row.before_data,
    after: row.after_data,
    createdAt: row.created_at
  }));
}

async function createBook(payload) {
  const book = normalizeBookPayload(payload);
  if (!pool) {
    const created = { id: randomUUID(), ...book };
    memory.books.unshift(created);
    await audit("Carte creată", "book", created.id, null, created);
    return created;
  }
  const result = await pool.query(
    "INSERT INTO books (title, author, category, language, stock, reserved, price) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
    [book.title, book.author, book.category, book.language, book.stock, book.reserved, book.price]
  );
  const created = bookFromRow(result.rows[0]);
  await audit("Carte creată", "book", created.id, null, created);
  return created;
}

async function createBooks(payloads) {
  const books = payloads.map(normalizeBookPayload).filter((book) => book.title && book.author);
  if (books.length === 0) throw new Error("No valid books provided");

  if (!pool) {
    const created = books.map((book) => ({ id: randomUUID(), ...book }));
    memory.books.unshift(...created);
    await audit("Cărți importate", "book", null, null, created);
    return created;
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const created = [];
    for (const book of books) {
      const result = await client.query(
        "INSERT INTO books (title, author, category, language, stock, reserved, price) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
        [book.title, book.author, book.category, book.language, book.stock, book.reserved, book.price]
      );
      created.push(bookFromRow(result.rows[0]));
    }
    await client.query(
      "INSERT INTO audit_logs (actor, action, entity_type, before_data, after_data) VALUES ($1, $2, $3, $4, $5)",
      ["admin", "Cărți importate", "book", null, created]
    );
    await client.query("COMMIT");
    return created;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

async function updateBook(id, payload) {
  const book = normalizeBookPayload(payload);
  if (!pool) {
    const index = memory.books.findIndex((item) => item.id === id);
    if (index === -1) throw new Error("Book not found");
    const before = { ...memory.books[index] };
    memory.books[index] = { ...memory.books[index], ...book };
    await audit("Carte actualizată", "book", id, before, memory.books[index]);
    return memory.books[index];
  }
  const before = await pool.query("SELECT * FROM books WHERE id = $1", [id]);
  const result = await pool.query(
    "UPDATE books SET title = $1, author = $2, category = $3, language = $4, stock = $5, reserved = $6, price = $7, updated_at = now() WHERE id = $8 RETURNING *",
    [book.title, book.author, book.category, book.language, book.stock, book.reserved, book.price, id]
  );
  if (!result.rowCount) throw new Error("Book not found");
  const updated = bookFromRow(result.rows[0]);
  await audit("Carte actualizată", "book", id, before.rows[0] ? bookFromRow(before.rows[0]) : null, updated);
  return updated;
}

async function adjustBookStock(id, delta) {
  if (!pool) {
    const book = memory.books.find((item) => item.id === id);
    if (!book) throw new Error("Book not found");
    const before = { ...book };
    book.stock = Math.max(Number(book.reserved || 0), Number(book.stock || 0) + delta);
    await audit(`Inventar: ${delta > 0 ? "plus" : "minus"}`, "book", id, before, book);
    return book;
  }
  const before = await pool.query("SELECT * FROM books WHERE id = $1", [id]);
  const result = await pool.query(
    "UPDATE books SET stock = GREATEST(reserved, stock + $1), updated_at = now() WHERE id = $2 RETURNING *",
    [delta, id]
  );
  if (!result.rowCount) throw new Error("Book not found");
  const updated = bookFromRow(result.rows[0]);
  await audit(`Inventar: ${delta > 0 ? "plus" : "minus"}`, "book", id, before.rows[0] ? bookFromRow(before.rows[0]) : null, updated);
  return updated;
}

async function deleteBook(id) {
  if (!pool) {
    const before = memory.books.find((item) => item.id === id);
    memory.books = memory.books.filter((item) => item.id !== id);
    await audit("Carte ștearsă", "book", id, before, null);
    return { ok: true };
  }
  const before = await pool.query("SELECT * FROM books WHERE id = $1", [id]);
  await pool.query("UPDATE books SET active = false, updated_at = now() WHERE id = $1", [id]);
  await audit("Carte ștearsă", "book", id, before.rows[0] ? bookFromRow(before.rows[0]) : null, null);
  return { ok: true };
}

function normalizeBookPayload(payload) {
  return {
    title: String(payload.title || "").trim(),
    author: String(payload.author || "").trim(),
    category: String(payload.category || "General").trim() || "General",
    language: String(payload.language || "ro"),
    stock: Math.max(0, Number(payload.stock || 0)),
    reserved: Math.max(0, Number(payload.reserved || 0)),
    price: Math.max(0, Number(payload.price || 0))
  };
}

async function updateOrderStatus(id, status) {
  if (!["pending", "approved", "collected", "cancelled"].includes(status)) throw new Error("Invalid status");
  if (!pool) {
    const order = memory.orders.find((item) => item.id === id);
    if (!order) throw new Error("Order not found");
    const before = { ...order };
    order.status = status;
    if (status === "collected" && !order.fulfilled) {
      for (const item of order.items) {
        const book = memory.books.find((entry) => entry.id === item.id || entry.title === item.title);
        if (book) book.stock = Math.max(0, book.stock - Number(item.quantity || 1));
      }
      order.fulfilled = true;
    }
    await audit(`Cerere marcată ca ${status}`, "order", id, before, order);
    return order;
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const orderResult = await client.query("SELECT * FROM orders WHERE id = $1 FOR UPDATE", [id]);
    if (!orderResult.rowCount) throw new Error("Order not found");
    const before = orderResult.rows[0];

    if (status === "collected" && !before.fulfilled) {
      const items = await client.query("SELECT * FROM order_items WHERE order_id = $1", [id]);
      for (const item of items.rows) {
        if (item.book_id) {
          await client.query("UPDATE books SET stock = GREATEST(0, stock - $1), updated_at = now() WHERE id = $2", [item.quantity, item.book_id]);
        }
      }
    }

    const updatedResult = await client.query(
      "UPDATE orders SET status = $1, fulfilled = CASE WHEN $1 = 'collected' THEN true ELSE fulfilled END, updated_at = now() WHERE id = $2 RETURNING *",
      [status, id]
    );
    await client.query(
      "INSERT INTO audit_logs (actor, action, entity_type, entity_id, before_data, after_data) VALUES ($1, $2, $3, $4, $5, $6)",
      ["admin", `Cerere marcată ca ${status}`, "order", id, before, updatedResult.rows[0]]
    );
    await client.query("COMMIT");
    return orderFromRow({ ...updatedResult.rows[0], items: [] });
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

async function serveApi(req, res, url) {
  if (url.pathname === "/api/youtube") return res.end(await youtubeResponse());
  if (url.pathname === "/api/verse") return res.end(verseResponse());
  if (url.pathname === "/api/books" && req.method === "GET") return sendJson(res, 200, { source: pool ? "postgres" : "memory", books: await listBooks() });
  if (url.pathname === "/api/orders" && req.method === "POST") return sendJson(res, 201, { order: await createOrder(await readJson(req)) });

  if (url.pathname === "/api/admin/books" && req.method === "POST") {
    if (!requireAdmin(req, res)) return;
    return sendJson(res, 201, { book: await createBook(await readJson(req)) });
  }

  if (url.pathname === "/api/admin/books/bulk" && req.method === "POST") {
    if (!requireAdmin(req, res)) return;
    const body = await readJson(req);
    return sendJson(res, 201, { books: await createBooks(body.books || []) });
  }

  const bookMatch = url.pathname.match(/^\/api\/admin\/books\/([^/]+)$/);
  if (bookMatch) {
    if (!requireAdmin(req, res)) return;
    if (req.method === "PATCH") return sendJson(res, 200, { book: await updateBook(bookMatch[1], await readJson(req)) });
    if (req.method === "DELETE") return sendJson(res, 200, await deleteBook(bookMatch[1]));
  }

  const stockMatch = url.pathname.match(/^\/api\/admin\/books\/([^/]+)\/stock$/);
  if (stockMatch && req.method === "PATCH") {
    if (!requireAdmin(req, res)) return;
    const body = await readJson(req);
    return sendJson(res, 200, { book: await adjustBookStock(stockMatch[1], Number(body.delta || 0)) });
  }

  if (url.pathname === "/api/admin/orders" && req.method === "GET") {
    if (!requireAdmin(req, res)) return;
    return sendJson(res, 200, { orders: await listOrders(url.searchParams.get("active") === "true") });
  }

  const orderMatch = url.pathname.match(/^\/api\/admin\/orders\/([^/]+)$/);
  if (orderMatch && req.method === "PATCH") {
    if (!requireAdmin(req, res)) return;
    const body = await readJson(req);
    return sendJson(res, 200, { order: await updateOrderStatus(orderMatch[1], body.status) });
  }

  if (url.pathname === "/api/admin/audit" && req.method === "GET") {
    if (!requireAdmin(req, res)) return;
    return sendJson(res, 200, { auditLogs: await listAuditLogs() });
  }

  sendJson(res, 404, { error: "Not found" });
}

async function serveStatic(pathname, res) {
  const safePath = normalize(decodeURIComponent(pathname)).replace(/^(\.\.[/\\])+/, "");
  const filePath = join(publicDir, safePath === "/" ? "index.html" : safePath);
  if (!filePath.startsWith(publicDir)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  try {
    const file = await readFile(filePath);
    res.writeHead(200, { "Content-Type": mime[extname(filePath)] ?? "application/octet-stream" });
    res.end(file);
  } catch {
    const index = await readFile(join(publicDir, "index.html"));
    res.writeHead(200, { "Content-Type": mime[".html"] });
    res.end(index);
  }
}

createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", "http://localhost");
  try {
    if (url.pathname.startsWith("/api/")) {
      res.setHeader("Content-Type", mime[".json"]);
      await serveApi(req, res, url);
      return;
    }
    await serveStatic(escapeHtml(url.pathname), res);
  } catch (error) {
    sendJson(res, 500, { error: error.message });
  }
}).listen(process.env.PORT || 3000, () => {
  console.log(`Biserica Betel Reus running on http://localhost:${process.env.PORT || 3000}`);
  console.log(pool ? "PostgreSQL connected via DATABASE_URL" : "DATABASE_URL missing; using in-memory demo data");
});

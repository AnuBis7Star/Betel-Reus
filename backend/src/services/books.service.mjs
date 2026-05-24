import { randomUUID } from "node:crypto";

import { memory } from "../config/memory.mjs";
import { pool } from "../config/db.mjs";
import { audit } from "./audit.service.mjs";
import { httpError } from "../utils/response.mjs";
import { bookFromRow, isValidUuid, normalizeBookPayload } from "../utils/helpers.mjs";

async function listBooks() {
  if (!pool) return memory.books;
  const result = await pool.query("SELECT * FROM books WHERE active = true ORDER BY title ASC");
  return result.rows.map(bookFromRow);
}

async function createBook(payload) {
  const book = normalizeBookPayload(payload);
  if (!book.title || !book.author) throw httpError(400, "title and author are required");
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
  if (!Array.isArray(payloads) || payloads.length > 200) throw httpError(400, "Invalid bulk import");
  const books = payloads.map(normalizeBookPayload).filter((book) => book.title && book.author);
  if (books.length === 0) throw httpError(400, "No valid books provided");

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
      ["admin", "Cărți importate", "book", null, JSON.stringify(created)]
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
  if (pool && !isValidUuid(id)) throw httpError(400, "Invalid book id");
  const book = normalizeBookPayload(payload);
  if (!book.title || !book.author) throw httpError(400, "title and author are required");
  if (!pool) {
    const index = memory.books.findIndex((item) => item.id === id);
    if (index === -1) throw httpError(404, "Book not found");
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
  if (!result.rowCount) throw httpError(404, "Book not found");
  const updated = bookFromRow(result.rows[0]);
  await audit("Carte actualizată", "book", id, before.rows[0] ? bookFromRow(before.rows[0]) : null, updated);
  return updated;
}

async function adjustBookStock(id, delta) {
  if (pool && !isValidUuid(id)) throw httpError(400, "Invalid book id");
  if (!Number.isFinite(delta) || Math.abs(delta) > 1000) throw httpError(400, "Invalid stock delta");
  if (!pool) {
    const book = memory.books.find((item) => item.id === id);
    if (!book) throw httpError(404, "Book not found");
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
  if (!result.rowCount) throw httpError(404, "Book not found");
  const updated = bookFromRow(result.rows[0]);
  await audit(`Inventar: ${delta > 0 ? "plus" : "minus"}`, "book", id, before.rows[0] ? bookFromRow(before.rows[0]) : null, updated);
  return updated;
}

async function deleteBook(id) {
  if (pool && !isValidUuid(id)) throw httpError(400, "Invalid book id");
  if (!pool) {
    const before = memory.books.find((item) => item.id === id);
    if (!before) throw httpError(404, "Book not found");
    memory.books = memory.books.filter((item) => item.id !== id);
    await audit("Carte ștearsă", "book", id, before, null);
    return { ok: true };
  }
  const before = await pool.query("SELECT * FROM books WHERE id = $1", [id]);
  const result = await pool.query("UPDATE books SET active = false, updated_at = now() WHERE id = $1", [id]);
  if (!result.rowCount) throw httpError(404, "Book not found");
  await audit("Carte ștearsă", "book", id, before.rows[0] ? bookFromRow(before.rows[0]) : null, null);
  return { ok: true };
}

export { adjustBookStock, createBook, createBooks, deleteBook, listBooks, updateBook };

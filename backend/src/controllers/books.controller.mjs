import { hasDatabase } from "../config/db.mjs";
import { adjustBookStock, createBook, createBooks, deleteBook, listBooks, updateBook } from "../services/books.service.mjs";
import { readJson, sendJson } from "../utils/response.mjs";

async function getBooks(req, res) {
  return sendJson(res, 200, { source: hasDatabase() ? "postgres" : "memory", books: await listBooks() });
}

async function createAdminBook(req, res) {
  return sendJson(res, 201, { book: await createBook(await readJson(req)) });
}

async function createAdminBooksBulk(req, res) {
  const body = await readJson(req);
  return sendJson(res, 201, { books: await createBooks(body.books || []) });
}

async function updateAdminBook(req, res, id) {
  return sendJson(res, 200, { book: await updateBook(id, await readJson(req)) });
}

async function deleteAdminBook(req, res, id) {
  return sendJson(res, 200, await deleteBook(id));
}

async function updateAdminBookStock(req, res, id) {
  const body = await readJson(req);
  return sendJson(res, 200, { book: await adjustBookStock(id, Number(body.delta || 0)) });
}

export {
  createAdminBook,
  createAdminBooksBulk,
  deleteAdminBook,
  getBooks,
  updateAdminBook,
  updateAdminBookStock
};

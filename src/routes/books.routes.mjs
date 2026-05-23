import {
  createAdminBook,
  createAdminBooksBulk,
  deleteAdminBook,
  getBooks,
  updateAdminBook,
  updateAdminBookStock
} from "../controllers/books.controller.mjs";
import { requireAdmin } from "../middleware/admin.middleware.mjs";

async function handleBooksRoutes(req, res, url) {
  if (url.pathname === "/api/books" && req.method === "GET") {
    await getBooks(req, res);
    return true;
  }

  if (url.pathname === "/api/admin/books" && req.method === "POST") {
    if (!requireAdmin(req, res)) return true;
    await createAdminBook(req, res);
    return true;
  }

  if (url.pathname === "/api/admin/books/bulk" && req.method === "POST") {
    if (!requireAdmin(req, res)) return true;
    await createAdminBooksBulk(req, res);
    return true;
  }

  const stockMatch = url.pathname.match(/^\/api\/admin\/books\/([^/]+)\/stock$/);
  if (stockMatch && req.method === "PATCH") {
    if (!requireAdmin(req, res)) return true;
    await updateAdminBookStock(req, res, stockMatch[1]);
    return true;
  }

  const bookMatch = url.pathname.match(/^\/api\/admin\/books\/([^/]+)$/);
  if (bookMatch) {
    if (!requireAdmin(req, res)) return true;
    if (req.method === "PATCH") {
      await updateAdminBook(req, res, bookMatch[1]);
      return true;
    }
    if (req.method === "DELETE") {
      await deleteAdminBook(req, res, bookMatch[1]);
      return true;
    }
  }

  return false;
}

export { handleBooksRoutes };

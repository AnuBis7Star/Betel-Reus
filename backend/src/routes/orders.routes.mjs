import { createOrderController, getAdminOrders, updateAdminOrderStatus } from "../controllers/orders.controller.mjs";
import { requireAdmin } from "../middleware/admin.middleware.mjs";

async function handleOrdersRoutes(req, res, url) {
  if (url.pathname === "/api/orders" && req.method === "POST") {
    await createOrderController(req, res);
    return true;
  }

  if (url.pathname === "/api/admin/orders" && req.method === "GET") {
    if (!requireAdmin(req, res)) return true;
    await getAdminOrders(req, res, url);
    return true;
  }

  const orderMatch = url.pathname.match(/^\/api\/admin\/orders\/([^/]+)$/);
  if (orderMatch && req.method === "PATCH") {
    if (!requireAdmin(req, res)) return true;
    await updateAdminOrderStatus(req, res, orderMatch[1]);
    return true;
  }

  return false;
}

export { handleOrdersRoutes };

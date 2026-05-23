import { createOrder, listOrders, updateOrderStatus } from "../services/orders.service.mjs";
import { readJson, sendJson } from "../utils/response.mjs";

async function createOrderController(req, res) {
  return sendJson(res, 201, { order: await createOrder(await readJson(req)) });
}

async function getAdminOrders(req, res, url) {
  return sendJson(res, 200, { orders: await listOrders(url.searchParams.get("active") === "true") });
}

async function updateAdminOrderStatus(req, res, id) {
  const body = await readJson(req);
  return sendJson(res, 200, { order: await updateOrderStatus(id, body.status) });
}

export { createOrderController, getAdminOrders, updateAdminOrderStatus };

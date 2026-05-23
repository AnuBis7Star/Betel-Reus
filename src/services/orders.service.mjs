import { randomUUID } from "node:crypto";

import { memory } from "../config/memory.mjs";
import { pool } from "../config/db.mjs";
import { audit } from "./audit.service.mjs";
import { orderFromRow, romanianTitleCorrections } from "../utils/helpers.mjs";

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

async function updateOrderStatus(id, status) {
  if (!["pending", "approved", "collected", "cancelled"].includes(status)) throw new Error("Invalid status");
  if (!pool) {
    const order = memory.orders.find((item) => item.id === id);
    if (!order) throw new Error("Order not found");
    if (order.status === status || ["collected", "cancelled"].includes(order.status)) return order;
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
    if (before.status === status || ["collected", "cancelled"].includes(before.status)) {
      await client.query("COMMIT");
      return orderFromRow({ ...before, items: [] });
    }

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

export { createOrder, listOrders, updateOrderStatus };

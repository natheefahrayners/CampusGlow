import db from "../config/db.js";

export const getAllOrders = async () => {
  const [rows] = await db.execute("SELECT * FROM orders ORDER BY order_date DESC");
  return rows;
};

export const getOrderById = async (orderId) => {
  const [rows] = await db.execute("SELECT * FROM orders WHERE order_id = ?", [orderId]);
  return rows[0];
};

export const createOrder = async (userId, orderNumber, totalAmount, status = "pending") => {
  const [result] = await db.execute(
    "INSERT INTO orders (user_id, order_number, total_amount, status) VALUES (?, ?, ?, ?)",
    [userId, orderNumber, totalAmount, status]
  );

  return result.insertId;
};

export const createOrderItems = async (orderId, items = []) => {
  if (!Array.isArray(items) || items.length === 0) return;

  const sql = `
    INSERT INTO order_items (order_id, product_id, quantity, price)
    VALUES (?, ?, ?, ?)
  `;

  for (const item of items) {
    const productId = Number(item.product_id);
    const quantity = Number(item.quantity ?? 1);
    const price = Number(item.price ?? 0);
    if (!productId || quantity <= 0) continue;
    await db.execute(sql, [orderId, productId, quantity, price]);
  }
};

export const updateOrderStatus = async (orderId, status) => {
  const [result] = await db.execute("UPDATE orders SET status = ? WHERE order_id = ?", [
    status,
    orderId,
  ]);

  return result.affectedRows;
};

export const deleteOrder = async (orderId) => {
  const [result] = await db.execute("DELETE FROM orders WHERE order_id = ?", [orderId]);
  return result.affectedRows;
};

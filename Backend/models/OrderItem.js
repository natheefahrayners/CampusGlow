import db from '../config/db.js';

export const addOrderItem = async (orderId, productId, quantity, price) => {
  const subtotal = quantity * price;
  const sql = `
    INSERT INTO order_items (order_id, product_id, quantity, price, subtotal)
    VALUES (?, ?, ?, ?, ?)
  `;
  await db.execute(sql, [orderId, productId, quantity, price, subtotal]);
};

import db from '../config/db.js';

export const createPayment = async (orderId, method, amount) => {
  const sql = `
    INSERT INTO payments (order_id, payment_method, amount)
    VALUES (?, ?, ?)
  `;
  await db.execute(sql, [orderId, method, amount]);
};

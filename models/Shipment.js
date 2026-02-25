import db from '../config/db.js';

export const createShipment = async (orderId, courier, tracking) => {
  const sql = `
    INSERT INTO shipments (order_id, courier, tracking_number)
    VALUES (?, ?, ?)
  `;
  await db.execute(sql, [orderId, courier, tracking]);
};

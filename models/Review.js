import db from '../config/db.js';

export const addReview = async (productId, userId, rating, comment) => {
  const sql = `
    INSERT INTO reviews (product_id, user_id, rating, comment)
    VALUES (?, ?, ?, ?)
  `;
  await db.execute(sql, [productId, userId, rating, comment]);
};

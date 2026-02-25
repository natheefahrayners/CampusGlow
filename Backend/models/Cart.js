import db from "../config/db.js";

export const getCartByUser = async (userId) => {
  const [rows] = await db.execute("SELECT * FROM cart WHERE user_id = ?", [userId]);
  return rows[0];
};

export const createCart = async (userId) => {
  const [result] = await db.execute("INSERT INTO cart (user_id) VALUES (?)", [userId]);
  return result.insertId;
};

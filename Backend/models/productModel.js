import { pool } from "../config/database.js";

export const getAllProducts = async () => {
  const [rows] = await pool.execute(
    "SELECT * FROM products WHERE is_active = 1"
  );
  return rows;
};

export const getProductById = async (id) => {
  const [rows] = await pool.execute(
    "SELECT * FROM products WHERE product_id = ?",
    [id]
  );
  return rows[0];
};

export const createProduct = async (payload) => {
  const sql = `
    INSERT INTO products (
      category_id,
      subcategory_id,
      name,
      description,
      price,
      image,
      emoji,
      stock_status,
      is_active
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [
    payload.category_id ?? null,
    payload.subcategory_id ?? null,
    payload.name,
    payload.description ?? null,
    payload.price,
    payload.image ?? null,
    payload.emoji ?? null,
    payload.stock_status ?? "in",
    payload.is_active ?? 1,
  ];

  const [result] = await pool.execute(sql, params);
  return { product_id: result.insertId };
};

export const updateProduct = async (id, payload) => {
  const sql = `
    UPDATE products
    SET
      category_id = ?,
      subcategory_id = ?,
      name = ?,
      description = ?,
      price = ?,
      image = ?,
      emoji = ?,
      stock_status = ?,
      is_active = ?
    WHERE product_id = ?
  `;

  const params = [
    payload.category_id ?? null,
    payload.subcategory_id ?? null,
    payload.name,
    payload.description ?? null,
    payload.price,
    payload.image ?? null,
    payload.emoji ?? null,
    payload.stock_status ?? "in",
    payload.is_active ?? 1,
    id,
  ];

  const [result] = await pool.execute(sql, params);
  return result.affectedRows;
};

export const softDeleteProduct = async (id) => {
  const [result] = await pool.execute(
    "UPDATE products SET is_active = 0 WHERE product_id = ?",
    [id]
  );
  return result.affectedRows;
};

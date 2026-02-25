import db from "../config/db.js";

export const addItemToCart = async (cartId, productId, quantity) => {
  const sql = `
    INSERT INTO cart_items (cart_id, product_id, quantity)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)
  `;

  await db.execute(sql, [cartId, productId, quantity]);
};

export const getCartItems = async (cartId) => {
  const [rows] = await db.execute(
    `SELECT ci.*, p.name, p.price
     FROM cart_items ci
     JOIN products p ON ci.product_id = p.product_id
     WHERE ci.cart_id = ?`,
    [cartId]
  );

  return rows;
};

export const updateCartItemQuantity = async (cartId, itemId, quantity) => {
  const [result] = await db.execute(
    "UPDATE cart_items SET quantity = ? WHERE cart_id = ? AND cart_item_id = ?",
    [quantity, cartId, itemId]
  );

  return result.affectedRows;
};

export const removeCartItem = async (cartId, itemId) => {
  const [result] = await db.execute(
    "DELETE FROM cart_items WHERE cart_id = ? AND cart_item_id = ?",
    [cartId, itemId]
  );

  return result.affectedRows;
};

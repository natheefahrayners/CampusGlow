import { getCartByUser, createCart } from "../models/Cart.js";
import {
  addItemToCart,
  getCartItems,
  updateCartItemQuantity,
  removeCartItem,
} from "../models/CartItem.js";

const resolveUserId = (req) => Number(req.params.userId || req.body.user_id);

const ensureCart = async (userId) => {
  let cart = await getCartByUser(userId);

  if (!cart) {
    const cartId = await createCart(userId);
    cart = { cart_id: cartId, user_id: userId };
  }

  return cart;
};

export const addToCart = async (req, res) => {
  try {
    const userId = resolveUserId(req);
    const { product_id, quantity = 1 } = req.body;

    if (!userId || !product_id) {
      return res.status(400).json({ message: "userId and product_id are required" });
    }

    const cart = await ensureCart(userId);
    await addItemToCart(cart.cart_id, product_id, quantity);

    const items = await getCartItems(cart.cart_id);
    res.status(201).json(items);
  } catch (error) {
    res.status(500).json({ message: "Database error", error: error.message });
  }
};

export const viewCart = async (req, res) => {
  try {
    const userId = resolveUserId(req);

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const cart = await getCartByUser(userId);

    if (!cart) {
      return res.json([]);
    }

    const items = await getCartItems(cart.cart_id);
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Database error", error: error.message });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const userId = resolveUserId(req);
    const itemId = Number(req.params.itemId);
    const { quantity } = req.body;

    if (!userId || !itemId || quantity === undefined) {
      return res.status(400).json({ message: "userId, itemId and quantity are required" });
    }

    const cart = await getCartByUser(userId);

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const affectedRows = await updateCartItemQuantity(cart.cart_id, itemId, quantity);

    if (!affectedRows) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    const items = await getCartItems(cart.cart_id);
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Database error", error: error.message });
  }
};

export const deleteCartItem = async (req, res) => {
  try {
    const userId = resolveUserId(req);
    const itemId = Number(req.params.itemId);

    if (!userId || !itemId) {
      return res.status(400).json({ message: "userId and itemId are required" });
    }

    const cart = await getCartByUser(userId);

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const affectedRows = await removeCartItem(cart.cart_id, itemId);

    if (!affectedRows) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    res.json({ message: "Cart item deleted" });
  } catch (error) {
    res.status(500).json({ message: "Database error", error: error.message });
  }
};

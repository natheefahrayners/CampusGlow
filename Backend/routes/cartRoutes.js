import express from "express";
import {
  addToCart,
  viewCart,
  updateCartItem,
  deleteCartItem,
} from "../controllers/cartController.js";

const router = express.Router();

router.get("/:userId", viewCart);
router.post("/:userId/items", addToCart);
router.patch("/:userId/items/:itemId", updateCartItem);
router.delete("/:userId/items/:itemId", deleteCartItem);

export default router;

import express from "express";
import {
  fetchAllOrders,
  fetchOrderById,
  createOrderHandler,
  updateOrderStatusHandler,
  deleteOrderHandler,
} from "../controllers/orderController.js";

const router = express.Router();

router.get("/", fetchAllOrders);
router.get("/:id", fetchOrderById);
router.post("/", createOrderHandler);
router.patch("/:id", updateOrderStatusHandler);
router.delete("/:id", deleteOrderHandler);

export default router;

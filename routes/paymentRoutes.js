import express from "express";
import {
  fetchAllPayments,
  fetchPaymentById,
  createPaymentHandler,
  updatePaymentHandler,
  deletePaymentHandler,
} from "../controllers/paymentController.js";

const router = express.Router();

router.get("/", fetchAllPayments);
router.get("/:id", fetchPaymentById);
router.post("/", createPaymentHandler);
router.patch("/:id", updatePaymentHandler);
router.delete("/:id", deletePaymentHandler);

export default router;

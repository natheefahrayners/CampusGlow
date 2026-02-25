import express from "express";
import {
  fetchAllDiscounts,
  fetchDiscountById,
  createDiscountHandler,
  updateDiscountHandler,
  deleteDiscountHandler,
} from "../controllers/discountController.js";

const router = express.Router();

router.get("/", fetchAllDiscounts);
router.get("/:id", fetchDiscountById);
router.post("/", createDiscountHandler);
router.patch("/:id", updateDiscountHandler);
router.delete("/:id", deleteDiscountHandler);

export default router;

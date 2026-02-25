import express from "express";
import {
  fetchAllProducts,
  fetchProductById,
  createProductHandler,
  updateProductHandler,
  deleteProductHandler,
} from "../controllers/productController.js";

const router = express.Router();

router.get("/", fetchAllProducts);
router.get("/:id", fetchProductById);
router.post("/", createProductHandler);
router.patch("/:id", updateProductHandler);
router.delete("/:id", deleteProductHandler);

export default router;

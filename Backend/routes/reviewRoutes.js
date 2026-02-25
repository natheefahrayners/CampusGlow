import express from "express";
import {
  fetchAllReviews,
  fetchReviewById,
  createReviewHandler,
  updateReviewHandler,
  deleteReviewHandler,
} from "../controllers/reviewController.js";

const router = express.Router();

router.get("/", fetchAllReviews);
router.get("/:id", fetchReviewById);
router.post("/", createReviewHandler);
router.patch("/:id", updateReviewHandler);
router.delete("/:id", deleteReviewHandler);

export default router;

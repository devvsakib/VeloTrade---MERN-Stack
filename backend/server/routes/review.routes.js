import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  getProductReviews,
  addReview
} from "../controllers/review.controller.js";

const router = express.Router();

/**
 * GET all reviews for a product
 */
router.get("/:productId", getProductReviews);

/**
 * POST review (authenticated)
 */
router.post("/:productId", protect, addReview);

export default router;

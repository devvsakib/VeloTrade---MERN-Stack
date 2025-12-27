import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist
} from "../controllers/wishlist.controller.js";

const router = express.Router();

/**
 * GET user's wishlist
 */
router.get("/", protect, getWishlist);

/**
 * ADD product to wishlist
 */
router.post("/add", protect, addToWishlist);

/**
 * REMOVE product from wishlist
 */
router.post("/remove", protect, removeFromWishlist);

export default router;

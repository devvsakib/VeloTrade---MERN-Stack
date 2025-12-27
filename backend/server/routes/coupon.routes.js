import express from "express";
import { protect, authorize } from "../middlewares/auth.middleware.js";
import {
  createCoupon,
  createVendorCoupon,
  getCoupons,
  applyCoupon
} from "../controllers/coupon.controller.js";

const router = express.Router();

/**
 * CREATE coupon (Admin)
 */
router.post("/", protect, authorize("ADMIN"), createCoupon);

/**
 * CREATE vendor coupon (Vendor)
 */
router.post("/vendor", protect, authorize("VENDOR"), createVendorCoupon);

/**
 * GET all active coupons
 */
router.get("/", getCoupons);

/**
 * APPLY coupon (Customer)
 */
router.post("/apply/:code", protect, applyCoupon);

export default router;

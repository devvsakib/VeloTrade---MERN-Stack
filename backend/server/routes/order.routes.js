import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  createOrder,
  checkoutPreview,
  getUserOrders,
  getOrderById,
  requestRefund,
  getMyRefunds,
  downloadInvoice
} from "../controllers/order.controller.js";

const router = express.Router();

/**
 * PREVIEW order (Checkout summary)
 */
router.post("/preview", protect, checkoutPreview);

/**
 * CREATE order (Checkout)
 */
router.post("/", protect, createOrder);

/**
 * GET user orders
 */
router.get("/my", protect, getUserOrders);

/**
 * GET single order
 */
router.get("/:id", protect, getOrderById);
router.get("/invoice/:id", protect, downloadInvoice);

/**
 * REQUEST refund
 */
router.post("/refund", protect, requestRefund);

/**
 * GET my refunds
 */
router.get("/my/refunds", protect, getMyRefunds);

export default router;

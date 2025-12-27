import express from "express";
import { protect, authorize } from "../middlewares/auth.middleware.js";
import {
  getAllOrders,
  updateOrderStatus,
  approvePayout,
  createDispute,
  getAllUsers,
  getUserById,
  updateUserRole,
  toggleUserActive,
  deleteUser,
  getAllVendors,
  getVendorById,
  updateVendorStatus,
  updateVendorCommission,
  getAllDisputes,
  getDisputeById,
  resolveDispute,
  getOrderById,
  downloadInvoice
} from "../controllers/admin.controller.js";

const router = express.Router();

/**
 * GET all orders
 */
router.get("/orders", protect, authorize("ADMIN"), getAllOrders);

/**
 * UPDATE order status
 */
router.patch("/order/:orderId", protect, authorize("ADMIN"), updateOrderStatus);

/**
 * USER Management
 */
router.get("/users", protect, authorize("ADMIN"), getAllUsers);
router.get("/user/:userId", protect, authorize("ADMIN"), getUserById);
router.get("/order/:orderId", protect, authorize("ADMIN"), getOrderById);
router.get("/order/invoice/:orderId", protect, authorize("ADMIN"), downloadInvoice);
router.patch("/user/role/:userId", protect, authorize("ADMIN"), updateUserRole);
router.patch("/user/toggle/:userId", protect, authorize("ADMIN"), toggleUserActive);
router.delete("/user/:userId", protect, authorize("ADMIN"), deleteUser);

/**
 * VENDOR Management
 */
router.get("/vendors", protect, authorize("ADMIN"), getAllVendors);
router.get("/vendor/:vendorId", protect, authorize("ADMIN"), getVendorById);
router.patch("/vendor/status/:vendorId", protect, authorize("ADMIN"), updateVendorStatus);
router.patch("/vendor/commission/:vendorId", protect, authorize("ADMIN"), updateVendorCommission);
router.post("/vendor/payout/:vendorId", protect, authorize("ADMIN"), approvePayout);

/**
 * DISPUTE Management
 */
router.get("/disputes", protect, authorize("ADMIN"), getAllDisputes);
router.get("/dispute/:id", protect, authorize("ADMIN"), getDisputeById);
router.patch("/dispute/:id", protect, authorize("ADMIN"), resolveDispute);

/**
 * CREATE dispute (Customer)
 */
router.post("/dispute", protect, authorize("CUSTOMER"), createDispute);

export default router;

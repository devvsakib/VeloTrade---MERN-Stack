import express from "express";
import { protect, authorize } from "../middlewares/auth.middleware.js";
import {
  applyVendor,
  getVendorProfile,
  getAllVendors,
  updateVendorStatus,
  getVendorDashboard
} from "../controllers/vendor.controller.js";

const router = express.Router();

/**
 * @route   POST /api/vendor/apply
 * @desc    Apply to become a vendor
 * @access  Authenticated user (VENDOR role usually required to access vendor routes, handled by authorize)
 */
router.post("/apply", protect, authorize("VENDOR"), applyVendor);

/**
 * @route   GET /api/vendor/me
 * @desc    Get current vendor profile
 * @access  Vendor
 */
router.get("/me", protect, authorize("VENDOR"), getVendorProfile);

/**
 * @route   GET /api/vendor/all
 * @desc    Get all vendors (Admin)
 * @access  Admin
 */
router.get("/all", protect, authorize("ADMIN"), getAllVendors);

/**
 * @route   PATCH /api/vendor/:id/status
 * @desc    Approve / Reject vendor
 * @access  Admin
 */
router.patch("/:id/status", protect, authorize("ADMIN"), updateVendorStatus);

/**
 * @route   GET /api/vendor/dashboard
 * @desc    Vendor dashboard summary
 * @access  Vendor
 */
router.get("/dashboard", protect, authorize("VENDOR"), getVendorDashboard);

export default router;

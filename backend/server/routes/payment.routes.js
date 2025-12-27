import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
    initSSL,
    initBkash,
    initNagad,
    sslIpn,
    sslSuccess,
    sslFail,
    sslCancel
} from "../controllers/payment.controller.js";

const router = express.Router();

/**
 * INIT bKash
 */
router.post("/bkash/init/:orderId", protect, initBkash);

/**
 * INIT Nagad
 */
router.post("/nagad/init/:orderId", protect, initNagad);

/**
 * INIT SSLCommerz
 */
router.post("/ssl/init/:orderId", protect, initSSL);

/**
 * SSLCommerz IPN
 */
router.post("/ssl/ipn", sslIpn);

// Callbacks (Optional, based on controller logic)
// router.post("/ssl/success", sslSuccess);
// router.post("/ssl/fail", sslFail);
// router.post("/ssl/cancel", sslCancel);

export default router;

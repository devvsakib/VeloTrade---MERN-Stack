import Order from "../models/Order.js";
import { createPayment } from "../services/sslcommerz.service.js";
import { createBkashPayment } from "../services/bkash.service.js";
import { createNagadPayment } from "../services/nagad.service.js";
import { distributeCommission } from "../services/commission.service.js";

// Init SSLCommerz
export const initSSL = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order || order.userId.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: "Order not found" });
    }

    const session = await createPayment({
      order,
      successUrl: `${process.env.BASE_URL}/api/payment/ssl/success`,
      failUrl: `${process.env.BASE_URL}/api/payment/ssl/fail`,
      cancelUrl: `${process.env.BASE_URL}/api/payment/ssl/cancel`
    });

    console.log('SSL Session Response:', session);

    // SSLCommerz returns { status: 'SUCCESS', GatewayPageURL: '...', sessionkey: '...' }
    if (session && session.GatewayPageURL) {
      res.json({
        success: true,
        gatewayUrl: session.GatewayPageURL,
        sessionKey: session.sessionkey
      });
    } else {
      console.error('SSL Init Failed:', session);
      res.status(400).json({
        success: false,
        message: session?.failedreason || 'Failed to initialize payment'
      });
    }
  } catch (err) {
    console.error('SSL Init Error:', err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// Init bKash
export const initBkash = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const data = await createBkashPayment({ order });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Init Nagad
export const initNagad = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const data = await createNagadPayment({ order });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// SSL Success
export const sslSuccess = async (req, res) => {
  try {
    const { tran_id } = req.body;

    const order = await Order.findById(tran_id);
    if (order) {
      order.paymentStatus = 'PAID';
      order.orderStatus = 'PROCESSING';
      await order.save();

      await distributeCommission(order);
    }

    res.redirect(`${process.env.FRONTEND_URL}/success?order=${tran_id}`);
  } catch (err) {
    console.error('SSL Success Error:', err);
    res.redirect(`${process.env.FRONTEND_URL}/failed`);
  }
};

// SSL Fail
export const sslFail = async (req, res) => {
  const { tran_id } = req.body;

  try {
    const order = await Order.findById(tran_id);
    if (order) {
      order.paymentStatus = 'FAILED';
      await order.save();
    }
  } catch (err) {
    console.error('SSL Fail Error:', err);
  }

  res.redirect(`${process.env.FRONTEND_URL}/failed`);
};

// SSL Cancel
export const sslCancel = async (req, res) => {
  const { tran_id } = req.body;

  try {
    const order = await Order.findById(tran_id);
    if (order) {
      order.paymentStatus = 'FAILED';
      order.orderStatus = 'CANCELLED';
      await order.save();
    }
  } catch (err) {
    console.error('SSL Cancel Error:', err);
  }

  res.redirect(`${process.env.FRONTEND_URL}/cart`);
};

// SSL IPN
export const sslIpn = async (req, res) => {
  try {
    const { tran_id, status } = req.body;

    const order = await Order.findById(tran_id);
    if (!order) return res.status(404).end();

    if (status === "VALID" || status === "VALIDATED") {
      order.paymentStatus = "PAID";
      order.orderStatus = "PROCESSING";
      await order.save();

      await distributeCommission(order);
    }

    res.status(200).end();
  } catch (err) {
    res.status(500).end();
  }
};

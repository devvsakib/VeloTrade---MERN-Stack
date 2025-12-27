import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Coupon from "../models/Coupon.js";
import Refund from "../models/Refund.js";
import { generateInvoicePDF } from "../utils/invoiceGenerator.js";

export const createOrder = async (req, res) => {
  try {
    const { items, paymentMethod, shippingAddress, couponCode } = req.body;

    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product || product.stock < item.quantity) {
        return res.status(400).json({ message: `Invalid product or stock for ${item.productId}` });
      }

      product.stock -= item.quantity;
      await product.save();

      subtotal += product.price * item.quantity;

      orderItems.push({
        productId: product._id,
        vendorId: product.vendorId,
        name: product.name,
        price: product.price,
        quantity: item.quantity
      });
    }

    let discountAmount = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode, active: true });
      if (coupon) {
        const now = new Date();
        if (
          coupon.validFrom <= now &&
          coupon.validTill >= now &&
          coupon.usedCount < coupon.maxUsage &&
          subtotal >= coupon.minAmount
        ) {
          discountAmount = (subtotal * coupon.discount) / 100;
          coupon.usedCount += 1;
          await coupon.save();
        }
      }
    }

    const shippingCost = subtotal > 5000 ? 0 : 100;
    const totalAmount = subtotal + shippingCost - discountAmount;

    const order = await Order.create({
      userId: req.user._id,
      items: orderItems,
      subtotal,
      shippingCost,
      discountAmount,
      couponCode,
      totalAmount,
      paymentMethod,
      shippingAddress
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const checkoutPreview = async (req, res) => {
  try {
    const { items, couponCode } = req.body;

    let subtotal = 0;
    const previewItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.productId}` });
      }

      subtotal += product.price * item.quantity;
      previewItems.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        total: product.price * item.quantity
      });
    }

    let discountAmount = 0;
    let appliedCoupon = null;

    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode, active: true });
      if (coupon) {
        const now = new Date();
        if (
          coupon.validFrom <= now &&
          coupon.validTill >= now &&
          coupon.usedCount < coupon.maxUsage &&
          subtotal >= coupon.minAmount
        ) {
          discountAmount = (subtotal * coupon.discount) / 100;
          appliedCoupon = {
            code: coupon.code,
            discount: coupon.discount
          };
        }
      }
    }

    const shippingCost = subtotal > 5000 ? 0 : 100;
    const totalAmount = subtotal + shippingCost - discountAmount;

    res.json({
      items: previewItems,
      subtotal,
      shippingCost,
      discountAmount,
      couponCode: appliedCoupon?.code || null,
      totalAmount
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort("-createdAt");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "items.productId",
      "name images"
    );

    if (!order || order.userId.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const downloadInvoice = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order || order.userId.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice-${order._id}.pdf`
    );

    generateInvoicePDF(order, res);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const requestRefund = async (req, res) => {
  try {
    const { orderId, reason, amount } = req.body;
    const order = await Order.findOne({ _id: orderId, userId: req.user._id });

    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.paymentStatus !== "PAID")
      return res.status(400).json({ message: "Only paid orders can be refunded" });

    const refund = await Refund.create({
      orderId,
      userId: req.user._id,
      vendorId: order.items[0].vendorId,
      amount: amount || order.totalAmount,
      reason
    });

    order.paymentStatus = "REFUND_PENDING";
    await order.save();

    res.status(201).json(refund);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMyRefunds = async (req, res) => {
  try {
    const refunds = await Refund.find({ userId: req.user._id }).populate("orderId");
    res.json(refunds);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

import Order from "../models/Order.js";
import Vendor from "../models/Vendor.js";
import Dispute from "../models/Dispute.js";
import User from "../models/User.js";
import { generateInvoicePDF } from "../utils/invoiceGenerator.js";

export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().sort("-createdAt").populate("userId", "name email");
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// User Management
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().sort("-createdAt");
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.role = role;
        await user.save();
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const toggleUserActive = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.isActive = !user.isActive;
        await user.save();
        res.json({ message: `User ${user.isActive ? 'activated' : 'deactivated'}`, user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.userId);
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId).populate('userId', 'name email');
        if (!order) return res.status(404).json({ message: "Order not found" });
        res.json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const downloadInvoice = async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId);
        if (!order) return res.status(404).json({ message: "Order not found" });

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

// Vendor Management
export const getAllVendors = async (req, res) => {
    try {
        const vendors = await Vendor.find().populate("userId", "name email");
        res.json(vendors);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getVendorById = async (req, res) => {
    try {
        const vendor = await Vendor.findById(req.params.vendorId).populate("userId", "name email");
        if (!vendor) return res.status(404).json({ message: "Vendor not found" });
        res.json(vendor);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const updateVendorStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const vendor = await Vendor.findById(req.params.vendorId);
        if (!vendor) return res.status(404).json({ message: "Vendor not found" });

        vendor.status = status;
        await vendor.save();
        res.json(vendor);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const updateVendorCommission = async (req, res) => {
    try {
        const { commissionRate } = req.body;
        const vendor = await Vendor.findById(req.params.vendorId);
        if (!vendor) return res.status(404).json({ message: "Vendor not found" });

        vendor.commissionRate = commissionRate;
        await vendor.save();
        res.json(vendor);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Order Management
export const updateOrderStatus = async (req, res) => {
    try {
        const { orderStatus, paymentStatus } = req.body;
        const order = await Order.findById(req.params.orderId);
        if (!order) return res.status(404).json({ message: "Order not found" });

        if (orderStatus) order.orderStatus = orderStatus;
        if (paymentStatus) order.paymentStatus = paymentStatus;

        await order.save();
        res.json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Dispute Management
export const getAllDisputes = async (req, res) => {
    try {
        const { userId, email } = req.query;
        let query = {};

        if (userId) query.userId = userId;
        if (email) {
            const user = await User.findOne({ email });
            if (user) query.userId = user._id;
            else return res.json([]); // No user = no disputes
        }

        const disputes = await Dispute.find(query)
            .populate("userId", "name email")
            .populate("orderId")
            .sort("-createdAt");
        res.json(disputes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getDisputeById = async (req, res) => {
    try {
        const dispute = await Dispute.findById(req.params.id)
            .populate("userId", "name email")
            .populate("orderId");
        if (!dispute) return res.status(404).json({ message: "Dispute not found" });
        res.json(dispute);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const approvePayout = async (req, res) => {
    try {
        const vendor = await Vendor.findById(req.params.vendorId);
        if (!vendor) return res.status(404).json({ message: "Vendor not found" });

        const amount = req.body.amount || vendor.balance;
        if (amount > vendor.balance)
            return res.status(400).json({ message: "Insufficient balance" });

        vendor.balance -= amount;
        await vendor.save();

        res.json({ message: "Payout approved", vendorBalance: vendor.balance });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const createDispute = async (req, res) => {
    try {
        const { orderId, reason } = req.body;
        const dispute = await Dispute.create({
            orderId,
            userId: req.user._id,
            reason
        });
        res.status(201).json(dispute);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

import Product from "../models/Product.js";
import Refund from "../models/Refund.js";

export const resolveDispute = async (req, res) => {
    try {
        const { status, refundAmount, adminNote } = req.body;

        const dispute = await Dispute.findById(req.params.id);
        if (!dispute) return res.status(404).json({ message: "Dispute not found" });

        dispute.status = status;
        dispute.refundAmount = refundAmount || 0;
        dispute.resolvedBy = req.user._id;
        await dispute.save();

        if (status === "RESOLVED" && refundAmount > 0) {
            const order = await Order.findById(dispute.orderId);
            if (!order) return res.status(404).json({ message: "Order not found" });

            // 1. Transactional Updates
            order.paymentStatus = "REFUNDED";
            order.orderStatus = "CANCELLED";
            await order.save();

            // 2. Refund Record
            // Note: In a real system, we'd find the vendor from the order items. 
            // For multi-vendor products in one order, we'd need to handle each vendor.
            // For now, assuming first item's vendor for simplicity or handling all.
            const uniqueVendors = [...new Set(order.items.map(item => String(item.vendorId)))];

            for (const vendorId of uniqueVendors) {
                const vendor = await Vendor.findById(vendorId);
                if (vendor) {
                    // Pull back money from vendor balance
                    // Total amount for this vendor's items in this order
                    const vendorOrderAmount = order.items
                        .filter(item => String(item.vendorId) === vendorId)
                        .reduce((sum, item) => sum + (item.price * item.quantity), 0);

                    // Deduct (Amount - Commission) if it was already added
                    const commission = (vendorOrderAmount * vendor.commissionRate) / 100;
                    const creditedAmount = vendorOrderAmount - commission;

                    vendor.balance -= creditedAmount;
                    await vendor.save();
                }
            }

            // 3. Restore Stock
            for (const item of order.items) {
                await Product.findByIdAndUpdate(item.productId, {
                    $inc: { stock: item.quantity }
                });
            }

            // 4. Create Refund Record
            await Refund.create({
                orderId: order._id,
                userId: order.userId,
                vendorId: order.items[0].vendorId, // Primary vendor
                amount: refundAmount,
                reason: dispute.reason,
                status: "APPROVED",
                adminNote
            });
        }

        res.json(dispute);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

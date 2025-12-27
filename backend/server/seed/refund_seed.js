import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../config/db.js";

import User from "../models/User.js";
import Vendor from "../models/Vendor.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import Dispute from "../models/Dispute.js";
import Refund from "../models/Refund.js";

dotenv.config();

const seedRefundData = async () => {
    try {
        await connectDB();
        console.log("🌱 Finding existing data...");

        const customers = await User.find({ role: "CUSTOMER" }).limit(5);
        const products = await Product.find().limit(10);
        const vendors = await Vendor.find().limit(5);

        if (customers.length === 0 || products.length === 0) {
            console.error("❌ Need users and products in DB. Run real_seed.js first.");
            process.exit(1);
        }

        console.log("🌱 Seeding Sample Orders...");
        const orders = [];
        for (let i = 0; i < 10; i++) {
            const customer = customers[i % customers.length];
            const product = products[i % products.length];

            orders.push({
                userId: customer._id,
                items: [{
                    productId: product._id,
                    vendorId: product.vendorId,
                    name: product.name,
                    price: product.price,
                    quantity: 1
                }],
                subtotal: product.price,
                shippingCost: 100,
                totalAmount: product.price + 100,
                paymentMethod: "SSL",
                paymentStatus: i < 5 ? "PAID" : "PENDING",
                orderStatus: i < 3 ? "DELIVERED" : "PLACED",
                shippingAddress: {
                    name: customer.name,
                    phone: "01700000000",
                    address: "Sample Address",
                    city: "Dhaka",
                    postalCode: "1234"
                }
            });
        }
        const createdOrders = await Order.insertMany(orders);

        console.log("🌱 Seeding Sample Disputes...");
        const disputes = [
            {
                orderId: createdOrders[0]._id,
                userId: createdOrders[0].userId,
                reason: "Product damaged during delivery",
                status: "PENDING"
            },
            {
                orderId: createdOrders[1]._id,
                userId: createdOrders[1].userId,
                reason: "Received wrong item (Blue instead of Red)",
                status: "RESOLVED",
                refundAmount: createdOrders[1].totalAmount
            },
            {
                orderId: createdOrders[3]._id,
                userId: createdOrders[3].userId,
                reason: "Found it cheaper elsewhere (Price match request)",
                status: "REJECTED"
            },
            {
                orderId: createdOrders[4]._id,
                userId: createdOrders[4].userId,
                reason: "Missing one item from set",
                status: "RESOLVED",
                refundAmount: createdOrders[4].totalAmount / 2 // Partial refund
            },
            {
                orderId: createdOrders[5]._id,
                userId: createdOrders[5].userId,
                reason: "Quality not as expected",
                status: "PENDING"
            }
        ];
        const createdDisputes = await Dispute.insertMany(disputes);

        console.log("🌱 Seeding Sample Refunds...");
        const refunds = [
            {
                orderId: createdOrders[1]._id,
                userId: createdOrders[1].userId,
                vendorId: createdOrders[1].items[0].vendorId,
                amount: createdOrders[1].totalAmount,
                reason: "Full refund for wrong item color",
                status: "APPROVED",
                adminNote: "Resolved via dispute #2",
                processedAt: new Date()
            },
            {
                orderId: createdOrders[2]._id,
                userId: createdOrders[2].userId,
                vendorId: createdOrders[2].items[0].vendorId,
                amount: 500,
                reason: "Late shipment goodwill refund",
                status: "PENDING"
            },
            {
                orderId: createdOrders[4]._id,
                userId: createdOrders[4].userId,
                vendorId: createdOrders[4].items[0].vendorId,
                amount: createdOrders[4].totalAmount / 2,
                reason: "Partial refund for missing component",
                status: "APPROVED",
                processedAt: new Date()
            }
        ];
        await Refund.insertMany(refunds);

        console.log("✅ Sample Refund and Dispute Data Seeded Successfully!");
        process.exit();
    } catch (err) {
        console.error("❌ Seeding Error:", err);
        process.exit(1);
    }
};

seedRefundData();

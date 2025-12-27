import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import connectDB from "../config/db.js";

import User from "../models/User.js";
import Vendor from "../models/Vendor.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import Review from "../models/Review.js";
import Coupon from "../models/Coupon.js";
import Wishlist from "../models/Wishlist.js";

dotenv.config();

const users = [
    { name: "John Doe", email: "john@demo.com", role: "CUSTOMER" },
    { name: "Jane Smith", email: "jane@demo.com", role: "CUSTOMER" },
    { name: "Admin User", email: "admin@demo.com", role: "ADMIN" },
    { name: "Tech Vendor", email: "tech@vendor.com", role: "VENDOR" },
    { name: "Fashion Vendor", email: "fashion@vendor.com", role: "VENDOR" },
];

const products = [
    { name: "iPhone 15 Pro", category: "Electronics", price: 120000, description: "Latest Apple flagship", images: ["https://placehold.co/400"] },
    { name: "Samsung S24 Ultra", category: "Electronics", price: 110000, description: "Android king", images: ["https://placehold.co/400"] },
    { name: "MacBook Air M2", category: "Laptops", price: 150000, description: "Super fast", images: ["https://placehold.co/400"] },
    { name: "Sony WH-1000XM5", category: "Audio", price: 35000, description: "Noise cancelling headphones", images: ["https://placehold.co/400"] },
    { name: "Nike Air Jordan", category: "Fashion", price: 15000, description: "Classic sneakers", images: ["https://placehold.co/400"] },
    { name: "Adidas Ultraboost", category: "Fashion", price: 12000, description: "Running shoes", images: ["https://placehold.co/400"] },
    { name: "Leather Jacket", category: "Fashion", price: 8000, description: "Genuine leather", images: ["https://placehold.co/400"] },
    { name: "RayBan Aviator", category: "Accessories", price: 10000, description: "Classic sunglasses", images: ["https://placehold.co/400"] },
    { name: "Rolex Submariner", category: "Watches", price: 500000, description: "Luxury watch", images: ["https://placehold.co/400"] },
    { name: "Gaming PC", category: "Electronics", price: 200000, description: "High end gaming rig", images: ["https://placehold.co/400"] }
];

const seedData = async () => {
    try {
        await connectDB();
        console.log("🧹 Clearing Database...");
        await Promise.all([
            User.deleteMany({}),
            Vendor.deleteMany({}),
            Product.deleteMany({}),
            Order.deleteMany({}),
            Review.deleteMany({}),
            Coupon.deleteMany({}),
            Wishlist.deleteMany({})
        ]);

        console.log("🌱 Seeding Users...");
        const password = await bcrypt.hash("123456", 10);
        const createdUsers = await User.insertMany(users.map(u => ({ ...u, password })));

        const customer1 = createdUsers.find(u => u.email === "john@demo.com");
        const vendorUser1 = createdUsers.find(u => u.email === "tech@vendor.com");
        const vendorUser2 = createdUsers.find(u => u.email === "fashion@vendor.com");

        console.log("🌱 Seeding Vendors...");
        const vendors = await Vendor.insertMany([
            { userId: vendorUser1._id, shopName: "Tech World", phone: "01700000000", address: "Dhaka", status: "APPROVED", commissionRate: 5 },
            { userId: vendorUser2._id, shopName: "Fashion Hub", phone: "01800000000", address: "Chittagong", status: "APPROVED", commissionRate: 10 }
        ]);

        console.log("🌱 Seeding Products...");
        const productData = products.map((p, i) => ({
            ...p,
            slug: p.name.toLowerCase().replace(/ /g, "-") + "-" + i,
            vendorId: i % 2 === 0 ? vendors[0]._id : vendors[1]._id,
            stock: 50
        }));
        const createdProducts = await Product.insertMany(productData);

        console.log("🌱 Seeding Orders...");
        await Order.create({
            userId: customer1._id,
            items: [{
                productId: createdProducts[0]._id,
                vendorId: vendors[0]._id,
                name: createdProducts[0].name,
                price: createdProducts[0].price,
                quantity: 1
            }],
            subtotal: createdProducts[0].price,
            shippingCost: 100,
            totalAmount: createdProducts[0].price + 100,
            shippingAddress: { name: customer1.name, address: "123 Street", city: "Dhaka", phone: "01900000000" },
            paymentMethod: "COD",
            orderStatus: "PLACED"
        });

        console.log("🌱 Seeding Reviews...");
        await Review.create({
            productId: createdProducts[0]._id,
            userId: customer1._id,
            rating: 5,
            comment: "Amazing product!"
        });

        console.log("🌱 Seeding Coupons...");
        await Coupon.create({
            code: "WELCOME10",
            discount: 10,
            validFrom: new Date(),
            validTill: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
        });

        console.log("✅ Database Seeded Successfully!");
        process.exit();
    } catch (err) {
        console.error("❌ Seeding Error:", err);
        process.exit(1);
    }
};

seedData();

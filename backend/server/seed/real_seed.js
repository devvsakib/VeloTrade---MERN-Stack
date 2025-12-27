import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import connectDB from "../config/db.js";

import User from "../models/User.js";
import Vendor from "../models/Vendor.js";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import Review from "../models/Review.js";
import Coupon from "../models/Coupon.js";

dotenv.config();

const categoriesData = [
    {
        name: "Electronics", children: [
            { name: "Mobile Phones", children: [{ name: "Smartphones" }, { name: "Feature Phones" }] },
            { name: "Computers", children: [{ name: "Laptops" }, { name: "Desktops" }, { name: "Monitors" }] },
            { name: "Audio", children: [{ name: "Headphones" }, { name: "Speakers" }] }
        ]
    },
    {
        name: "Fashion", children: [
            { name: "Men's Clothing", children: [{ name: "T-Shirts" }, { name: "Pants" }, { name: "Shoes" }] },
            { name: "Women's Clothing", children: [{ name: "Dresses" }, { name: "Handbags" }, { name: "Jewelry" }] }
        ]
    },
    {
        name: "Home & Kitchen", children: [
            { name: "Appliances", children: [{ name: "Microwaves" }, { name: "Blenders" }] },
            { name: "Furniture", children: [{ name: "Sofas" }, { name: "Dining Tables" }] }
        ]
    }
];

const usersData = [
    { name: "Admin One", email: "admin1@demo.com", role: "ADMIN" },
    { name: "Admin Two", email: "admin2@demo.com", role: "ADMIN" },
    { name: "Tech Shop Owner", email: "tech@vendor.com", role: "VENDOR" },
    { name: "Fashion Hub Owner", email: "fashion@vendor.com", role: "VENDOR" },
    { name: "Home Living Owner", email: "home@vendor.com", role: "VENDOR" },
    { name: "Gadget Guru Owner", email: "gadget@vendor.com", role: "VENDOR" },
    { name: "Appliance King Owner", email: "appliance@vendor.com", role: "VENDOR" },
    ...Array.from({ length: 15 }, (_, i) => ({
        name: `Customer ${i + 1}`,
        email: `customer${i + 1}@demo.com`,
        role: "CUSTOMER"
    }))
];

const seedData = async () => {
    try {
        await connectDB();
        console.log("🧹 Clearing Database...");
        await Promise.all([
            User.deleteMany({}),
            Vendor.deleteMany({}),
            Product.deleteMany({}),
            Category.deleteMany({}),
            Review.deleteMany({}),
            Coupon.deleteMany({})
        ]);

        const password = await bcrypt.hash("123456", 10);
        console.log("🌱 Seeding Users...");
        const createdUsers = await User.insertMany(usersData.map(u => ({ ...u, password })));

        console.log("🌱 Seeding Categories...");
        const seedCategories = async (cats, parent = null) => {
            let processed = [];
            for (const cat of cats) {
                const slug = cat.name.toLowerCase().replace(/ /g, "-") + "-" + Math.random().toString(36).substr(2, 5);
                const c = await Category.create({ name: cat.name, slug, parent });
                processed.push(c);
                if (cat.children) {
                    const children = await seedCategories(cat.children, c._id);
                    processed.push(...children);
                }
            }
            return processed;
        };
        const allCategories = await seedCategories(categoriesData);

        console.log("🌱 Seeding Vendors...");
        const vendorUsers = createdUsers.filter(u => u.role === "VENDOR");
        const shopNames = ["Tech World", "Fashion Hub", "Home & Living", "Gadget Galaxy", "Appliance King"];
        const vendors = await Vendor.insertMany(vendorUsers.map((u, i) => ({
            userId: u._id,
            shopName: shopNames[i],
            phone: `01${i}00000000`,
            address: "Dhaka, Bangladesh",
            status: "APPROVED",
            commissionRate: 10
        })));

        console.log("🌱 Seeding Products...");
        const products = [];
        const subCats = allCategories.filter(c => allCategories.some(child => String(child.parent) === String(c._id)) === false);

        for (let i = 0; i < 120; i++) {
            const vendor = vendors[i % vendors.length];
            const subCat = subCats[i % subCats.length];
            const parentCat = allCategories.find(c => String(c._id) === String(subCat.parent));

            const name = `${subCat.name} Model ${i + 1}`;
            products.push({
                vendorId: vendor._id,
                name,
                slug: name.toLowerCase().replace(/ /g, "-") + "-" + i,
                description: `High quality ${subCat.name} for your needs. This is a demo description for ${name}.`,
                price: Math.floor(Math.random() * 50000) + 500,
                stock: Math.floor(Math.random() * 100) + 10,
                categoryId: parentCat?._id || subCat._id,
                subCategoryId: subCat._id,
                images: [`https://placehold.co/600x400?text=${encodeURIComponent(name)}`],
                isActive: true
            });
        }
        const createdProducts = await Product.insertMany(products);

        console.log("🌱 Seeding Reviews...");
        const customers = createdUsers.filter(u => u.role === "CUSTOMER");
        const reviews = [];
        for (let i = 0; i < 200; i++) {
            const product = createdProducts[i % createdProducts.length];
            const customer = customers[i % customers.length];
            reviews.push({
                productId: product._id,
                userId: customer._id,
                rating: Math.floor(Math.random() * 5) + 1,
                comment: i % 2 === 0 ? "Excellent product, highly recommended!" : "Good value for money."
            });
        }
        await Review.insertMany(reviews);

        console.log("🌱 Seeding Coupons...");
        const coupons = [
            { code: "SAVE10", discount: 10, scope: "GLOBAL", validFrom: new Date(), validTill: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
            { code: "TECH5", discount: 5, scope: "VENDOR", vendorId: vendors[0]._id, validFrom: new Date(), validTill: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
            { code: "LAPTOP20", discount: 20, scope: "PRODUCT", productId: createdProducts[0]._id, validFrom: new Date(), validTill: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) }
        ];
        await Coupon.insertMany(coupons);

        console.log("✅ Database Seeded Successfully with 120 Products!");
        process.exit();
    } catch (err) {
        console.error("❌ Seeding Error:", err);
        process.exit(1);
    }
};

seedData();

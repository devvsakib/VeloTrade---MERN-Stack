const mongoose = require("mongoose");
require("dotenv").config();
const Product = require("../models/Product");

const products = [
    {
        name: "Wireless Headphones",
        category: "Electronics",
        price: 1500,
        image: "https://via.placeholder.com/400",
        stock: 50
    },
    {
        name: "Riyadus Salihin",
        category: "Islamic Books",
        price: 400,
        image: "https://via.placeholder.com/400",
        stock: 100
    },
    {
        name: "Smart Watch Strap",
        category: "Accessories",
        price: 800,
        image: "https://via.placeholder.com/400",
        stock: 70
    }
];

(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    await Product.deleteMany();
    await Product.insertMany(products);
    console.log("✅ Products seeded");
    process.exit();
})();

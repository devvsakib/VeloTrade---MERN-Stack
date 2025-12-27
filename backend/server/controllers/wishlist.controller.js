import Wishlist from "../models/Wishlist.js";

export const getWishlist = async (req, res) => {
    try {
        let wishlist = await Wishlist.findOne({ userId: req.user._id }).populate("products");
        if (!wishlist) wishlist = await Wishlist.create({ userId: req.user._id, products: [] });
        res.json(wishlist);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const addToWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        let wishlist = await Wishlist.findOne({ userId: req.user._id });
        if (!wishlist) wishlist = await Wishlist.create({ userId: req.user._id, products: [] });

        if (!wishlist.products.includes(productId)) wishlist.products.push(productId);
        await wishlist.save();

        res.json(wishlist);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const removeFromWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        const wishlist = await Wishlist.findOne({ userId: req.user._id });
        if (!wishlist) return res.status(404).json({ message: "Wishlist not found" });

        wishlist.products = wishlist.products.filter(p => p.toString() !== productId);
        await wishlist.save();

        res.json(wishlist);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

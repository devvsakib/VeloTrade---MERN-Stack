import Vendor from "../models/Vendor.js";

export const applyVendor = async (req, res) => {
    try {
        const { shopName, phone, address } = req.body;

        const exists = await Vendor.findOne({ userId: req.user.id });
        if (exists) {
            return res.status(400).json({ message: "Vendor application already exists" });
        }

        const vendor = await Vendor.create({
            userId: req.user.id,
            shopName,
            phone,
            address
        });

        res.status(201).json(vendor);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getVendorProfile = async (req, res) => {
    try {
        const vendor = await Vendor.findOne({ userId: req.user.id });
        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }

        res.json(vendor);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getAllVendors = async (req, res) => {
    try {
        // Check is handled in middleware but double check if needed, logic was:
        if (req.user.role !== "ADMIN") {
            return res.status(403).json({ message: "Access denied" });
        }

        const vendors = await Vendor.find().populate("userId", "name email");
        res.json(vendors);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const updateVendorStatus = async (req, res) => {
    try {
        if (req.user.role !== "ADMIN") {
            return res.status(403).json({ message: "Access denied" });
        }

        const { status } = req.body;

        if (!["APPROVED", "REJECTED"].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const vendor = await Vendor.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        res.json(vendor);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getVendorDashboard = async (req, res) => {
    try {
        const vendor = await Vendor.findOne({ userId: req.user.id });
        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }

        if (vendor.status !== "APPROVED") {
            return res.status(403).json({ message: "Vendor not approved yet" });
        }

        res.json({
            shopName: vendor.shopName,
            balance: vendor.balance,
            commissionRate: vendor.commissionRate,
            status: vendor.status
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

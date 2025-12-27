import Coupon from "../models/Coupon.js";

export const createCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.create(req.body);
        res.status(201).json(coupon);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getCoupons = async (req, res) => {
    try {
        const now = new Date();
        const coupons = await Coupon.find({
            active: true,
            validFrom: { $lte: now },
            validTill: { $gte: now }
        });
        res.json(coupons);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const createVendorCoupon = async (req, res) => {
    try {
        const { code, discount, minAmount, maxUsage, validFrom, validTill, productId, scope } = req.body;

        // Find vendor for current user
        import("../models/Vendor.js").then(async (Vendor) => {
            const vendor = await Vendor.default.findOne({ userId: req.user._id });
            if (!vendor) return res.status(403).json({ message: "Only vendors can create vendor coupons" });

            const coupon = await Coupon.create({
                code,
                discount,
                minAmount,
                maxUsage,
                validFrom,
                validTill,
                vendorId: vendor._id,
                productId,
                scope: scope || "VENDOR"
            });
            res.status(201).json(coupon);
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const applyCoupon = async (req, res) => {
    try {
        const { code } = req.params;
        const { items, subtotal } = req.body; // Expecting items to check product/vendor scope

        const coupon = await Coupon.findOne({ code, active: true });
        if (!coupon) return res.status(404).json({ message: "Coupon not found or inactive" });

        const now = new Date();
        if (coupon.validFrom > now || coupon.validTill < now)
            return res.status(400).json({ message: "Coupon expired or not yet valid" });

        if (coupon.usedCount >= coupon.maxUsage)
            return res.status(400).json({ message: "Coupon usage limit reached" });

        if (subtotal < coupon.minAmount)
            return res.status(400).json({ message: `Minimum order amount for this coupon is ${coupon.minAmount}` });

        // Scope Validation
        if (coupon.scope === "PRODUCT") {
            const hasProduct = items.some(item => String(item.productId) === String(coupon.productId));
            if (!hasProduct) return res.status(400).json({ message: "Coupon not applicable to these products" });
        } else if (coupon.scope === "VENDOR") {
            const hasVendorProduct = items.some(item => String(item.vendorId) === String(coupon.vendorId));
            if (!hasVendorProduct) return res.status(400).json({ message: "Coupon only valid for specific vendor products" });
        }

        res.json({
            message: "Coupon is valid",
            discount: coupon.discount,
            couponId: coupon._id,
            scope: coupon.scope
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

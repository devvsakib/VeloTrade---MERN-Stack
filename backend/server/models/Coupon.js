import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, unique: true, required: true },
    discount: { type: Number, required: true }, // percentage
    minAmount: { type: Number, default: 0 },
    maxUsage: { type: Number, default: 1 },
    usedCount: { type: Number, default: 0 },
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      default: null
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      default: null
    },
    scope: {
      type: String,
      enum: ["GLOBAL", "VENDOR", "PRODUCT"],
      default: "GLOBAL"
    },
    validFrom: Date,
    validTill: Date,
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model("Coupon", couponSchema);

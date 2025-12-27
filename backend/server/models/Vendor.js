import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    shopName: {
      type: String,
      required: true
    },
    phone: String,
    address: String,

    commissionRate: {
      type: Number,
      default: 10
    },

    balance: {
      type: Number,
      default: 0
    },

    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED", "SUSPENDED"],
      default: "PENDING"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Vendor", vendorSchema);

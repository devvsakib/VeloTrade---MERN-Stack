import mongoose from "mongoose";

const shippingSchema = new mongoose.Schema(
  {
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    courier: String,
    trackingNumber: String,
    status: {
      type: String,
      enum: ["PENDING", "IN_TRANSIT", "DELIVERED", "CANCELLED"],
      default: "PENDING"
    },
    estimatedDelivery: Date,
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" } // Admin or Vendor
  },
  { timestamps: true }
);

export default mongoose.model("Shipping", shippingSchema);

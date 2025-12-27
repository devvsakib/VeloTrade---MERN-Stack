import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    title: String,
    message: String,
    read: { type: Boolean, default: false },
    type: { type: String, enum: ["ORDER", "PAYMENT", "SHIPPING", "GENERAL"], default: "GENERAL" }
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);

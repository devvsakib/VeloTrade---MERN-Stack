import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true
        },
        vendorId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Vendor",
          required: true
        },
        name: String,
        price: Number,
        quantity: Number
      }
    ],

    subtotal: Number,
    shippingCost: Number,
    discountAmount: {
      type: Number,
      default: 0
    },
    couponCode: String,
    totalAmount: Number,

    paymentMethod: {
      type: String,
      enum: ["SSL", "BKASH", "NAGAD", "COD"],
      required: true
    },

    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED", "REFUND_PENDING", "REFUNDED"],
      default: "PENDING"
    },

    orderStatus: {
      type: String,
      enum: [
        "PLACED",
        "PROCESSING",
        "SHIPPED",
        "DELIVERED",
        "CANCELLED",
        "DISPUTED"
      ],
      default: "PLACED"
    },

    shippingAddress: {
      name: String,
      phone: String,
      address: String,
      city: String,
      postalCode: String
    }
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);

import Vendor from "../models/Vendor.js";

/**
 * Calculate and update vendor balance
 * Called after order is PAID
 */
export const distributeCommission = async (order) => {
  for (const item of order.items) {
    const vendor = await Vendor.findById(item.vendorId);
    if (!vendor || vendor.status !== "APPROVED") continue;

    const commissionAmount = (item.price * item.quantity * vendor.commissionRate) / 100;
    const vendorEarning = item.price * item.quantity - commissionAmount;

    vendor.balance += vendorEarning;
    await vendor.save();
  }
};

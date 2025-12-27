import axios from "axios";

const BKASH_BASE = "https://checkout.sandbox.bka.sh/v1.2.0-beta";

export const createBkashPayment = async ({ order }) => {
  // DEMO response (replace with live later)
  return {
    paymentID: "BKASH_DEMO_" + order._id,
    bkashURL: `https://sandbox.bka.sh/checkout/${order._id}`
  };
};

export const verifyBkashPayment = async ({ paymentID }) => {
  // DEMO response (replace with live later)
  return {
    status: "PAID"
  };
};
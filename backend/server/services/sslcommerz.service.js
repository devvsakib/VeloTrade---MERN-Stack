import SSLCommerzPayment from "sslcommerz-lts";

// Use exact credentials from your SSLCommerz dashboard
const storeId = "mvend694b745ee1848";
const storePass = "123456789";
const isLive = false; // sandbox mode

console.log('SSLCommerz Initializing with:', {
  storeId,
  passwordSet: !!storePass,
  isLive
});

// Initialize SSLCommerz
const sslcommerz = new SSLCommerzPayment(storeId, storePass, isLive);

export const createPayment = async ({ order, successUrl, failUrl, cancelUrl }) => {
  const data = {
    // Transaction Info
    total_amount: order.totalAmount,
    currency: "BDT",
    tran_id: order._id.toString(),
    store_id: storeId,
    store_pass: storePass,

    // URLs
    success_url: successUrl,
    fail_url: failUrl,
    cancel_url: cancelUrl,
    ipn_url: `${process.env.BASE_URL}/api/payment/ssl/ipn`,

    // Product Info
    product_name: "E-commerce Order",
    product_category: "General",
    product_profile: "general",

    // Customer Info
    cus_name: order.shippingAddress.name,
    cus_email: "customer@example.com", // Use a valid email format
    cus_add1: order.shippingAddress.address,
    cus_add2: "N/A",
    cus_city: order.shippingAddress.city,
    cus_state: "Dhaka",
    cus_postcode: order.shippingAddress.postalCode || "1000",
    cus_country: "Bangladesh",
    cus_phone: order.shippingAddress.phone,
    cus_fax: "N/A",

    // Shipping Info
    shipping_method: "Courier",
    ship_name: order.shippingAddress.name,
    ship_add1: order.shippingAddress.address,
    ship_add2: "N/A",
    ship_city: order.shippingAddress.city,
    ship_state: "Dhaka",
    ship_postcode: order.shippingAddress.postalCode || "1000",
    ship_country: "Bangladesh",
    num_of_item: 2,
    weight_of_items: 1,
    logistic_pickup_id: "sdfadsfdasfasdf",
    logistic_delivery_type: "C",


    // Additional
    value_a: order._id.toString(),
    value_b: "N/A",
    value_c: "N/A",
    value_d: "N/A"
  };

  console.log('Initiating SSLCommerz Payment:', {
    tran_id: data.tran_id,
    amount: data.total_amount,
    customer: data.cus_name,
    phone: data.cus_phone
  });

  try {
    const response = await sslcommerz.init(data);
    console.log('SSLCommerz Response:', JSON.stringify(response, null, 2));
    return response;
  } catch (error) {
    console.error('SSLCommerz Init Error:', error);
    throw error;
  }
};

export const createNagadPayment = async ({ order }) => {
  return {
    paymentRefId: "NAGAD_DEMO_" + order._id,
    redirectUrl: `https://sandbox.nagad.com.bd/pay/${order._id}`
  };
};

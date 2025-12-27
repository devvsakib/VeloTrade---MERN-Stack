import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ordersAPI, paymentAPI } from '../lib/api';
import { Button } from '@/components/ui/button';
import { Card } from '../components/ui/card';
import {Input} from '../components/ui/input';
import { CreditCard, Wallet, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, total, clearCart } = useCart();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    paymentMethod: 'SSL'
  });

  const createOrder = useMutation({
    mutationFn: async () => {
      const orderData = {
        items: items.map(item => ({
          productId: item.product._id,
          vendorId: item.product.vendorId,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity
        })),
        shippingAddress: {
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode
        },
        paymentMethod: formData.paymentMethod,
        subtotal: total,
        shippingCost: 100,
        totalAmount: total + 100
      };

      const orderResponse = await ordersAPI.create(orderData);
      return orderResponse.data;
    },
    onSuccess: async (order) => {
      if (formData.paymentMethod === 'SSL') {
        // Initialize SSLCommerz payment
        try {
          toast.loading('Initializing payment gateway...');
          const paymentResponse = await paymentAPI.initSSL(order._id);

          if (paymentResponse.data.success && paymentResponse.data.gatewayUrl) {
            toast.success('Redirecting to payment gateway...');
            // Redirect to SSLCommerz payment gateway
            setTimeout(() => {
              window.location.href = paymentResponse.data.gatewayUrl;
            }, 1000);
          } else {
            toast.error('Failed to initialize payment. Please try again.');
          }
        } catch (error) {
          console.error('Payment init error:', error);
          toast.error(error.response?.data?.message || 'Payment initialization failed');
        }
      } else if (formData.paymentMethod === 'COD') {
        clearCart();
        toast.success('Order placed successfully!');
        navigate('/success');
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Order failed. Please try again.');
    }
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createOrder.mutate();
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const paymentMethods = [
    { value: 'SSL', label: 'SSLCommerz', icon: CreditCard, desc: 'Credit/Debit Card, Mobile Banking' },
    { value: 'BKASH', label: 'bKash', icon: Wallet, desc: 'Mobile Payment' },
    { value: 'NAGAD', label: 'Nagad', icon: Wallet, desc: 'Mobile Payment' },
    { value: 'COD', label: 'Cash on Delivery', icon: DollarSign, desc: 'Pay when you receive' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-5xl font-black mb-8 gradient-text">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <Card glass className="backdrop-blur-xl p-6 mb-6 border border-white/10">
              <h2 className="text-2xl font-bold mb-6">Shipping Information</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                  className="bg-white/10 border-white/20"
                />

                <Input
                  label="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="01700000000"
                  required
                  className="bg-white/10 border-white/20"
                />

                <Input
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="123 Main Street"
                  required
                  className="bg-white/10 border-white/20"
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Dhaka"
                    required
                    className="bg-white/10 border-white/20"
                  />

                  <Input
                    label="Postal Code"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    placeholder="1200"
                    className="bg-white/10 border-white/20"
                  />
                </div>
              </form>
            </Card>

            {/* Payment Methods */}
            <Card glass className="backdrop-blur-xl p-6 border border-white/10">
              <h2 className="text-2xl font-bold mb-6">Payment Method</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  return (
                    <motion.div
                      key={method.value}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, paymentMethod: method.value })}
                        className={`w-full p-4 rounded-lg border-2 transition-all ${formData.paymentMethod === method.value
                          ? 'border-green-500 bg-green-500/20'
                          : 'border-white/20 bg-white/5 hover:border-white/40'
                          }`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <Icon className={formData.paymentMethod === method.value ? 'text-green-400' : 'text-gray-400'} size={24} />
                          <span className="font-bold">{method.label}</span>
                        </div>
                        <p className="text-sm text-gray-400 text-left">{method.desc}</p>
                      </button>
                    </motion.div>
                  );
                })}
              </div>

              <Button
                onClick={handleSubmit}
                className="w-full mt-6 gradient-primary text-lg py-6"
                size="lg"
                disabled={createOrder.isPending}
                loading={createOrder.isPending}
              >
                {formData.paymentMethod === 'COD' ? 'Place Order' : 'Proceed to Payment'}
              </Button>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card glass className="backdrop-blur-xl p-6 sticky top-5 border border-white/10">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div key={item.product._id} className="flex justify-between text-sm">
                    <span className="text-gray-300">
                      {item.product.name} x {item.quantity}
                    </span>
                    <span className="text-white font-medium">৳{item.product.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/10 pt-4 space-y-2">
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal</span>
                  <span>৳{total}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Shipping</span>
                  <span>৳100</span>
                </div>
                <div className="border-t border-white/10 pt-2 flex justify-between text-xl font-bold">
                  <span className="text-white">Total</span>
                  <span className="gradient-text">৳{total + 100}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Checkout;

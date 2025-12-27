import { useLocation, Link, Routes, Route } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { vendorAPI } from '../lib/api';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Tag,
  Store,
  Clock,
  ArrowRight
} from 'lucide-react';
import ProductsPage from '../vendor/Products';
import OrdersPage from '../vendor/Orders';
import CouponsPage from '../vendor/Coupons';

const VendorDashboard = () => {
  const location = useLocation();

  const { data: dashboard, isLoading } = useQuery({
    queryKey: ['vendor-dashboard'],
    queryFn: () => vendorAPI.getDashboard()
  });

  const stats = dashboard?.data || {};

  const menuItems = [
    { path: '/vendor', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/vendor/products', label: 'Products', icon: Package },
    { path: '/vendor/orders', label: 'Orders', icon: ShoppingBag },
    { path: '/vendor/coupons', label: 'Coupons', icon: Tag },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card glass className="backdrop-blur-xl p-6 sticky top-24 border-white/5 shadow-2xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-lg shadow-primary-500/20">
                <Store className="text-white" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black text-white">Vendor</h2>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Storefront</p>
              </div>
            </div>

            <nav className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                  >
                    <motion.div
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 ${isActive
                        ? 'gradient-primary text-white shadow-xl shadow-primary-500/20'
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                        }`}
                    >
                      <Icon size={20} className={isActive ? 'text-white' : ''} />
                      <span className="font-bold">{item.label}</span>
                    </motion.div>
                  </Link>
                );
              })}
            </nav>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Routes>
            <Route
              path="/"
              element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h1 className="text-6xl font-black mb-12 gradient-text">Store Overview</h1>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <Card glass className="p-8 border-l-4 border-primary-500 hover:translate-y-[-4px] transition-transform">
                      <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-2">Earnings</p>
                      <h3 className="text-4xl font-black text-white mb-1">৳{stats.totalSales || 0}</h3>
                      <p className="text-primary-400 font-bold text-sm">Total Sales</p>
                    </Card>
                    <Card glass className="p-8 border-l-4 border-accent-500 hover:translate-y-[-4px] transition-transform">
                      <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-2">Volume</p>
                      <h3 className="text-4xl font-black text-white mb-1">{stats.totalOrders || 0}</h3>
                      <p className="text-accent-400 font-bold text-sm">Total Orders</p>
                    </Card>
                    <Card glass className="p-8 border-l-4 border-green-500 hover:translate-y-[-4px] transition-transform">
                      <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-2">Wallet</p>
                      <h3 className="text-4xl font-black text-white mb-1">৳{stats.balance || 0}</h3>
                      <p className="text-green-400 font-bold text-sm">Available Balance</p>
                    </Card>
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    <Card glass className="p-8 border-white/5">
                      <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
                        <Clock className="text-primary-400" /> Recent Sales
                      </h2>
                      <div className="space-y-6">
                        <p className="text-gray-500 italic">No recent transactions to display.</p>
                      </div>
                    </Card>

                    <Card glass className="p-8 border-white/5 bg-linear-to-br from-white/5 to-transparent">
                      <h2 className="text-2xl font-black mb-4">Payout Request</h2>
                      <p className="text-sm text-gray-400 mb-8 leading-relaxed">
                        Withdraw your earnings to your registered bank account. Processing usually takes 2-3 business days.
                      </p>
                      <Button className="w-full gradient-primary py-8 text-lg shadow-xl shadow-primary-500/20" disabled={stats.balance < 500}>
                        Request Payout (Min ৳500)
                      </Button>
                    </Card>
                  </div>
                </motion.div>
              }
            />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/coupons" element={<CouponsPage />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;

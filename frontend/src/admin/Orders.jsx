import { useQuery } from '@tanstack/react-query';
import { adminAPI } from '../lib/api';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import Spinner from '../components/ui/Spinner';
import {
  ShoppingBag,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
  Package,
  Search,
  Filter
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Orders = () => {
  const { data: ordersResponse, isLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: () => adminAPI.getOrders()
  });

  if (isLoading) return <Spinner size="xl" className="py-20" />;

  const orders = ordersResponse?.data || [];

  const statusColors = {
    'PENDING': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    'SHIPPED': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    'DELIVERED': 'bg-green-500/10 text-green-400 border-green-500/20',
    'CANCELLED': 'bg-red-500/10 text-red-400 border-red-500/20',
    'RETURNED': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    'REFUNDED': 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-5xl font-black gradient-text">Orders</h1>
          <p className="text-gray-400 mt-2">Manage and track all customer transactions</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              placeholder="Search orders..."
              className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-primary-500 w-64"
            />
          </div>
          <Button variant="outline" className="gap-2 border-white/10 hover:bg-white/5">
            <Filter size={18} /> Filter
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {orders.length > 0 ? (
          orders.map((order) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card glass className="p-6 border-white/5 hover:bg-white/5 transition-all group">
                <Link to={`/admin/order/${order._id}`} className="flex flex-col lg:flex-row lg:items-center gap-6">
                  <div className="flex-1 flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-primary-500/10 flex items-center justify-center border border-primary-500/20">
                      <ShoppingBag className="text-primary-400" size={28} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-white font-bold font-mono">#{order._id.slice(-8).toUpperCase()}</h3>
                        <div className={`px-3 py-0.5 rounded-full text-[10px] font-black uppercase border ${statusColors[order.orderStatus] || 'bg-gray-500/10 text-gray-400 border-white/10'}`}>
                          {order.orderStatus}
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 flex items-center gap-2">
                        <span className="font-bold text-gray-400">{order.userId?.name || 'Guest'}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-700" />
                        <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-8 items-center lg:justify-end">
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 text-right">Items</p>
                      <p className="text-white font-black text-right">{order.items?.length || 0} Products</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 text-right">Amount</p>
                      <p className="text-xl font-black text-primary-400 text-right">৳{order.totalAmount}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                      <ArrowRight size={20} className="text-primary-400" />
                    </div>
                  </div>
                </Link>
              </Card>
            </motion.div>
          ))
        ) : (
          <Card glass className="py-20 text-center border-dashed border-white/10">
            <Package size={60} className="mx-auto text-gray-700 opacity-20 mb-4" />
            <h3 className="text-xl font-bold text-gray-400">No orders found</h3>
            <p className="text-gray-600 max-w-xs mx-auto mt-2">There are currently no orders in the system to manage.</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Orders;

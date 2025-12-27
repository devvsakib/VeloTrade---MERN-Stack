import { useQuery } from '@tanstack/react-query';
import { adminAPI } from '../lib/api';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/card';
import Spinner from '../components/ui/Spinner';
import {
    ShoppingBag,
    Clock,
    CheckCircle,
    Truck,
    Package,
    ArrowRight
} from 'lucide-react';

const Orders = () => {
    const { data: orders, isLoading } = useQuery({
        queryKey: ['vendor-orders'],
        queryFn: () => adminAPI.getOrders() // Backend filter for specific vendor items
    });

    if (isLoading) return <Spinner size="xl" className="py-20" />;

    return (
        <div className="space-y-8">
            <h1 className="text-5xl font-black gradient-text">Orders</h1>

            <div className="space-y-4">
                {orders?.data?.map((order) => (
                    <motion.div
                        key={order._id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <Card glass className="p-6 border-white/5 hover:bg-white/8 transition-all">
                            <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                                <div className="flex-1 flex items-center gap-4">
                                    <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
                                        <ShoppingBag className="text-primary-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Order ID</p>
                                        <h3 className="text-white font-bold font-mono">#{order._id.slice(-8).toUpperCase()}</h3>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-8 items-center lg:justify-end">
                                    <div>
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 text-right">Items</p>
                                        <p className="text-white font-black text-right">{order.items?.length} sku</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 text-right">Total</p>
                                        <p className="text-xl font-black text-primary-400 text-right">৳{order.totalAmount}</p>
                                    </div>
                                    <div>
                                        <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase flex items-center gap-2 ${order.orderStatus === 'DELIVERED' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                                                order.orderStatus === 'CANCELLED' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                                                    'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                                            }`}>
                                            {order.orderStatus === 'PENDING' && <Clock size={12} />}
                                            {order.orderStatus === 'SHIPPED' && <Truck size={12} />}
                                            {order.orderStatus === 'DELIVERED' && <CheckCircle size={12} />}
                                            {order.orderStatus}
                                        </div>
                                    </div>
                                    <button className="text-gray-500 hover:text-white transition-colors">
                                        <ArrowRight size={20} />
                                    </button>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}

                {!orders?.data?.length && (
                    <div className="text-center py-32 space-y-4">
                        <Package size={60} className="mx-auto text-gray-700 opacity-20" />
                        <p className="text-gray-500 font-medium">No orders found for your shop yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;

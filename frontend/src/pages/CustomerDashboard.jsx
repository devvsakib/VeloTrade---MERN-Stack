import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    ShoppingBag,
    Heart,
    User,
    Settings,
    Package,
    Clock,
    ChevronRight,
    Star
} from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { ordersAPI, wishlistAPI } from '../lib/api';
import Spinner from '../components/ui/Spinner';

const CustomerDashboard = () => {
    const { data: orders, isLoading: loadingOrders } = useQuery({
        queryKey: ['my-orders-summary'],
        queryFn: () => ordersAPI.getMy()
    });

    const { data: wishlist, isLoading: loadingWishlist } = useQuery({
        queryKey: ['wishlist-summary'],
        queryFn: () => wishlistAPI.get()
    });

    if (loadingOrders || loadingWishlist) return <Spinner size="xl" className="min-h-screen" />;

    const recentOrders = orders?.data?.slice(0, 3) || [];
    const wishlistCount = wishlist?.data?.products?.length || 0;
    const totalSpent = orders?.data?.reduce((sum, order) => sum + (order.totalAmount || 0), 0) || 0;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-12"
            >
                {/* Welcome Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-6xl font-black gradient-text">My Account</h1>
                        <p className="text-gray-400 mt-2 text-lg">Manage your orders and preferences</p>
                    </div>
                    <div className="flex gap-4">
                        <Link to="/profile">
                            <Button variant="outline" className="gap-2 border-white/10 hover:bg-white/5">
                                <Settings size={18} /> Settings
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card glass className="p-8 border-l-4 border-primary-500 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <ShoppingBag size={80} />
                        </div>
                        <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-2">Total Shopping</p>
                        <h3 className="text-4xl font-black text-white mb-1">৳{totalSpent}</h3>
                        <p className="text-primary-400 font-bold text-sm">Lifetime Spend</p>
                    </Card>

                    <Card glass className="p-8 border-l-4 border-accent-500 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Package size={80} />
                        </div>
                        <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-2">Activities</p>
                        <h3 className="text-4xl font-black text-white mb-1">{orders?.data?.length || 0}</h3>
                        <p className="text-accent-400 font-bold text-sm">Total Orders</p>
                    </Card>

                    <Card glass className="p-8 border-l-4 border-rose-500 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Heart size={80} />
                        </div>
                        <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-2">Favorite</p>
                        <h3 className="text-4xl font-black text-white mb-1">{wishlistCount}</h3>
                        <p className="text-rose-400 font-bold text-sm">Saved Items</p>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Orders */}
                    <Card glass className="lg:col-span-2 p-8 border-white/5 h-fit">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-black text-white flex items-center gap-3">
                                <Clock className="text-primary-400" /> Recent Orders
                            </h2>
                            <Link to="/orders">
                                <Button variant="ghost" className="text-primary-400 hover:text-primary-300 gap-1 text-sm">
                                    View All <ChevronRight size={16} />
                                </Button>
                            </Link>
                        </div>

                        <div className="space-y-4">
                            {recentOrders.length > 0 ? (
                                recentOrders.map((order) => (
                                    <div key={order._id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-400">
                                                <Package size={24} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-white uppercase text-sm">#{order._id.slice(-8)}</p>
                                                <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-white font-black text-lg">৳{order.totalAmount}</p>
                                            <span className="text-[10px] font-black uppercase text-primary-400/80 tracking-widest">{order.orderStatus}</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-12 text-center text-gray-600">
                                    <ShoppingBag size={48} className="mx-auto opacity-20 mb-4" />
                                    <p>No orders yet. Discover our latest products!</p>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Left Sidebar: Profile Summary */}
                    <div className="space-y-8">
                        <Card glass className="p-8 border-white/5 bg-linear-to-br from-primary-500/10 to-transparent">
                            <h2 className="text-xl font-black mb-6 flex items-center gap-2">
                                <User className="text-primary-400" /> My Profile
                            </h2>
                            <div className="space-y-6">
                                <div className="flex items-center gap-4 py-2 border-b border-white/5">
                                    <div className="w-14 h-14 rounded-full bg-primary-500 flex items-center justify-center text-xl font-bold text-white shadow-xl shadow-primary-500/20">
                                        U
                                    </div>
                                    <div>
                                        <p className="text-white font-bold">User Account</p>
                                        <p className="text-xs text-gray-500">Premium Member</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-400">Review Points</span>
                                        <span className="text-white font-bold flex items-center gap-1"><Star size={14} className="text-yellow-500 fill-yellow-500" /> 1240</span>
                                    </div>
                                    <Button className="w-full gradient-primary py-6 shadow-xl shadow-primary-500/20">Edit Profile</Button>
                                    <Button variant="outline" className="w-full border-white/10 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 py-6">Log Out</Button>
                                </div>
                            </div>
                        </Card>

                        <Link to="/wishlist">
                            <Card glass className="p-8 border-white/5 hover:border-rose-500/30 transition-all group overflow-hidden relative">
                                <div className="absolute -bottom-8 -right-8 opacity-5 group-hover:scale-110 transition-transform">
                                    <Heart size={120} />
                                </div>
                                <h2 className="text-xl font-black mb-1 flex items-center gap-2 relative z-10">
                                    <Heart className="text-rose-500 fill-rose-500" size={20} /> My Wishlist
                                </h2>
                                <p className="text-sm text-gray-400 relative z-10">{wishlistCount} items saved to your favorites</p>
                                <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-700 group-hover:text-rose-500 transition-colors" />
                            </Card>
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default CustomerDashboard;

import UsersPage from '../admin/Users';
import VendorsPage from '../admin/Vendors';
import CategoriesPage from '../admin/Categories';
import DisputesPage from '../admin/Disputes';
import OrdersPage from '../admin/Orders';
import OrderDetailPage from '../admin/OrderDetail';
import { useQueryClient } from '@tanstack/react-query';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    Store,
    FolderTree,
    ShoppingBag,
    AlertTriangle,
    CheckCircle,
    Clock
} from 'lucide-react';
import { Card } from '../components/ui/card';
import { motion } from 'framer-motion';


const AdminDashboard = () => {
    const location = useLocation();
    const queryClient = useQueryClient();

    const menuItems = [
        { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/admin/users', label: 'Users', icon: Users },
        { path: '/admin/vendors', label: 'Vendors', icon: Store },
        { path: '/admin/categories', label: 'Categories', icon: FolderTree },
        { path: '/admin/orders', label: 'Orders', icon: ShoppingBag },
        { path: '/admin/disputes', label: 'Disputes', icon: AlertTriangle },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <Card glass className="backdrop-blur-xl p-6 sticky top-24 border-white/5 shadow-2xl">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-lg shadow-primary-500/20">
                                <LayoutDashboard className="text-white" size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-white">Admin</h2>
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Management</p>
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
                                            <Icon size={20} className={isActive ? 'text-white' : 'group-hover:text-white'} />
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
                                    <h1 className="text-6xl font-black mb-12 gradient-text">Control Center</h1>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                                        <Card glass className="p-8 border-l-4 border-primary-500 hover:translate-y-[-4px] transition-transform">
                                            <p className="text-gray-500 text-xs font-black uppercase tracking-widest mb-2">Network Hub</p>
                                            <h3 className="text-4xl font-black text-white mb-1">System Health</h3>
                                            <p className="text-green-400 font-bold text-sm">Operational</p>
                                        </Card>
                                        <Card glass className="p-8 border-l-4 border-accent-500 hover:translate-y-[-4px] transition-transform">
                                            <p className="text-gray-500 text-xs font-black uppercase tracking-widest mb-2">Growth</p>
                                            <h3 className="text-4xl font-black text-white mb-1">+24%</h3>
                                            <p className="text-gray-400 font-bold text-sm">Monthly Revenue</p>
                                        </Card>
                                        <Card glass className="p-8 border-l-4 border-emerald-500 hover:translate-y-[-4px] transition-transform">
                                            <p className="text-gray-500 text-xs font-black uppercase tracking-widest mb-2">Activity</p>
                                            <h3 className="text-4xl font-black text-white mb-1">Active</h3>
                                            <p className="text-emerald-400 font-bold text-sm">12 Vendors Online</p>
                                        </Card>
                                    </div>

                                    <Card glass className="p-12 border-dashed border-white/10 flex flex-col items-center justify-center text-center">
                                        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                                            <LayoutDashboard size={40} className="text-gray-600" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-300 mb-2">Welcome Back, Admin</h2>
                                        <p className="text-gray-500 max-w-sm">Use the sidebar to manage users, verify vendors, and keep the marketplace running smoothly.</p>
                                    </Card>
                                </motion.div>
                            }
                        />

                        <Route path="/users" element={<UsersPage />} />
                        <Route path="/vendors" element={<VendorsPage />} />
                        <Route path="/categories" element={<CategoriesPage />} />
                        <Route path="/orders" element={<OrdersPage />} />
                        <Route path="/order/:id" element={<OrderDetailPage />} />
                        <Route path="/disputes" element={<DisputesPage />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

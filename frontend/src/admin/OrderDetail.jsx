import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { adminAPI } from '../lib/api';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import Spinner from '../components/ui/Spinner';
import {
    ArrowLeft,
    Package,
    User,
    MapPin,
    CreditCard,
    Clock,
    CheckCircle,
    XCircle,
    RefreshCcw,
    Truck,
    Download
} from 'lucide-react';
import { toast } from 'sonner';

const OrderDetail = () => {
    const { id } = useParams();
    const queryClient = useQueryClient();

    const { data: orderResponse, isLoading } = useQuery({
        queryKey: ['admin-order', id],
        queryFn: () => adminAPI.getOrderById(id)
    });

    const updateStatusMutation = useMutation({
        mutationFn: (status) => adminAPI.updateOrderStatus(id, { orderStatus: status }),
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-order', id]);
            toast.success('Order status updated');
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || 'Failed to update status');
        }
    });

    if (isLoading) return <Spinner size="xl" className="py-20" />;

    const handleDownloadInvoice = async () => {
        try {
            const response = await adminAPI.downloadInvoice(id);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `invoice-${id}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            toast.error('Failed to download invoice');
        }
    };

    const order = orderResponse?.data;
    if (!order) return <div className="text-center py-20 text-gray-500">Order not found.</div>;

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
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link to="/admin/orders">
                        <Button variant="ghost" size="icon" className="hover:bg-white/5">
                            <ArrowLeft size={20} />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-black text-white flex items-center gap-3">
                            Order <span className="text-primary-400 font-mono text-xl">#{order._id.slice(-8).toUpperCase()}</span>
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}</p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <Button variant="outline" className="gap-2 border-white/10 hover:bg-white/5" onClick={handleDownloadInvoice}>
                        <Download size={18} /> Invoice
                    </Button>
                    {order.orderStatus === 'PENDING' && (
                        <Button className="gradient-primary gap-2" onClick={() => updateStatusMutation.mutate('SHIPPED')}>
                            <Truck size={18} /> Ship Order
                        </Button>
                    )}
                    {order.orderStatus === 'SHIPPED' && (
                        <Button className="bg-green-500 hover:bg-green-600 text-white gap-2" onClick={() => updateStatusMutation.mutate('DELIVERED')}>
                            <CheckCircle size={18} /> Mark Delivered
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Left Column: Details */}
                <div className="xl:col-span-2 space-y-8">
                    <Card glass className="p-8 border-white/5 overflow-hidden">
                        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                            <h2 className="text-xl font-bold flex items-center gap-3">
                                <Package className="text-primary-400" /> Order Items
                            </h2>
                            <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase border ${statusColors[order.orderStatus] || 'bg-gray-500/10 text-gray-400 border-white/10'}`}>
                                {order.orderStatus}
                            </div>
                        </div>

                        <div className="space-y-6">
                            {order.items?.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-xl bg-white/5 flex items-center justify-center text-2xl border border-white/10 group-hover:border-primary-500/30 transition-colors">
                                            📦
                                        </div>
                                        <div>
                                            <p className="text-white font-bold text-lg group-hover:text-primary-400 transition-colors">{item.name}</p>
                                            <p className="text-xs text-gray-500">SKU: {item.product?.slice(-6).toUpperCase() || 'N/A'}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-white font-black text-lg">৳{item.price}</p>
                                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-12 pt-8 border-t border-white/5 space-y-3">
                            <div className="flex justify-between text-gray-400 font-medium">
                                <span>Subtotal</span>
                                <span>৳{order.totalAmount}</span>
                            </div>
                            <div className="flex justify-between text-gray-400 font-medium">
                                <span>Shipping Fee</span>
                                <span className="text-green-400">FREE</span>
                            </div>
                            <div className="flex justify-between text-2xl font-black text-white pt-4">
                                <span>Total</span>
                                <span className="text-primary-400">৳{order.totalAmount}</span>
                            </div>
                        </div>
                    </Card>

                    <Card glass className="p-8 border-white/5">
                        <h2 className="text-xl font-bold mb-8 flex items-center gap-3">
                            <Clock className="text-primary-400" /> Order Timeline
                        </h2>
                        <div className="space-y-8 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-white/5">
                            <div className="flex gap-6 relative z-10">
                                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center ring-4 ring-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.4)]">
                                    <CheckCircle size={12} className="text-white" />
                                </div>
                                <div>
                                    <p className="text-white font-bold">Order Placed</p>
                                    <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleString()}</p>
                                </div>
                            </div>
                            {order.orderStatus !== 'PENDING' && (
                                <div className="flex gap-6 relative z-10">
                                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center ring-4 ring-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.4)]">
                                        <Truck size={12} className="text-white" />
                                    </div>
                                    <div>
                                        <p className="text-white font-bold">Order Shipped</p>
                                        <p className="text-xs text-gray-400">Ready for transit</p>
                                    </div>
                                </div>
                            )}
                            {order.orderStatus === 'DELIVERED' && (
                                <div className="flex gap-6 relative z-10">
                                    <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center ring-4 ring-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                                        <CheckCircle size={12} className="text-white" />
                                    </div>
                                    <div>
                                        <p className="text-white font-bold">Delivered</p>
                                        <p className="text-xs text-gray-400">Successfully hand over</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>

                {/* Right Column: Customer & Payment */}
                <div className="space-y-8">
                    <Card glass className="p-8 border-white/5">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                            <User className="text-primary-400" /> Customer Information
                        </h2>
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-xl font-bold text-white">
                                    {order.userId?.name?.[0]?.toUpperCase() || 'U'}
                                </div>
                                <div>
                                    <p className="text-white font-bold">{order.userId?.name || 'Guest User'}</p>
                                    <p className="text-xs text-gray-500">{order.userId?.email || 'no-email@example.com'}</p>
                                </div>
                            </div>
                            <Link to={`/admin/users?search=${encodeURIComponent(order.userId?.email || '')}`}>
                                <Button variant="outline" className="w-full border-white/10 hover:bg-white/5 text-xs font-bold uppercase tracking-widest py-6">
                                    View Customer Profile
                                </Button>
                            </Link>
                        </div>
                    </Card>

                    <Card glass className="p-8 border-white/5">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                            <MapPin className="text-primary-400" /> Shipping Address
                        </h2>
                        <div className="space-y-4">
                            <p className="text-white leading-relaxed">
                                {order.shippingAddress?.street}<br />
                                {order.shippingAddress?.city}, {order.shippingAddress?.state}<br />
                                {order.shippingAddress?.zipCode}, {order.shippingAddress?.country}
                            </p>
                            <div className="pt-4 mt-4 border-t border-white/5 flex items-center gap-2 text-primary-400 text-sm font-bold">
                                <Truck size={16} /> <span>Home Delivery</span>
                            </div>
                        </div>
                    </Card>

                    <Card glass className="p-8 border-white/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl" />
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-3 relative z-10">
                            <CreditCard className="text-primary-400" /> Payment Details
                        </h2>
                        <div className="space-y-4 relative z-10">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400">Method</span>
                                <span className="text-white font-bold">{order.paymentMethod?.name || 'Online Payment'}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400">Status</span>
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${order.paymentStatus === 'paid' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'} border`}>
                                    {order.paymentStatus}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400">Transaction ID</span>
                                <span className="text-white font-mono text-xs">{order.paymentId || 'N/A'}</span>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default OrderDetail;

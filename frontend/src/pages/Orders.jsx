import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ordersAPI, adminAPI } from '../lib/api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Spinner from '../components/ui/Spinner';
import { Package, Clock, CheckCircle, XCircle, AlertTriangle, RefreshCcw, ShoppingBag, Download } from 'lucide-react';
import { toast } from 'sonner';

const statusIcons = {
    PLACED: <Clock className="text-blue-400" />,
    PROCESSING: <Package className="text-yellow-400" />,
    SHIPPED: <Package className="text-purple-400" />,
    DELIVERED: <CheckCircle className="text-green-400" />,
    CANCELLED: <XCircle className="text-red-400" />,
    DISPUTED: <AlertTriangle className="text-orange-400" />
};

const Orders = () => {
    const queryClient = useQueryClient();
    const { data: orders, isLoading } = useQuery({
        queryKey: ['my-orders'],
        queryFn: () => ordersAPI.getMy()
    });

    const refundMutation = useMutation({
        mutationFn: (data) => ordersAPI.requestRefund(data),
        onSuccess: () => {
            queryClient.invalidateQueries(['my-orders']);
            toast.success('Refund request submitted');
        },
        onError: (err) => toast.error(err.response?.data?.message || 'Failed to request refund')
    });

    const disputeMutation = useMutation({
        mutationFn: (data) => adminAPI.createDispute(data),
        onSuccess: () => {
            queryClient.invalidateQueries(['my-orders']);
            toast.success('Dispute case created');
        }
    });

    const handleRefund = (orderId) => {
        const reason = prompt('Please enter reason for refund:');
        if (reason) refundMutation.mutate({ orderId, reason });
    };

    const handleDispute = (orderId) => {
        const reason = prompt('Please enter reason for dispute:');
        if (reason) disputeMutation.mutate({ orderId, reason });
    };

    const handleDownloadInvoice = async (id) => {
        try {
            const response = await ordersAPI.downloadInvoice(id);
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

    if (isLoading) return <Spinner size="xl" className="min-h-screen" />;

    const orderList = orders?.data || [];

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-6xl font-black mb-12 gradient-text">Purchase History</h1>

                {orderList.length === 0 ? (
                    <Card glass className="py-32 text-center border-dashed border-white/10">
                        <ShoppingBag size={80} className="mx-auto text-gray-800 mb-6" />
                        <p className="text-gray-500 text-xl font-medium">You haven't placed any orders yet.</p>
                        <Button className="mt-8 bg-linear-to-br from-primary-500/20 to-purple-500/20 px-8" onClick={() => window.location.href = '/products'}>Start Shopping</Button>
                    </Card>
                ) : (
                    <div className="grid gap-8">
                        {orderList.map((order) => (
                            <motion.div
                                key={order._id}
                                layout
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <Card glass className="p-8 border-white/5 group relative overflow-hidden transition-all hover:bg-white/8">
                                    <div className="flex flex-col xl:flex-row justify-between gap-8">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/5">
                                                <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                                                    {statusIcons[order.orderStatus] || <Package className="text-gray-400" />}
                                                </div>
                                                <div>
                                                    <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Order ID</p>
                                                    <h3 className="text-xl font-bold text-white uppercase">#{order._id.slice(-8)}</h3>
                                                    <p className="text-sm text-gray-400 mt-1">{new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                                </div>
                                            </div>

                                            <div className="space-y-4 mb-8">
                                                {order.items.map((item, idx) => (
                                                    <div key={idx} className="flex items-center justify-between group/item">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-lg">📦</div>
                                                            <div>
                                                                <p className="text-white font-bold group-hover:text-primary-400 transition-colors">{item.name}</p>
                                                                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                                            </div>
                                                        </div>
                                                        <p className="font-bold text-white">৳{item.price * item.quantity}</p>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-6 border-t border-white/5">
                                                <div>
                                                    <p className="text-[10px] font-black text-gray-500 uppercase mb-1">Status</p>
                                                    <span className="text-sm font-bold text-white flex items-center gap-1">
                                                        {order.orderStatus}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-gray-500 uppercase mb-1">Payment</p>
                                                    <span className={`text-sm font-bold ${order.paymentStatus === 'PAID' ? 'text-green-400' : 'text-yellow-400'}`}>
                                                        {order.paymentStatus}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-gray-500 uppercase mb-1">Method</p>
                                                    <span className="text-sm font-bold text-gray-300 uppercase">{order.paymentMethod}</span>
                                                </div>
                                                <div className="text-right lg:text-left">
                                                    <p className="text-[10px] font-black text-gray-500 uppercase mb-1">Total</p>
                                                    <span className="text-2xl font-black gradient-text">৳{order.totalAmount}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-3 min-w-[200px] justify-center xl:border-l xl:border-white/5 xl:pl-8 pt-6 xl:pt-0">
                                            {order.paymentStatus === 'PAID' && order.orderStatus !== 'CANCELLED' && (
                                                <Button
                                                    onClick={() => handleRefund(order._id)}
                                                    className="w-full bg-white/5 border border-white/10 hover:bg-primary-500 hover:text-white transition-all py-6 gap-2"
                                                >
                                                    <RefreshCcw size={18} /> Request Refund
                                                </Button>
                                            )}
                                            {order.orderStatus !== 'CANCELLED' && order.orderStatus !== 'DISPUTED' && (
                                                <Button
                                                    onClick={() => handleDispute(order._id)}
                                                    variant="outline"
                                                    className="w-full border-white/10 text-gray-400 hover:text-orange-400 hover:border-orange-400/50 py-6 gap-2"
                                                >
                                                    <AlertTriangle size={18} /> File Dispute
                                                </Button>
                                            )}
                                            <Button
                                                variant="ghost"
                                                className="text-xs text-gray-500 hover:text-white gap-2"
                                                onClick={() => handleDownloadInvoice(order._id)}
                                            >
                                                <Download size={14} /> Download Invoice
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default Orders;

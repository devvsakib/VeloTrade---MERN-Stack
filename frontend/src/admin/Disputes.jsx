import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminAPI } from '../lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import Spinner from '../components/ui/Spinner';
import {
    AlertTriangle,
    CheckCircle,
    XCircle,
    RefreshCcw,
    User,
    ShoppingBag,
    MessageSquare,
    DollarSign
} from 'lucide-react';
import { toast } from 'sonner';

const Disputes = () => {
    const queryClient = useQueryClient();
    const [filterEmail, setFilterEmail] = useState('');

    const { data: disputesResponse, isLoading } = useQuery({
        queryKey: ['admin-disputes', filterEmail],
        queryFn: () => adminAPI.getDisputes(filterEmail ? { email: filterEmail } : {})
    });

    const resolveMutation = useMutation({
        mutationFn: ({ id, data }) => adminAPI.resolveDispute(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-disputes']);
            toast.success('Dispute resolved');
        }
    });

    const handleResolve = (id, status, currentOrderAmount) => {
        let refundAmount = 0;
        if (status === 'RESOLVED') {
            const input = prompt(`Enter refund amount (Max ৳${currentOrderAmount}):`, currentOrderAmount);
            if (input === null) return;
            refundAmount = parseFloat(input);
        }
        const adminNote = prompt('Admin internal note:');

        resolveMutation.mutate({
            id,
            data: { status, refundAmount, adminNote }
        });
    };

    if (isLoading) return <Spinner size="xl" className="py-20" />;

    const disputes = disputesResponse?.data || [];
    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-5xl font-black gradient-text">Disputes & Refunds</h1>
                <input
                    type="email"
                    placeholder="Filter by customer email..."
                    className="bg-white/5 border border-white/10 rounded-full py-2 px-6 focus:outline-none focus:border-primary-500 w-full md:w-80 transition-all font-medium"
                    value={filterEmail}
                    onChange={(e) => setFilterEmail(e.target.value)}
                />
            </div>

            <div className="grid gap-6">
                <AnimatePresence mode='popLayout'>
                    {disputes?.map((dispute) => (
                        <motion.div
                            key={dispute._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <Card glass className={`p-8 border-l-4 ${dispute.status === 'PENDING' ? 'border-yellow-500' :
                                    dispute.status === 'RESOLVED' ? 'border-green-500' :
                                        'border-red-500'
                                }`}>
                                <div className="flex flex-col xl:flex-row gap-8">
                                    <div className="flex-1 space-y-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-lg ${dispute.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500' :
                                                        dispute.status === 'RESOLVED' ? 'bg-green-500/10 text-green-500' :
                                                            'bg-red-500/10 text-red-500'
                                                    }`}>
                                                    <AlertTriangle size={24} />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Dispute ID</p>
                                                    <p className="font-mono text-sm text-gray-300">#{dispute._id}</p>
                                                </div>
                                            </div>
                                            <span className={`px-4 py-1 rounded-full text-xs font-black ${dispute.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-500' :
                                                    dispute.status === 'RESOLVED' ? 'bg-green-500/20 text-green-500' :
                                                        'bg-red-500/20 text-red-500'
                                                }`}>
                                                {dispute.status}
                                            </span>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex gap-8 border-b border-white/5 pb-4">
                                                <div className="space-y-1">
                                                    <p className="text-xs font-bold text-gray-500 flex items-center gap-1 uppercase tracking-tighter"><User size={12} /> Customer</p>
                                                    <p className="text-white font-bold">{dispute.userId?.name || 'Unknown'}</p>
                                                    <p className="text-xs text-gray-400">{dispute.userId?.email}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-xs font-bold text-gray-500 flex items-center gap-1 uppercase tracking-tighter"><ShoppingBag size={12} /> Order</p>
                                                    <p className="text-white font-bold">৳{dispute.orderId?.totalAmount}</p>
                                                    <p className="text-xs text-gray-400">ID: {dispute.orderId?._id}</p>
                                                </div>
                                            </div>

                                            <div className="space-y-1">
                                                <p className="text-xs font-bold text-gray-500 flex items-center gap-1 uppercase tracking-tighter"><MessageSquare size={12} /> Reason</p>
                                                <p className="text-gray-300 italic leading-relaxed">"{dispute.reason}"</p>
                                            </div>

                                            {dispute.refundAmount > 0 && (
                                                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 flex items-center gap-3">
                                                    <DollarSign className="text-green-500" />
                                                    <div>
                                                        <p className="text-xs font-bold text-green-500/80 uppercase">Refund Issued</p>
                                                        <p className="text-xl font-black text-green-400">৳{dispute.refundAmount}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {dispute.status === 'PENDING' && (
                                        <div className="flex flex-col gap-3 min-w-[200px] justify-center border-t xl:border-t-0 xl:border-l border-white/5 pl-0 xl:pl-8 pt-6 xl:pt-0">
                                            <Button
                                                className="gradient-primary py-6"
                                                onClick={() => handleResolve(dispute._id, 'RESOLVED', dispute.orderId?.totalAmount)}
                                            >
                                                <CheckCircle className="mr-2" size={18} /> Resolve & Refund
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                className="py-6"
                                                onClick={() => handleResolve(dispute._id, 'REJECTED')}
                                            >
                                                <XCircle className="mr-2" size={18} /> Reject Claim
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                    {!disputes?.length && (
                        <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/5 border-dashed">
                            <RefreshCcw size={48} className="mx-auto text-gray-700 mb-4 animate-spin-slow" />
                            <p className="text-gray-500 font-medium">No disputes found matching your criteria</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Disputes;

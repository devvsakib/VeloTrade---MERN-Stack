import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminAPI } from '../lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import Spinner from '../components/ui/Spinner';
import {
    Store,
    CheckCircle,
    XCircle,
    Clock,
    Percent,
    Wallet,
    Phone,
    MapPin,
    ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';

const Vendors = () => {
    const queryClient = useQueryClient();

    const { data: vendorsResponse, isLoading } = useQuery({
        queryKey: ['admin-vendors'],
        queryFn: () => adminAPI.getVendors()
    });

    const updateStatusMutation = useMutation({
        mutationFn: ({ id, status }) => adminAPI.updateVendorStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-vendors']);
            toast.success('Vendor status updated');
        }
    });

    const updateCommissionMutation = useMutation({
        mutationFn: ({ id, rate }) => adminAPI.updateVendorCommission(id, rate),
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-vendors']);
            toast.success('Commission rate updated');
        }
    });

    if (isLoading) return <Spinner size="xl" className="py-20" />;

    const vendors = vendorsResponse?.data || [];

    return (
        <div className="space-y-8">
            <h1 className="text-5xl font-black gradient-text">Vendor Management</h1>

            <div className="grid gap-6">
                <AnimatePresence mode='popLayout'>
                    {vendors.map((vendor) => (
                        <motion.div
                            key={vendor._id}
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            <Card glass className="p-8 border-white/5 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Store size={80} />
                                </div>

                                <div className="flex flex-col lg:flex-row gap-8">
                                    <div className="flex-1 space-y-4">
                                        <div className="flex items-center gap-3">
                                            <h2 className="text-3xl font-black text-white">{vendor.shopName}</h2>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${vendor.status === 'APPROVED' ? 'bg-green-500/20 text-green-400' :
                                                vendor.status === 'REJECTED' ? 'bg-red-500/20 text-red-400' :
                                                    'bg-yellow-500/20 text-yellow-400'
                                                }`}>
                                                {vendor.status}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-400">
                                            <p className="flex items-center gap-2"><Phone size={16} /> {vendor.phone}</p>
                                            <p className="flex items-center gap-2"><MapPin size={16} /> {vendor.address}</p>
                                            <p className="flex items-center gap-2"><Wallet size={16} className="text-green-500" /> Balance: ৳{vendor.balance}</p>
                                            <p className="flex items-center gap-2"><Percent size={16} className="text-primary-400" /> Commission: {vendor.commissionRate}%</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-4 min-w-[200px]">
                                        <div className="space-y-2">
                                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Quick Actions</p>
                                            <div className="flex gap-2">
                                                <Button
                                                    className="flex-1 gradient-primary"
                                                    size="sm"
                                                    onClick={() => updateStatusMutation.mutate({ id: vendor._id, status: 'APPROVED' })}
                                                    disabled={vendor.status === 'APPROVED'}
                                                >
                                                    Approve
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => updateStatusMutation.mutate({ id: vendor._id, status: 'REJECTED' })}
                                                    disabled={vendor.status === 'REJECTED'}
                                                >
                                                    Reject
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Update Commission</p>
                                            <div className="flex gap-2">
                                                <input
                                                    type="number"
                                                    defaultValue={vendor.commissionRate}
                                                    className="w-20 bg-white/5 border border-white/10 rounded px-2 py-1 text-sm focus:outline-none focus:border-primary-500"
                                                    onBlur={(e) => {
                                                        const val = parseFloat(e.target.value);
                                                        if (val !== vendor.commissionRate) {
                                                            updateCommissionMutation.mutate({ id: vendor._id, rate: val });
                                                        }
                                                    }}
                                                />
                                                <span className="text-gray-400 flex items-center">%</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Vendors;

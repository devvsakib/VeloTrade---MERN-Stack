import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { couponsAPI, productsAPI } from '../lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import Spinner from '../components/ui/Spinner';
import {
    Ticket,
    Plus,
    Trash2,
    Calendar,
    Briefcase,
    LayoutGrid,
    CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';

const Coupons = () => {
    const queryClient = useQueryClient();
    const [isAdding, setIsAdding] = useState(false);

    const { data: coupons, isLoading } = useQuery({
        queryKey: ['vendor-coupons'],
        queryFn: () => couponsAPI.getAll() // Backend filter for logged in vendor
    });

    const { data: products } = useQuery({
        queryKey: ['vendor-products'],
        queryFn: () => productsAPI.getAll({ my: true })
    });

    const createMutation = useMutation({
        mutationFn: (data) => couponsAPI.createVendor(data),
        onSuccess: () => {
            queryClient.invalidateQueries(['vendor-coupons']);
            setIsAdding(false);
            toast.success('Coupon created successfully');
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        createMutation.mutate(data);
    };

    if (isLoading) return <Spinner size="xl" className="py-20" />;

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-5xl font-black gradient-text">Coupons</h1>
                <Button onClick={() => setIsAdding(!isAdding)} className="gradient-primary gap-2">
                    <Plus size={18} /> Add Coupon
                </Button>
            </div>

            <AnimatePresence>
                {isAdding && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
                        <Card glass className="p-8 border-white/10">
                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase">Coupon Code</label>
                                    <input name="code" required placeholder="E.g. SUMMER50" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 uppercase font-black" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase">Discount Amount (৳)</label>
                                    <input name="discountAmount" type="number" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase">Min Purchase (৳)</label>
                                    <input name="minPurchase" type="number" defaultValue="0" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase">Expiry Date</label>
                                    <input name="expiryDate" type="date" required className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase">Scope</label>
                                    <select name="scope" className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500">
                                        <option value="VENDOR">All Store Products</option>
                                        <option value="PRODUCT">Specific Product</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase">Target Product (Optional)</label>
                                    <select name="productId" className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500">
                                        <option value="">None</option>
                                        {products?.data?.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                                    </select>
                                </div>
                                <div className="lg:col-span-3">
                                    <Button type="submit" className="gradient-primary px-12" disabled={createMutation.isPending}>
                                        {createMutation.isPending ? 'Generating...' : 'Create Coupon'}
                                    </Button>
                                </div>
                            </form>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {coupons?.data?.map((coupon) => (
                    <motion.div key={coupon._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <Card glass className="p-0 overflow-hidden border-white/5 group relative">
                            <div className="h-2 bg-gradient-primary" />
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="bg-primary-500/10 p-2 rounded-lg text-primary-400">
                                        <Ticket size={24} />
                                    </div>
                                    <span className={`px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest ${new Date(coupon.expiryDate) > new Date() ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                                        }`}>
                                        {new Date(coupon.expiryDate) > new Date() ? 'Active' : 'Expired'}
                                    </span>
                                </div>

                                <h3 className="text-3xl font-black text-white mb-1 group-hover:text-primary-400 transition-colors uppercase">
                                    {coupon.code}
                                </h3>
                                <p className="text-sm text-gray-400 mb-6 flex items-center gap-2">
                                    ৳{coupon.discountAmount} OFF • Min Spend ৳{coupon.minPurchase}
                                </p>

                                <div className="space-y-3 pt-4 border-t border-white/5">
                                    <div className="flex items-center gap-2 text-xs text-gray-400">
                                        <Calendar size={14} className="text-accent-400" />
                                        <span>Expires: {new Date(coupon.expiryDate).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-400">
                                        <Briefcase size={14} className="text-primary-400" />
                                        <span className="font-bold uppercase tracking-tighter">{coupon.scope}</span>
                                    </div>
                                    {coupon.productId && (
                                        <div className="flex items-center gap-2 text-[10px] text-gray-500">
                                            <LayoutGrid size={12} />
                                            <span className="line-clamp-1 italic">Target: {products?.data?.find(p => p._id === coupon.productId)?.name || 'Product ID: ' + coupon.productId}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Coupons;

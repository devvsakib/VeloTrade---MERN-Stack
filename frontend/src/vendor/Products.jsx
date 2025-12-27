import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsAPI, categoriesAPI } from '../lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import Spinner from '../components/ui/Spinner';
import {
    Package,
    Plus,
    Trash2,
    Edit,
    Tag,
    Layers,
    ImageIcon,
    PackageX
} from 'lucide-react';
import { toast } from 'sonner';

const Products = () => {
    const queryClient = useQueryClient();
    const [isAdding, setIsAdding] = useState(false);

    const { data: products, isLoading } = useQuery({
        queryKey: ['vendor-products'],
        queryFn: () => productsAPI.getAll({ my: true }) // Backend should handle this
    });

    const { data: categories } = useQuery({
        queryKey: ['categories'],
        queryFn: () => categoriesAPI.getAll()
    });

    const createMutation = useMutation({
        mutationFn: (data) => productsAPI.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries(['vendor-products']);
            setIsAdding(false);
            toast.success('Product added successfully');
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => productsAPI.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries(['vendor-products']);
            toast.success('Product deleted');
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
                <h1 className="text-5xl font-black gradient-text">Products</h1>
                <Button onClick={() => setIsAdding(!isAdding)} className="gradient-primary gap-2">
                    {isAdding ? <PackageX size={18} /> : <Plus size={18} />}
                    {isAdding ? 'Cancel' : 'Add Product'}
                </Button>
            </div>

            <AnimatePresence>
                {isAdding && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                    >
                        <Card glass className="p-8 border-white/10">
                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Product Name</label>
                                    <input name="name" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Category</label>
                                    <select name="categoryId" required className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500">
                                        {categories?.data?.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Price (৳)</label>
                                    <input name="price" type="number" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Stock</label>
                                    <input name="stock" type="number" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500" />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Description</label>
                                    <textarea name="description" rows="3" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500" />
                                </div>
                                <Button type="submit" className="gradient-primary md:w-fit px-12" disabled={createMutation.isPending}>
                                    {createMutation.isPending ? 'Saving...' : 'Publish Product'}
                                </Button>
                            </form>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {products?.data?.map((product) => (
                    <motion.div key={product._id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <Card glass className="group overflow-hidden flex flex-col h-full border-white/5 hover:border-primary-500/30 transition-all duration-500">
                            <div className="aspect-video bg-white/5 flex items-center justify-center relative">
                                <span className="text-6xl group-hover:scale-110 transition-transform duration-500">📦</span>
                                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur px-3 py-1 rounded-full text-xs font-black text-primary-400 border border-primary-500/20">
                                    ৳{product.price}
                                </div>
                            </div>
                            <div className="p-6 flex-1 flex flex-col">
                                <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">{product.name}</h3>
                                <div className="flex items-center gap-4 mt-auto pt-4 border-t border-white/5">
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Stock Level</p>
                                        <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${product.stock > 10 ? 'bg-green-500' : 'bg-red-500'}`}
                                                style={{ width: `${Math.min(100, (product.stock / 50) * 100)}%` }}
                                            />
                                        </div>
                                        <p className="text-xs text-gray-400 mt-1">{product.stock} units left</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="ghost" size="icon" className="h-10 w-10 text-gray-400 hover:text-white hover:bg-white/10">
                                            <Edit size={18} />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-10 w-10 text-red-500/50 hover:text-red-500 hover:bg-red-500/10"
                                            onClick={() => confirm('Delete this product?') && deleteMutation.mutate(product._id)}
                                        >
                                            <Trash2 size={18} />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Products;

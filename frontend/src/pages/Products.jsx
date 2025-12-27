import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { productsAPI } from '../lib/api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Spinner from '../components/ui/Spinner';
import { Search, Filter } from 'lucide-react';
import ProductCard from '@/components/ProductCard';

const Products = () => {
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');

    const { data: products, isLoading } = useQuery({
        queryKey: ['products', search, category],
        queryFn: () => productsAPI.getAll({ search, category })
    });

    const { data: categories } = useQuery({
        queryKey: ['categories'],
        queryFn: () => productsAPI.getCategories()
    });

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-4xl font-bold mb-8 gradient-text">All Products</h1>

                {/* Filters */}
                <div className="glass-dark rounded-xl p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                        </div>

                        {/* Category Filter */}
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            >
                                <option value="">All Categories</option>
                                {categories?.data?.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        
                    </div>
                </div>

                {/* Products Grid */}
                {isLoading ? (
                    <Spinner size="xl" className="py-20" />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products?.data?.map((product) => (
                            <motion.div
                                key={product._id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                whileHover={{ y: -8 }}
                            >
                                <ProductCard product={product} />   
                                {/* <Card glass className="h-full backdrop-blur-xl">
                                    <div className="aspect-square bg-gradient-to-br from-primary-500/20 to-accent-500/20 rounded-lg mb-4 flex items-center justify-center">
                                        <span className="text-6xl">📦</span>
                                    </div>
                                    <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                                    <p className="text-gray-400 text-sm mb-2">{product.category}</p>
                                    <div className="flex items-center justify-between mb-4">
                                        <p className="text-2xl font-bold text-primary-400">
                                            ৳{product.price}
                                        </p>
                                        <span className="text-sm text-gray-400">{product.stock} in stock</span>
                                    </div>
                                    <Link to={`/product/${product._id}`}>
                                        <Button className="w-full">
                                            View Details
                                        </Button>
                                    </Link>
                                </Card> */}
                            </motion.div>
                        ))}
                    </div>
                )}

                {products?.data?.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-gray-400 text-xl">No products found</p>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default Products;

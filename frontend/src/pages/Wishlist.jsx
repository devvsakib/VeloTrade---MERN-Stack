import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { wishlistAPI } from '../lib/api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Spinner from '../components/ui/Spinner';
import { Trash2, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Wishlist = () => {
    const queryClient = useQueryClient();

    const { data: wishlist, isLoading } = useQuery({
        queryKey: ['wishlist'],
        queryFn: () => wishlistAPI.get()
    });

    const removeFromWishlist = useMutation({
        mutationFn: (productId) => wishlistAPI.remove(productId),
        onSuccess: () => {
            queryClient.invalidateQueries(['wishlist']);
        }
    });

    if (isLoading) return <Spinner size="xl" className="min-h-screen" />;

    const items = wishlist?.data?.items || [];

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-4xl font-bold mb-8 gradient-text">My Wishlist</h1>

                {items.length === 0 ? (
                    <Card glass className="backdrop-blur-xl text-center py-20">
                        <p className="text-gray-400 text-xl mb-4">Your wishlist is empty</p>
                        <Link to="/products">
                            <Button>Browse Products</Button>
                        </Link>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {items.map((item) => (
                            <motion.div
                                key={item.productId._id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                whileHover={{ y: -4 }}
                            >
                                <Card glass className="backdrop-blur-xl">
                                    <div className="aspect-square bg-gradient-to-br from-primary-500/20 to-accent-500/20 rounded-lg mb-4 flex items-center justify-center">
                                        <span className="text-6xl">📦</span>
                                    </div>
                                    <h3 className="font-bold text-lg mb-2">{item.productId.name}</h3>
                                    <p className="text-2xl font-bold text-primary-400 mb-4">
                                        ৳{item.productId.price}
                                    </p>
                                    <div className="flex gap-2">
                                        <Link to={`/product/${item.productId._id}`} className="flex-1">
                                            <Button className="w-full" size="sm">
                                                <ShoppingCart className="mr-2" size={16} />
                                                View
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => removeFromWishlist.mutate(item.productId._id)}
                                            disabled={removeFromWishlist.isPending}
                                        >
                                            <Trash2 size={16} />
                                        </Button>
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

export default Wishlist;

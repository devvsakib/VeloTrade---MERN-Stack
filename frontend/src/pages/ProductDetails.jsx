import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { productsAPI, reviewsAPI, wishlistAPI } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Spinner from '../components/ui/Spinner';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { useState } from 'react';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productsAPI.getById(id)
  });

  const { data: reviews } = useQuery({
    queryKey: ['reviews', id],
    queryFn: () => reviewsAPI.getByProduct(id)
  });

  const addToWishlist = useMutation({
    mutationFn: () => wishlistAPI.add(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['wishlist']);
      alert('Added to wishlist!');
    }
  });

  const addReview = useMutation({
    mutationFn: () => reviewsAPI.add(id, { rating, comment }),
    onSuccess: () => {
      queryClient.invalidateQueries(['reviews', id]);
      setComment('');
      setRating(5);
    }
  });

  const handleAddToCart = () => {
    addToCart(productData);
    alert('Added to cart!');
  };

  if (isLoading) return <Spinner size="xl" className="min-h-screen" />;

  const productData = product?.data;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Link to="/products" className="text-primary-400 hover:text-primary-300 mb-4 inline-block">
          ← Back to Products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Image */}
          <Card glass className="backdrop-blur-xl">
            <div className="aspect-square bg-gradient-to-br from-primary-500/20 to-accent-500/20 rounded-lg flex items-center justify-center">
              <span className="text-9xl">📦</span>
            </div>
          </Card>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">{productData?.name}</h1>
              <p className="text-gray-400">{productData?.category}</p>
            </div>

            <div className="flex items-center gap-4">
              <p className="text-4xl font-bold text-primary-400">৳{productData?.price}</p>
              <span className="text-gray-400">{productData?.stock} in stock</span>
            </div>

            <p className="text-gray-300">{productData?.description}</p>

            <div className="flex gap-4">
              <Button size="lg" className="flex-1" onClick={handleAddToCart}>
                <ShoppingCart className="mr-2" size={20} />
                Add to Cart
              </Button>
              {isAuthenticated && (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => addToWishlist.mutate()}
                  disabled={addToWishlist.isPending}
                >
                  <Heart size={20} />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <Card glass className="backdrop-blur-xl">
          <h2 className="text-2xl font-bold mb-6">Reviews</h2>

          {/* Add Review Form */}
          {isAuthenticated && (
            <div className="mb-8 p-4 bg-white/5 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        className="focus:outline-none"
                      >
                        <Star
                          size={24}
                          className={star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Comment</label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    rows="3"
                    placeholder="Share your experience..."
                  />
                </div>
                <Button onClick={() => addReview.mutate()} disabled={addReview.isPending}>
                  Submit Review
                </Button>
              </div>
            </div>
          )}

          {/* Reviews List */}
          <div className="space-y-4">
            {reviews?.data?.map((review) => (
              <div key={review._id} className="p-4 bg-white/5 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}
                      />
                    ))}
                  </div>
                  <span className="text-gray-400 text-sm">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-300">{review.comment}</p>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default ProductDetails;

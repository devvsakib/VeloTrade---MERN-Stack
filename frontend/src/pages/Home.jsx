import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { productsAPI } from '../lib/api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Spinner from '../components/ui/Spinner';
import { Sparkles, TrendingUp, Zap, ArrowRight } from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 }
};

const Home = () => {
  const { data: products, isLoading } = useQuery({
    queryKey: ['featured-products'],
    queryFn: () => productsAPI.getAll({ limit: 6 })
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-neutral-950 to-black">
      {/* Hero */}
      <section className="relative py-32 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.15),transparent_60%)]" />
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
              <Sparkles className="text-yellow-400" size={18} />
              <span className="text-sm text-gray-300">Future of Shopping</span>
            </div>

            <h1 className="text-5xl md:text-7xl xl:text-8xl font-black leading-tight mb-6">
              <span className="gradient-text">Discover Amazing</span>
              <br />Products
            </h1>

            <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-12">
              Trusted vendors, premium products, and unbeatable deals—crafted for you.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/products">
                <Button size="lg" className="gradient-primary px-8 gap-2">
                  <Zap size={18} />
                  Start Shopping
                </Button>
              </Link>
              <Link to="/register">
                <Button size="lg" variant="outline" className="border-white/20 hover:border-primary-400">
                  Become a Vendor
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trending Products */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <div className="flex justify-center items-center gap-3 mb-3">
              <TrendingUp className="text-primary-400" />
              <h2 className="text-4xl md:text-5xl font-black gradient-text">
                Trending Products
              </h2>
            </div>
            <p className="text-gray-400">Most loved items by our customers</p>
          </div>

          {isLoading ? (
            <Spinner size="xl" className="py-20" />
          ) : (
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {products?.data?.slice(0, 6).map((product) => (
                <motion.div key={product._id} variants={item}>
                  <Card className="group glass h-full overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                    {/* Image */}
                    <div className="relative aspect-square rounded-xl mb-4 overflow-hidden bg-gradient-to-br from-primary-500/20 to-accent-500/20">
                      <span className="absolute inset-0 flex items-center justify-center text-7xl group-hover:scale-110 transition-transform">
                        📦
                      </span>
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    {/* Info */}
                    <h3 className="text-xl font-bold mb-1 group-hover:text-primary-400 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-400 mb-4">{product.category}</p>

                    <div className="flex items-center justify-between mt-auto">
                      <p className="text-2xl font-black gradient-text">
                        ৳{Number(product.price).toLocaleString()}
                      </p>
                      <Link to={`/product/${product._id}`}>
                        <Button size="sm" className="gap-1">
                          View <ArrowRight size={14} />
                        </Button>
                      </Link>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}

          <div className="text-center mt-16">
            <Link to="/products">
              <Button size="lg" variant="outline" className="border-primary-400 text-primary-400 hover:bg-primary-400 hover:text-white px-10">
                Explore All Products →
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

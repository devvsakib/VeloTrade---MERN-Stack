import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { XCircle, AlertTriangle } from 'lucide-react';

const Failed = () => {
    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
            >
                <Card glass className="backdrop-blur-xl text-center py-16 px-8">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                        className="mb-8"
                    >
                        <div className="relative inline-block">
                            <XCircle className="text-red-400" size={100} />
                            <AlertTriangle className="absolute -top-2 -right-2 text-yellow-400" size={32} />
                        </div>
                    </motion.div>

                    <h1 className="text-5xl font-black mb-4">
                        Payment Failed
                    </h1>

                    <p className="text-gray-300 text-xl mb-8 leading-relaxed">
                        Unfortunately, your payment could not be processed. Please try again or use a different payment method.
                    </p>

                    <div className="flex gap-4 justify-center">
                        <Link to="/cart">
                            <Button size="lg" className="gradient-primary px-8">
                                Back to Cart
                            </Button>
                        </Link>
                        <Link to="/products">
                            <Button variant="outline" size="lg" className="border-2 border-white/20 px-8">
                                Continue Shopping
                            </Button>
                        </Link>
                    </div>
                </Card>
            </motion.div>
        </div>
    );
};

export default Failed;

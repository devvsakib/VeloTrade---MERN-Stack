import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, ShoppingBag, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const Success = () => {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('id');

    return (
        <div className="min-h-screen flex items-center justify-center bg-black p-4 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/20 rounded-full blur-[120px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-2xl w-full relative z-10"
            >
                <Card glass className="p-12 text-center border-white/5 shadow-[0_0_100px_rgba(99,102,241,0.1)]">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', damping: 12, delay: 0.2 }}
                        className="w-24 h-24 bg-green-500 rounded-full mx-auto flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(34,197,94,0.4)]"
                    >
                        <CheckCircle size={48} className="text-white" />
                    </motion.div>

                    <h1 className="text-5xl font-black text-white mb-4 tracking-tight">Payment Successful!</h1>
                    <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                        Your transaction was processed successfully. <br />
                        We're getting your items ready for shipment.
                    </p>

                    {orderId && (
                        <div className="bg-white/5 rounded-2xl p-6 mb-10 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="text-left">
                                <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1">Order Identifier</p>
                                <p className="font-mono text-white">#{orderId}</p>
                            </div>
                            <Button variant="outline" className="gap-2 border-white/10 hover:bg-white/10">
                                <Download size={16} /> Receipt
                            </Button>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/orders" className="flex-1">
                            <Button className="w-full h-14 gradient-primary gap-2 text-lg shadow-xl shadow-primary-500/20">
                                <ShoppingBag size={20} /> View My Orders
                            </Button>
                        </Link>
                        <Link to="/" className="flex-1">
                            <Button variant="outline" className="w-full h-14 border-white/10 hover:bg-white/10 gap-2 text-lg">
                                Back to Shop <ArrowRight size={20} />
                            </Button>
                        </Link>
                    </div>

                    <p className="mt-12 text-xs text-gray-600 font-medium uppercase tracking-[0.2em]">
                        Confirmation email sent to your inbox
                    </p>
                </Card>
            </motion.div>
        </div>
    );
};

export default Success;

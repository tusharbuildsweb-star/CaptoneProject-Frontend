import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, CheckCircle, AlertCircle, Building, Loader2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import api from '../../../services/api';

const ActivateSubscriptionPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useSelector((state) => state.auth);
    const [restaurantId, setRestaurantId] = useState(location.state?.restaurantId || null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [restaurantDetails, setRestaurantDetails] = useState(null);

    // If we didn't get restaurantId from state, fetch the restaurant
    useEffect(() => {
        const fetchRestaurant = async () => {
            if (!restaurantId) {
                try {
                    const res = await api.get('restaurants/owner/me');
                    if (res.data) {
                        setRestaurantId(res.data._id);
                        setRestaurantDetails(res.data);
                    }
                } catch (err) {
                    setError('Unable to fetch your restaurant details. Please contact support.');
                }
            } else {
                // If we have ID but no details, we can optionally fetch details
                try {
                    const res = await api.get('restaurants/owner/me');
                    if (res.data) setRestaurantDetails(res.data);
                } catch (err) { }
            }
        };
        fetchRestaurant();
    }, [restaurantId]);

    // Load Razorpay SDK
    useEffect(() => {
        const loadScript = () => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.async = true;
            document.body.appendChild(script);
        };
        loadScript();
    }, []);

    const handlePayment = async () => {
        if (!restaurantId) return;
        setLoading(true);
        setError('');

        try {
            // 1. Create order
            const orderRes = await api.post('subscriptions/order', { restaurantId });
            const { orderId, amount, key } = orderRes.data;

            // 2. Open Razorpay Widget
            const options = {
                key, // key_id from backend
                amount,
                currency: "INR",
                name: "RESERVE Partner",
                description: `Weekly Digital Subscription for ${restaurantDetails?.name || 'Restaurant'}`,
                order_id: orderId,
                handler: async function (response) {
                    try {
                        // 3. Verify Payment
                        await api.post('subscriptions/verify', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            restaurantId
                        });

                        // 4. Success -> go to dashboard
                        navigate('/dashboard/owner', { replace: true });
                    } catch (verifyError) {
                        setError(verifyError.response?.data?.message || 'Payment verification failed. If money was deducted, contact support.');
                    }
                },
                prefill: {
                    name: user?.name || '',
                    email: user?.email || ''
                },
                theme: {
                    color: "#f59e0b" // bg-amber-500
                }
            };

            const rzp = new window.Razorpay(options);

            rzp.on('payment.failed', function (response) {
                setError(`Payment Failed: ${response.error.description || 'Unknown error'}`);
            });

            rzp.open();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to initialize payment. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full min-h-screen bg-zinc-950 pt-28 pb-16 px-4">
            <div className="max-w-2xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-zinc-900 border border-amber-500/30 rounded-2xl p-8 md:p-12 shadow-2xl relative overflow-hidden"
                >
                    {/* Decorative glow */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600"></div>

                    <div className="flex flex-col items-center text-center">
                        <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mb-6 border border-amber-500/30">
                            <Building className="w-10 h-10 text-amber-500" />
                        </div>

                        <h1 className="text-3xl font-serif text-white mb-2">Welcome, Partner!</h1>
                        <p className="text-zinc-400 mb-8 max-w-md">
                            Your application for <strong className="text-white">{restaurantDetails ? restaurantDetails.name : 'your restaurant'}</strong> has been approved. Activate your subscription to unlock your Owner Dashboard.
                        </p>

                        {error && (
                            <div className="w-full bg-red-500/10 border border-red-500/50 rounded-xl p-4 text-left mb-6 flex items-start">
                                <AlertCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                                <span className="text-red-400 text-sm">{error}</span>
                            </div>
                        )}

                        <div className="w-full bg-black/40 border border-white/5 rounded-2xl p-6 mb-8 text-left">
                            <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-6">
                                <div>
                                    <h3 className="text-white font-medium text-lg">Digital Partner Subscription</h3>
                                    <p className="text-zinc-500 text-sm mt-1">Billed weekly. Cancel anytime via support.</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-bold text-white">₹199</div>
                                    <div className="text-zinc-500 text-sm">/ week</div>
                                </div>
                            </div>

                            <ul className="space-y-4">
                                {[
                                    'Access to Owner Dashboard',
                                    'Manage Live Bookings & Tables',
                                    'Respond to Customer Reviews',
                                    'Real-time Analytics & Activity Logs'
                                ].map((feature, idx) => (
                                    <li key={idx} className="flex items-center text-zinc-300">
                                        <CheckCircle className="w-5 h-5 text-amber-500 mr-3 flex-shrink-0" />
                                        <span className="text-sm">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <button
                            onClick={handlePayment}
                            disabled={loading || !restaurantId}
                            className={`w-full bg-amber-500 hover:bg-amber-400 text-black font-semibold py-4 rounded-xl transition-all shadow-lg flex justify-center items-center ${(loading || !restaurantId) ? 'opacity-70 cursor-not-allowed' : ''
                                }`}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin mr-2" /> Processing...
                                </>
                            ) : (
                                <>
                                    <CreditCard className="w-5 h-5 mr-2" /> Pay ₹199 & Activate
                                </>
                            )}
                        </button>

                        <p className="text-zinc-600 text-xs mt-6">
                            Secure payments handled by Razorpay. By activating, you agree to our Terms of Service.
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ActivateSubscriptionPage;

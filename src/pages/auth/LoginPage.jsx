import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, sendOTP, loginWithOTP, clearError } from '../../app/features/authSlice';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChefHat, Mail, Lock, Smartphone, ArrowRight, Loader2 } from 'lucide-react';

const LoginPage = () => {
    const [loginMode, setLoginMode] = useState('password'); // 'password' or 'otp'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, isAuthenticated, user } = useSelector((state) => state.auth);

    const location = useLocation();
    const returnTo = location.state?.returnTo;

    useEffect(() => {
        dispatch(clearError());
        if (isAuthenticated && user) {
            if (user.role === 'admin') navigate('/dashboard/admin', { replace: true });
            else if (user.role === 'owner') navigate('/dashboard/owner', { replace: true });
            else navigate(returnTo || '/dashboard/user', { replace: true });
        }
    }, [isAuthenticated, user, navigate, dispatch, returnTo]);

    const handlePasswordLogin = (e) => {
        e.preventDefault();
        dispatch(login({ email, password }));
    };

    const handleSendOTP = async (e) => {
        e.preventDefault();
        if (!email) return;
        try {
            await dispatch(sendOTP(email)).unwrap();
            setOtpSent(true);
        } catch (err) {
            // Error is handled by slice
        }
    };

    const handleVerifyOTP = (e) => {
        e.preventDefault();
        dispatch(loginWithOTP({ email, otp }));
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center relative z-10 w-full max-w-md mx-auto bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl"
        >
            <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-6 border border-amber-500/30 transform rotate-3">
                <ChefHat className="text-amber-500 w-8 h-8" />
            </div>

            <h2 className="text-3xl font-serif text-white mb-2 tracking-tight text-center">Connoisseur Access</h2>
            <p className="text-zinc-400 text-xs mb-8 text-center max-w-xs leading-relaxed uppercase tracking-widest">Premium Dining Reservations</p>

            {/* Mode Switcher */}
            <div className="flex bg-black/40 p-1 rounded-xl mb-8 w-full border border-white/5">
                <button
                    onClick={() => { setLoginMode('password'); setOtpSent(false); }}
                    className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${loginMode === 'password' ? 'bg-amber-500 text-black shadow-lg' : 'text-zinc-500 hover:text-white'}`}
                >
                    Password
                </button>
                <button
                    onClick={() => setLoginMode('otp')}
                    className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${loginMode === 'otp' ? 'bg-amber-500 text-black shadow-lg' : 'text-zinc-500 hover:text-white'}`}
                >
                    OTP Login
                </button>
            </div>

            {error && (
                <div className="bg-red-500/5 border border-red-500/20 text-red-500 text-[10px] px-4 py-3 rounded-xl w-full mb-6 text-center font-bold uppercase tracking-widest">
                    {error}
                </div>
            )}

            <AnimatePresence mode="wait">
                {loginMode === 'password' ? (
                    <motion.form
                        key="password"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        onSubmit={handlePasswordLogin}
                        className="w-full space-y-5"
                    >
                        <div>
                            <label className="block text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-2 font-bold ml-1">Email Identifier</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-black/40 border border-white/5 rounded-xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-amber-500/30 transition-all placeholder:text-zinc-700 text-sm"
                                    placeholder="johndoe@luxury.com"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-2 font-bold ml-1">Secure Key</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-black/40 border border-white/5 rounded-xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-amber-500/30 transition-all placeholder:text-zinc-700 text-sm"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-end px-1">
                            <Link to="/forgot-password" size="sm" className="text-[10px] text-amber-500 hover:text-amber-400 transition-colors font-bold uppercase tracking-widest">Reset Password</Link>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-4 rounded-xl transition-all shadow-xl shadow-amber-500/10 flex justify-center items-center text-xs uppercase tracking-[0.2em] disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Authenticate'}
                        </button>
                    </motion.form>
                ) : (
                    <motion.form
                        key="otp"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        onSubmit={otpSent ? handleVerifyOTP : handleSendOTP}
                        className="w-full space-y-5"
                    >
                        <div>
                            <label className="block text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-2 font-bold ml-1">Email Identifier</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                                <input
                                    type="email"
                                    required
                                    disabled={otpSent}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-black/40 border border-white/5 rounded-xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-amber-500/30 transition-all placeholder:text-zinc-700 text-sm disabled:opacity-50"
                                    placeholder="johndoe@luxury.com"
                                />
                            </div>
                        </div>

                        {otpSent && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                            >
                                <label className="block text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-2 font-bold ml-1">One-Time Password</label>
                                <div className="relative">
                                    <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                                    <input
                                        type="text"
                                        required
                                        maxLength="6"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        className="w-full bg-black/40 border border-white/5 rounded-xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-amber-500/30 transition-all placeholder:text-zinc-700 text-sm tracking-[0.5em] font-bold"
                                        placeholder="••••••"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setOtpSent(false)}
                                    className="text-[10px] text-zinc-500 hover:text-white mt-2 font-medium flex items-center gap-1"
                                >
                                    Change Email?
                                </button>
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-4 rounded-xl transition-all shadow-xl shadow-amber-500/10 flex justify-center items-center text-xs uppercase tracking-[0.2em] disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : (otpSent ? 'Verify & Login' : 'Request OTP')}
                        </button>
                    </motion.form>
                )}
            </AnimatePresence>

            <div className="mt-10 pt-8 border-t border-white/5 w-full space-y-4">
                <p className="text-[10px] text-zinc-600 text-center uppercase tracking-widest">
                    New to the platform? <Link to="/register" className="text-amber-500 hover:text-amber-400 font-bold transition-colors ml-2">Register</Link>
                </p>
                <p className="text-[10px] text-zinc-600 text-center uppercase tracking-widest">
                    Restaurant Owner? <Link to="/become-partner" className="text-amber-500 hover:text-amber-400 font-bold transition-colors ml-2">Apply</Link>
                </p>
            </div>
        </motion.div>
    );
};

export default LoginPage;

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register as registerUser, clearError } from '../../app/features/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChefHat } from 'lucide-react';

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, isAuthenticated, user } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(clearError());
        if (isAuthenticated && user) {
            // Redirect based on role
            if (user.role === 'admin') navigate('/dashboard/admin');
            else if (user.role === 'owner') navigate('/dashboard/owner'); // Fallback if somehow already owner
            else navigate('/dashboard/user');
        }
    }, [isAuthenticated, user, navigate, dispatch]);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(registerUser({ name, email, password }));
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center relative z-10 w-full bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-10 shadow-2xl"
        >
            <div className="w-20 h-20 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(245,158,11,0.2)] border border-amber-500/30 transform -rotate-3">
                <ChefHat className="text-amber-500 w-10 h-10" />
            </div>

            <h2 className="text-4xl font-serif text-white mb-3 tracking-tight text-center">New Membership</h2>
            <p className="text-zinc-400 text-sm mb-10 text-center max-w-xs leading-relaxed">Join our exclusive circle of diners and enjoy premium reservations.</p>

            {error && (
                <div className="bg-red-500/5 border border-red-500/20 text-red-500 text-xs px-4 py-3 rounded-xl w-full mb-8 text-center font-medium">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="w-full space-y-6">
                <div>
                    <label className="block text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-2 font-bold ml-1">Full Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-amber-500/30 focus:bg-white/5 transition-all placeholder:text-zinc-700 text-sm"
                        placeholder="John Doe"
                        required
                    />
                </div>
                <div>
                    <label className="block text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-2 font-bold ml-1">Digital Identity</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-amber-500/30 focus:bg-white/5 transition-all placeholder:text-zinc-700 text-sm"
                        placeholder="email@example.com"
                        required
                    />
                </div>
                <div>
                    <label className="block text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-2 font-bold ml-1">Secure Key</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-amber-500/30 focus:bg-white/5 transition-all placeholder:text-zinc-700 text-sm"
                        placeholder="••••••••"
                        required
                        minLength={6}
                    />
                </div>

                <div className="px-1">
                    <p className="text-[10px] text-zinc-500 leading-relaxed italic">
                        By registering, you agree to our <span className="text-amber-800">Terms of Excellence</span> and <span className="text-amber-800">Privacy Protocols</span>.
                    </p>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-4 rounded-2xl transition-all shadow-[0_10px_20px_rgba(245,158,11,0.15)] hover:shadow-[0_15px_30px_rgba(245,158,11,0.25)] hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed mt-4 flex justify-center items-center text-sm uppercase tracking-widest"
                >
                    {loading ? (
                        <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    ) : 'Create Membership'}
                </button>
            </form>

            <div className="mt-10 pt-8 border-t border-white/5 w-full">
                <p className="text-xs text-zinc-500 text-center uppercase tracking-wider">
                    Already recognized? <Link to="/login" className="text-amber-500 hover:text-amber-400 font-bold transition-colors ml-1">Sign In</Link>
                </p>
            </div>
        </motion.div>
    );
};

export default RegisterPage;

import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChefHat } from 'lucide-react';
import api from '@/services/api';

const ResetPasswordPage = () => {
    const { resetToken } = useParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (password !== confirmPassword) {
            return setError('Passwords do not match');
        }

        setLoading(true);

        try {
            const res = await api.put(`auth/reset-password-token/${resetToken}`, { password });
            setMessage(res.data.message);
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center relative z-10 w-full"
        >
            <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                <ChefHat className="text-amber-500 w-8 h-8" />
            </div>

            <h2 className="text-3xl font-serif text-white mb-2 tracking-wide text-center">Reset Password</h2>
            <p className="text-zinc-400 text-sm mb-8 text-center max-w-xs">Create a new secure password for your account.</p>

            {message && (
                <div className="bg-green-500/10 border border-green-500/40 text-green-400 text-sm px-4 py-3 rounded-lg w-full mb-6 text-center">
                    {message}
                </div>
            )}

            {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm px-4 py-3 rounded-lg w-full mb-6">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="w-full space-y-5">
                <div>
                    <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-2 font-medium">New Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all placeholder:text-zinc-600"
                        placeholder="Enter new password"
                        required
                        minLength={6}
                    />
                </div>
                <div>
                    <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-2 font-medium">Confirm New Password</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all placeholder:text-zinc-600"
                        placeholder="Confirm new password"
                        required
                        minLength={6}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-amber-500 hover:bg-amber-400 text-black font-semibold py-3.5 rounded-xl transition-all shadow-[0_0_15px_rgba(212,175,55,0.2)] hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] disabled:opacity-70 disabled:cursor-not-allowed mt-4 flex justify-center items-center"
                >
                    {loading ? (
                        <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : 'Reset Password'}
                </button>
            </form>
        </motion.div>
    );
};

export default ResetPasswordPage;

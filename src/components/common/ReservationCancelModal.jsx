import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Clock, HelpCircle, Info } from 'lucide-react';

const ReservationCancelModal = ({ isOpen, onClose, onConfirm, reservation }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="bg-zinc-900 border border-white/10 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl"
                >
                    {/* Header */}
                    <div className="relative p-8 pb-0 flex justify-between items-start">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-red-500/10 rounded-2xl border border-red-500/20">
                                <AlertTriangle className="text-red-500" size={24} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-serif text-white">Cancel Reservation</h3>
                                <p className="text-zinc-500 text-sm">Are you sure you want to cancel this booking?</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 text-zinc-500 hover:text-white transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-8 space-y-6">
                        {/* Cancellation Policy Box */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                            <div className="flex items-center gap-2 mb-4 text-amber-500">
                                <Info size={16} />
                                <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Cancellation Policy</span>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-zinc-400">&gt; 5 hours before</span>
                                    <span className="text-green-400 font-medium">Full Refund</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-zinc-400">2 – 5 hours before</span>
                                    <span className="text-amber-400 font-medium">80% Refund</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-zinc-400">&lt; 2 hours before</span>
                                    <span className="text-red-400 font-medium">No Refund + ₹100 Penalty</span>
                                </div>
                            </div>
                        </div>

                        {/* Booking Summary Mini */}
                        {reservation && (
                            <div className="flex items-center gap-4 bg-black/40 p-4 rounded-xl border border-white/5">
                                <div className="flex-1">
                                    <p className="text-white font-medium">{reservation.restaurantId?.name}</p>
                                    <p className="text-zinc-500 text-xs">{new Date(reservation.date).toLocaleDateString()} at {reservation.time}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-zinc-500 text-[10px] uppercase tracking-wider">Advance Paid</p>
                                    <p className="text-amber-500 font-bold">₹{reservation.totalPaidNow || 0}</p>
                                </div>
                            </div>
                        )}

                        <p className="text-zinc-400 text-sm italic py-2 text-center border-t border-white/5">
                            *Refunds will be credited back to your original payment method within 5-7 business days.
                        </p>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-8 pt-0 flex gap-4">
                        <button
                            onClick={onClose}
                            className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl text-zinc-400 hover:text-white hover:bg-white/10 transition-all font-medium"
                        >
                            Back
                        </button>
                        <button
                            onClick={() => {
                                onConfirm(reservation._id);
                                onClose();
                            }}
                            className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-500 transition-all shadow-lg shadow-red-600/20"
                        >
                            Confirm Cancellation
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default ReservationCancelModal;

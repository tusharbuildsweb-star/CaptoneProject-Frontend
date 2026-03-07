import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile, clearOnboarding } from '../../app/features/authSlice';
import { User, Phone, Image as ImageIcon, Camera } from 'lucide-react';

const OnboardingModal = () => {
    const dispatch = useDispatch();
    const { user, needsOnboarding, loading } = useSelector(state => state.auth);

    const [mobileNumber, setMobileNumber] = useState(user?.mobileNumber || '+91 ');
    const [profileImage, setProfileImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');

    if (!needsOnboarding) return null;

    const handleMobileChange = (e) => {
        const val = e.target.value;
        // Ensure +91 always stays prefix if desired!
        if (val.startsWith('+91 ')) {
            setMobileNumber(val);
        } else if (val === '+91') { // deleting the space
            setMobileNumber('+91 ');
        } else if (val.length < 4) { // user tries deleting prefix
            setMobileNumber('+91 ');
        } else {
            // just append taking the last char typed
            setMobileNumber(val);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setErrorMsg('');

        try {
            const formData = new FormData();
            formData.append('mobileNumber', mobileNumber);
            if (profileImage) {
                formData.append('profileImage', profileImage);
            }

            await dispatch(updateProfile(formData)).unwrap();
            dispatch(clearOnboarding());
        } catch (error) {
            setErrorMsg(error || "Failed to update profile.");
        }
    };

    const handleSkip = () => {
        dispatch(clearOnboarding());
    };

    return (
        <AnimatePresence>
            {needsOnboarding && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                >
                    <motion.div
                        initial={{ scale: 0.95, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.95, y: 20 }}
                        className="bg-zinc-900 border border-white/10 p-8 rounded-2xl w-full max-w-md shadow-2xl relative overflow-hidden"
                    >
                        {/* Decorative background glow */}
                        <div className="absolute -top-32 -left-32 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

                        <div className="relative z-10 text-center mb-6">
                            <h2 className="text-3xl font-serif text-white mb-2">Welcome!</h2>
                            <p className="text-zinc-400 text-sm">Let’s quickly set up your profile for a better experience.</p>
                        </div>

                        {errorMsg && (
                            <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-500 text-sm p-3 rounded-lg text-center">
                                {errorMsg}
                            </div>
                        )}

                        <form onSubmit={handleSave} className="space-y-6 relative z-10">
                            {/* Profile Image Uploader */}
                            <div className="flex flex-col items-center">
                                <div className="w-24 h-24 rounded-full bg-zinc-800 border-2 border-white/10 flex items-center justify-center relative group cursor-pointer overflow-hidden shadow-[0_0_15px_rgba(212,175,55,0.1)]">
                                    {previewImage ? (
                                        <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <User size={32} className="text-zinc-600" />
                                    )}
                                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Camera size={20} className="text-white mb-1" />
                                        <span className="text-[10px] text-white uppercase tracking-wider font-medium">Upload</span>
                                    </div>
                                    <input type="file" onChange={handleImageChange} accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" />
                                </div>
                            </div>

                            {/* Mobile Number Input */}
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-2">Mobile Number</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Phone size={18} className="text-zinc-500" />
                                    </div>
                                    <input
                                        type="tel"
                                        value={mobileNumber}
                                        onChange={handleMobileChange}
                                        className="w-full bg-zinc-950 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                                        placeholder="+91 9876543210"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-amber-500 text-black font-semibold py-3 rounded-xl hover:bg-amber-400 transition-colors shadow-[0_0_15px_rgba(212,175,55,0.2)] disabled:opacity-50"
                                >
                                    {loading ? 'Saving...' : 'Save & Continue'}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSkip}
                                    className="w-full bg-transparent text-zinc-400 py-3 rounded-xl hover:text-white transition-colors text-sm"
                                >
                                    Skip for now
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default OnboardingModal;

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, User, MapPin, Search, Filter, ChevronDown, MessageSquare, Quote } from 'lucide-react';
import api from '../../services/api';
import io from 'socket.io-client';

const TestimonialsPage = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [stats, setStats] = useState({
        averageRating: 4.8,
        totalReviews: 12450,
        breakdown: [
            { stars: 5, percentage: 72 },
            { stars: 4, percentage: 18 },
            { stars: 3, percentage: 6 },
            { stars: 2, percentage: 2 },
            { stars: 1, percentage: 2 }
        ],
        metrics: [
            { label: 'Food Quality', score: 4.7 },
            { label: 'Service', score: 4.6 },
            { label: 'Ambience', score: 4.8 },
            { label: 'Value', score: 4.5 },
            { label: 'Cleanliness', score: 4.6 }
        ]
    });

    const [filter, setFilter] = useState('Most Recent');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTestimonials();

        const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000');
        socket.on('newReviewAdded', () => {
            fetchTestimonials();
        });

        return () => socket.disconnect();
    }, []);

    const fetchTestimonials = async () => {
        try {
            const res = await api.get('testimonials');
            setTestimonials(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching testimonials", err);
            setLoading(false);
        }
    };

    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            <Star key={i} size={14} className={i < rating ? "fill-amber-500 text-amber-500" : "text-zinc-700"} />
        ));
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-white pt-32 pb-20">
            {/* 1. Hero Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <nav className="flex justify-center items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-zinc-500 mb-8">
                        <a href="/" className="hover:text-amber-500 transition-colors">Home</a>
                        <span>/</span>
                        <span className="text-amber-500">Testimonials</span>
                    </nav>
                    <h1 className="text-6xl md:text-7xl font-serif mb-8 tracking-tight">
                        What Our <span className="text-amber-500 italic">Diners</span> are Saying
                    </h1>
                    <p className="max-w-2xl mx-auto text-zinc-400 font-light text-lg leading-relaxed">
                        Every dining experience is celebrated by our guests who have reserved through Reserve.
                        Real experiences, real feedback, and memorable dining moments.
                    </p>
                </motion.div>
            </section>

            {/* 2. Ratings Summary & Breakdown */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-32">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">

                    {/* Overall Summary */}
                    <div className="bg-zinc-900/40 border border-white/5 p-10 rounded-3xl text-center flex flex-col items-center justify-center h-full min-h-[400px]">
                        <div className="flex items-end gap-2 mb-4">
                            <span className="text-7xl font-serif">{stats.averageRating}</span>
                            <div className="flex gap-1 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={24} className="fill-amber-500 text-amber-500" />
                                ))}
                            </div>
                        </div>
                        <h3 className="text-2xl font-serif mb-2">Exceptional Dining Experience</h3>
                        <p className="text-zinc-500 text-sm tracking-wide">Based on {stats.totalReviews.toLocaleString()} verified reviews</p>

                        <div className="mt-12 w-full pt-8 border-t border-white/5">
                            <Quote className="text-amber-500/20 w-12 h-12 mx-auto" />
                        </div>
                    </div>

                    {/* Rating Breakdown */}
                    <div className="bg-zinc-900/40 border border-white/5 p-10 rounded-3xl h-full min-h-[400px]">
                        <h4 className="text-lg font-serif mb-8 flex items-center gap-3">
                            <Filter size={18} className="text-amber-500" /> Rating Breakdown
                        </h4>
                        <div className="space-y-6">
                            {stats.breakdown.map((item, idx) => (
                                <div key={idx} className="space-y-2">
                                    <div className="flex justify-between text-xs uppercase tracking-widest text-zinc-400">
                                        <span>{item.stars} Stars</span>
                                        <span>{item.percentage}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            whileInView={{ width: `${item.percentage}%` }}
                                            transition={{ duration: 1, delay: idx * 0.1 }}
                                            className="h-full bg-amber-500"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Review Metrics */}
                    <div className="bg-zinc-900/40 border border-white/5 p-10 rounded-3xl h-full min-h-[400px]">
                        <h4 className="text-lg font-serif mb-8 flex items-center gap-3">
                            <Star size={18} className="text-amber-500" /> Review Metrics
                        </h4>
                        <div className="space-y-8">
                            {stats.metrics.map((metric, idx) => (
                                <div key={idx} className="space-y-3">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-zinc-300 font-light">{metric.label}</span>
                                        <span className="text-amber-500 font-serif">{metric.score}</span>
                                    </div>
                                    <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            whileInView={{ width: `${(metric.score / 5) * 100}%` }}
                                            transition={{ duration: 1.5, ease: "easeOut" }}
                                            className="h-full bg-gradient-to-r from-amber-700 to-amber-500"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </section>

            {/* 3. Filters Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
                <div className="bg-zinc-900/60 border border-white/5 p-6 rounded-3xl space-y-6">
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        <div className="relative flex-grow w-full md:w-auto">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                            <input
                                type="text"
                                placeholder="Search reviews..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-zinc-950 border border-white/10 w-full pl-12 pr-4 py-3.5 rounded-2xl focus:outline-none focus:border-amber-500 transition-all placeholder:text-zinc-700 font-light text-sm shadow-inner"
                            />
                        </div>
                        <div className="flex gap-3 w-full md:w-auto">
                            <div className="relative group w-full md:w-48">
                                <select className="w-full bg-zinc-950 border border-white/10 px-4 py-3.5 rounded-2xl appearance-none text-xs uppercase tracking-widest text-zinc-400 focus:outline-none focus:border-amber-500 cursor-pointer">
                                    <option>Select Restaurant</option>
                                    <option>Eka</option>
                                    <option>Southern Spice</option>
                                    <option>Dakshin</option>
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 group-hover:text-amber-500 transition-colors pointer-events-none" size={14} />
                            </div>
                            <div className="relative group w-full md:w-48">
                                <select className="w-full bg-zinc-950 border border-white/10 px-4 py-3.5 rounded-2xl appearance-none text-xs uppercase tracking-widest text-zinc-400 focus:outline-none focus:border-amber-500 cursor-pointer">
                                    <option>Filter by Date</option>
                                    <option>Last 7 Days</option>
                                    <option>Last 30 Days</option>
                                    <option>All Time</option>
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 group-hover:text-amber-500 transition-colors pointer-events-none" size={14} />
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 w-full overflow-x-auto pb-2 scrollbar-none">
                        {['All Reviews', 'Most Recent', 'Highest Rating', 'Lowest Rating'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`whitespace-nowrap px-8 py-3.5 rounded-2xl border text-[10px] uppercase tracking-[0.2em] font-bold transition-all duration-300 ${filter === f ? 'bg-amber-500 border-amber-500 text-black shadow-[0_0_20px_rgba(212,175,55,0.2)]' : 'border-white/5 text-zinc-500 hover:border-white/20 hover:text-zinc-300 bg-zinc-950/50'}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. Testimonial Grid */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-zinc-900/40 border border-white/5 aspect-[4/3] rounded-3xl animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {testimonials.map((t, idx) => (
                            <motion.div
                                key={t._id || idx}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.1 }}
                                className="group bg-zinc-900/40 border border-white/5 p-8 rounded-3xl hover:bg-zinc-900/60 hover:border-amber-500/20 transition-all duration-500 relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <MessageSquare size={80} />
                                </div>
                                <div className="flex gap-1 mb-6">
                                    {renderStars(t.rating)}
                                </div>
                                <p className="text-zinc-400 font-light leading-relaxed mb-8 relative z-10 min-h-[80px]">
                                    "{t.content}"
                                </p>
                                <div className="flex items-center gap-4 relative z-10 pt-6 border-t border-white/5">
                                    <div className="w-12 h-12 rounded-full overflow-hidden border border-amber-500/20 bg-zinc-800">
                                        <img
                                            src={t.image || `https://randomuser.me/api/portraits/${idx % 2 === 0 ? 'men' : 'women'}/${idx + 20}.jpg`}
                                            alt={t.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <h5 className="font-serif text-white">{t.name}</h5>
                                        <div className="flex items-center gap-1.5 text-zinc-500 text-[10px] uppercase tracking-widest mt-1">
                                            <MapPin size={10} className="text-amber-500" />
                                            {t.location || 'Chennai'}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default TestimonialsPage;

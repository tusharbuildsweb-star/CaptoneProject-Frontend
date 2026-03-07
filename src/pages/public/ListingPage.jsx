import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, SlidersHorizontal, ChevronDown, Check, Star } from 'lucide-react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { searchRestaurants, fetchRestaurants, fetchFilters } from '../../app/features/restaurantSlice';
import RestaurantCard from '../../components/cards/RestaurantCard';
import { io } from 'socket.io-client';

const ListingPage = () => {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const dispatch = useDispatch();
    const { list, filters, loading } = useSelector((state) => state.restaurants);

    // Form states initialized from URL params
    const [searchStr, setSearchStr] = useState(searchParams.get('search') || '');
    const [selectedCuisines, setSelectedCuisines] = useState(searchParams.get('cuisine') ? searchParams.get('cuisine').split(',') : []);
    const [selectedLocations, setSelectedLocations] = useState(searchParams.get('location') ? searchParams.get('location').split(',') : []);
    const [selectedFeatures, setSelectedFeatures] = useState(searchParams.get('features') ? searchParams.get('features').split(',') : []);
    const [minRating, setMinRating] = useState(searchParams.get('rating') || '');
    const [hasPkg, setHasPkg] = useState(searchParams.get('packages') === 'true');
    const [sortOption, setSortOption] = useState(searchParams.get('sort') || '');
    const [activeFilter, setActiveFilter] = useState(searchParams.get('filter') || '');

    useEffect(() => {
        dispatch(fetchFilters());
    }, [dispatch]);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const searchArgs = Object.fromEntries(queryParams.entries());

        if (Object.keys(searchArgs).length > 0) {
            dispatch(searchRestaurants(searchArgs));
        } else {
            dispatch(fetchRestaurants());
        }
    }, [location.search, dispatch]);

    // Apply Filters to URL
    const handleApplyFilters = () => {
        const params = new URLSearchParams();
        if (searchStr) params.set('search', searchStr);
        if (selectedCuisines.length > 0) params.set('cuisine', selectedCuisines.join(','));
        if (selectedLocations.length > 0) params.set('location', selectedLocations.join(','));
        if (selectedFeatures.length > 0) params.set('features', selectedFeatures.join(','));
        if (minRating) params.set('rating', minRating);
        if (hasPkg) params.set('packages', 'true');
        if (sortOption) params.set('sort', sortOption);
        if (activeFilter) params.set('filter', activeFilter);

        setSearchParams(params);
        if (window.innerWidth < 1024) {
            setIsFilterOpen(false); // close mobile menu on apply
        }
    };

    const handleClearFilters = () => {
        setSearchStr('');
        setSelectedCuisines([]);
        setSelectedLocations([]);
        setSelectedFeatures([]);
        setMinRating('');
        setHasPkg(false);
        setSortOption('');
        setActiveFilter('');
        setSearchParams({});
    };

    const toggleCuisine = (c) => {
        setSelectedCuisines(prev => prev.includes(c) ? prev.filter(item => item !== c) : [...prev, c]);
    };

    const toggleLocation = (l) => {
        setSelectedLocations(prev => prev.includes(l) ? prev.filter(item => item !== l) : [...prev, l]);
    };

    const toggleFeature = (f) => {
        setSelectedFeatures(prev => prev.includes(f) ? prev.filter(item => item !== f) : [...prev, f]);
    };

    // Sort change immediately applies to URL
    const handleSortChange = (e) => {
        const val = e.target.value;
        setSortOption(val);
        const params = new URLSearchParams(searchParams);
        if (val) {
            params.set('sort', val);
        } else {
            params.delete('sort');
        }
        setSearchParams(params);
    };

    // Real-time socket listener
    useEffect(() => {
        const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000');
        socket.on('dataUpdated', (payload) => {
            if (payload?.type === 'restaurantApproved' || payload?.type === 'restaurantDeleted') {
                dispatch(fetchRestaurants());
            }
        });
        socket.on('restaurantUpdated', () => dispatch(fetchRestaurants()));
        socket.on('restaurantRatingUpdated', () => dispatch(fetchRestaurants()));
        return () => socket.disconnect();
    }, [dispatch]);


    return (
        <div className="w-full flex flex-col min-h-screen bg-zinc-950 pt-32 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">

                {/* Header Section */}
                <div className="mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="text-amber-500 font-medium tracking-[0.2em] uppercase text-xs mb-3 block">
                            Curated Collection
                        </span>
                        <h1 className="text-5xl md:text-6xl font-serif text-white mb-6">Discover Exceptional Dining</h1>
                        <p className="text-zinc-400 font-light max-w-2xl text-lg leading-relaxed">
                            Explore our handpicked selection of the world's finest culinary destinations. Filter by cuisine, location, or atmosphere to find your perfect table.
                        </p>
                    </motion.div>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">

                    {/* Mobile Filter Toggle */}
                    <button
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className="lg:hidden w-full flex items-center justify-between bg-zinc-900/50 backdrop-blur-md border border-white/10 p-4 rounded-2xl text-white shadow-lg"
                    >
                        <span className="flex items-center font-medium"><SlidersHorizontal size={18} className="mr-3 text-amber-500" /> Filters & Sorting</span>
                        <ChevronDown size={18} className={`transform transition-transform duration-300 ${isFilterOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Left: Filters Sidebar */}
                    <aside className={`w-full lg:w-1/4 ${isFilterOpen ? 'block' : 'hidden'} lg:block`}>
                        <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sticky top-32 shadow-2xl">
                            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                                <h3 className="text-xl font-serif text-white flex items-center">
                                    <Filter size={20} className="mr-3 text-amber-500" /> Refine
                                </h3>
                                <button
                                    onClick={handleClearFilters}
                                    className="text-xs text-zinc-500 hover:text-amber-500 transition-colors uppercase tracking-widest font-medium"
                                >
                                    Reset
                                </button>
                            </div>

                            {/* Search in sidebar */}
                            <div className="mb-8">
                                <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-3 font-semibold">Search</label>
                                <div className="relative group">
                                    <Search size={16} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-500 group-focus-within:text-amber-500 transition-colors" />
                                    <input
                                        type="text"
                                        placeholder="e.g. Sushi, London"
                                        value={searchStr}
                                        onChange={(e) => setSearchStr(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
                                        className="w-full bg-black/40 border border-white/5 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/50 transition-all shadow-inner"
                                    />
                                </div>
                            </div>

                            {/* Cuisine Filter */}
                            {filters.cuisines?.length > 0 && (
                                <div className="mb-8">
                                    <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-4 font-semibold">Cuisine</label>
                                    <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                        {filters.cuisines.map(c => (
                                            <label key={c} className="flex items-center group cursor-pointer">
                                                <div className="relative flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedCuisines.includes(c)}
                                                        onChange={() => toggleCuisine(c)}
                                                        className="peer h-5 w-5 opacity-0 absolute cursor-pointer"
                                                    />
                                                    <div className="h-5 w-5 border border-white/20 rounded-md bg-black/40 peer-checked:bg-amber-500 peer-checked:border-amber-500 transition-all flex items-center justify-center">
                                                        <Check size={12} className="text-black scale-0 peer-checked:scale-100 transition-transform" />
                                                    </div>
                                                </div>
                                                <span className="ml-3 text-sm text-zinc-400 group-hover:text-white transition-colors">{c}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Location Filter */}
                            {filters.locations?.length > 0 && (
                                <div className="mb-8">
                                    <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-4 font-semibold">Location</label>
                                    <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                        {filters.locations.map(l => (
                                            <label key={l} className="flex items-center group cursor-pointer">
                                                <div className="relative flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedLocations.includes(l)}
                                                        onChange={() => toggleLocation(l)}
                                                        className="peer h-5 w-5 opacity-0 absolute cursor-pointer"
                                                    />
                                                    <div className="h-5 w-5 border border-white/20 rounded-md bg-black/40 peer-checked:bg-amber-500 peer-checked:border-amber-500 transition-all flex items-center justify-center">
                                                        <Check size={12} className="text-black scale-0 peer-checked:scale-100 transition-transform" />
                                                    </div>
                                                </div>
                                                <span className="ml-3 text-sm text-zinc-400 group-hover:text-white transition-colors">{l}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Rating Filter */}
                            <div className="mb-8">
                                <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-4 font-semibold">Min. Rating</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {[5, 4, 3, 2].map(r => (
                                        <button
                                            key={r}
                                            onClick={() => setMinRating(prev => prev === r.toString() ? '' : r.toString())}
                                            className={`flex items-center justify-center px-3 py-2.5 border rounded-xl text-sm transition-all duration-300 ${minRating === r.toString() ? 'bg-amber-500/10 border-amber-500 text-amber-500 shadow-[0_0_15px_rgba(212,175,55,0.1)]' : 'border-white/5 text-zinc-500 hover:border-white/20 hover:text-white'}`}
                                        >
                                            <span className="flex items-center font-medium">
                                                {r} <Star size={12} className="ml-1.5 fill-current" />
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Features Filter */}
                            {filters.features?.length > 0 && (
                                <div className="mb-8">
                                    <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-4 font-semibold">Features</label>
                                    <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                        {filters.features.map(f => (
                                            <label key={f} className="flex items-center group cursor-pointer">
                                                <div className="relative flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedFeatures.includes(f)}
                                                        onChange={() => toggleFeature(f)}
                                                        className="peer h-5 w-5 opacity-0 absolute cursor-pointer"
                                                    />
                                                    <div className="h-5 w-5 border border-white/20 rounded-md bg-black/40 peer-checked:bg-amber-500 peer-checked:border-amber-500 transition-all flex items-center justify-center">
                                                        <Check size={12} className="text-black scale-0 peer-checked:scale-100 transition-transform" />
                                                    </div>
                                                </div>
                                                <span className="ml-3 text-sm text-zinc-400 group-hover:text-white transition-colors">{f}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Collections Filter */}
                            <div className="mb-8">
                                <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-4 font-semibold">Collections</label>
                                <div className="space-y-3">
                                    {[
                                        { id: 'top10', label: 'Top 10 Restaurants', icon: '🏆' },
                                        { id: 'openNow', label: 'Open Now', icon: '🕓' }
                                    ].map(f => (
                                        <label key={f.id} className="flex items-center group cursor-pointer bg-white/5 p-3 rounded-xl border border-transparent hover:border-amber-500/30 transition-all">
                                            <div className="relative flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={activeFilter === f.id}
                                                    onChange={() => setActiveFilter(prev => prev === f.id ? '' : f.id)}
                                                    className="peer h-5 w-5 opacity-0 absolute cursor-pointer"
                                                />
                                                <div className="h-5 w-5 border border-white/20 rounded-md bg-black/40 peer-checked:bg-amber-500 peer-checked:border-amber-500 transition-all flex items-center justify-center">
                                                    <Check size={12} className="text-black scale-0 peer-checked:scale-100 transition-transform" />
                                                </div>
                                            </div>
                                            <span className="ml-3 text-sm text-zinc-300 group-hover:text-amber-500 transition-colors font-medium">{f.icon} {f.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Special Features Filter */}
                            <div className="mb-8">
                                <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-4 font-semibold">Experiences</label>
                                <label className="flex items-center group cursor-pointer bg-white/5 p-3 rounded-xl border border-transparent hover:border-amber-500/30 transition-all">
                                    <div className="relative flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={hasPkg}
                                            onChange={(e) => setHasPkg(e.target.checked)}
                                            className="peer h-5 w-5 opacity-0 absolute cursor-pointer"
                                        />
                                        <div className="h-5 w-5 border border-white/20 rounded-md bg-black/40 peer-checked:bg-amber-500 peer-checked:border-amber-500 transition-all flex items-center justify-center">
                                            <Check size={12} className="text-black scale-0 peer-checked:scale-100 transition-transform" />
                                        </div>
                                    </div>
                                    <span className="ml-3 text-sm text-zinc-300 group-hover:text-amber-500 transition-colors font-medium">✨ Premium Packages</span>
                                </label>
                            </div>

                            <button
                                onClick={handleApplyFilters}
                                className="w-full bg-amber-500 hover:bg-amber-400 text-black py-4 rounded-2xl font-bold tracking-wider uppercase text-xs transition-all duration-300 shadow-[0_10px_20px_rgba(212,175,55,0.2)] hover:shadow-[0_15px_30px_rgba(212,175,55,0.4)] active:scale-95"
                            >
                                Apply Changes
                            </button>
                        </div>
                    </aside>

                    {/* Right: Restaurant Grid */}
                    <main className="w-full lg:w-3/4">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 px-2">
                            <span className="text-zinc-500 text-sm tracking-wide font-medium">
                                <span className="text-white font-serif text-lg mr-2">{list?.length || 0}</span>
                                matching establishments
                            </span>
                            <div className="relative group min-w-[200px] w-full sm:w-auto">
                                <select
                                    value={sortOption}
                                    onChange={handleSortChange}
                                    className="appearance-none w-full bg-zinc-900/50 backdrop-blur-md border border-white/10 rounded-xl px-5 py-3 text-sm text-zinc-300 focus:outline-none focus:border-amber-500/50 cursor-pointer transition-all hover:bg-zinc-900/80"
                                >
                                    <option value="" className="bg-zinc-950 text-white">Recommended Order</option>
                                    <option value="rating_desc" className="bg-zinc-950 text-white">Highest Guest Rating</option>
                                </select>
                                <ChevronDown size={16} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-zinc-500 pointer-events-none group-hover:text-amber-500 transition-colors" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {loading ? (
                                Array.from({ length: 4 }).map((_, idx) => (
                                    <div key={idx} className="bg-zinc-900/20 border border-white/5 rounded-3xl h-[450px] animate-pulse" />
                                ))
                            ) : list?.length > 0 ? (
                                list.map((restaurant, index) => (
                                    <motion.div
                                        key={restaurant._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                    >
                                        <RestaurantCard restaurant={restaurant} />
                                    </motion.div>
                                ))
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="col-span-1 md:col-span-2 text-center py-24 border border-white/10 rounded-3xl bg-zinc-900/20 backdrop-blur-sm"
                                >
                                    <div className="max-w-xs mx-auto">
                                        <Search size={40} className="mx-auto text-zinc-700 mb-6" />
                                        <h3 className="text-xl font-serif text-white mb-2">No Match Found</h3>
                                        <p className="text-zinc-500 font-light mb-8">Refine your filters to discover other exceptional venues.</p>
                                        <button
                                            onClick={handleClearFilters}
                                            className="text-amber-500 border border-amber-500/30 px-6 py-2 rounded-full text-sm font-medium hover:bg-amber-500/10 transition-colors"
                                        >
                                            View All Venues
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default ListingPage;

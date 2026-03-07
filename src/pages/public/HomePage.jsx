import React, { useState, useEffect } from 'react';
import { Search, MapPin, Calendar, Clock, Users, ArrowRight, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRestaurants } from '../../app/features/restaurantSlice';
import RestaurantCard from '../../components/cards/RestaurantCard';

const HomePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { list, loading } = useSelector((state) => state.restaurants);

  const [searchParams, setSearchParams] = useState({
    query: '',
    location: '',
    date: '',
    time: '',
    guests: ''
  });

  useEffect(() => {
    dispatch(fetchRestaurants());
  }, [dispatch]);

  const featured = (list || []).slice(0, 3);

  const handleSearchChange = (e) => {
    setSearchParams({
      ...searchParams,
      [e.target.name]: e.target.value
    });
  };

  const handleSearchSubmit = () => {
    const params = new URLSearchParams();
    if (searchParams.query) params.append('q', searchParams.query);
    if (searchParams.location) params.append('loc', searchParams.location);
    if (searchParams.date) params.append('date', searchParams.date);
    if (searchParams.time) params.append('time', searchParams.time);
    if (searchParams.guests) params.append('guests', searchParams.guests);

    navigate(`/restaurants?${params.toString()}`);
  };
  return (
    <div className="w-full flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image & Overlay */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2070&auto=format&fit=crop")' }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-luxury-bg z-10" />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center mt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="text-amber-500 font-medium tracking-[0.2em] uppercase text-sm mb-4 block">
              Exclusive Dining Experiences
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-6 leading-tight">
              A Taste of <br /> <span className="italic text-amber-500">Luxury</span>
            </h1>
            <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-12 font-light">
              Discover and secure reservations at the world's most prestigious culinary destinations.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="w-full max-w-5xl bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-2 flex flex-col lg:flex-row items-center gap-2 shadow-2xl"
          >
            <div className="flex w-full lg:w-auto flex-col md:flex-row gap-2 flex-grow">
              <div className="flex-1 bg-white/5 rounded-xl flex items-center px-4 py-3 md:py-4 transition-colors focus-within:bg-white/10 border border-transparent focus-within:border-amber-500/30">
                <Search className="text-amber-500 mr-3 h-5 w-5 flex-shrink-0" />
                <input
                  type="text"
                  name="query"
                  value={searchParams.query || ''}
                  onChange={handleSearchChange}
                  placeholder="Restaurant or cuisine"
                  className="bg-transparent border-none outline-none text-white w-full placeholder:text-zinc-500 font-light"
                />
              </div>

              <div className="flex-1 bg-white/5 rounded-xl flex items-center px-4 py-3 md:py-4 transition-colors focus-within:bg-white/10 border border-transparent focus-within:border-amber-500/30">
                <MapPin className="text-amber-500 mr-2 h-5 w-5 flex-shrink-0" />
                <input
                  type="text"
                  name="location"
                  value={searchParams.location || ''}
                  onChange={handleSearchChange}
                  placeholder="Location"
                  className="bg-transparent border-none outline-none text-white w-full placeholder:text-zinc-500 font-light"
                />
              </div>
            </div>

            <div className="flex w-full lg:w-auto flex-wrap sm:flex-nowrap gap-2">
              <div className="flex-1 sm:w-32 bg-white/5 rounded-xl flex items-center px-3 py-3 md:py-4 focus-within:bg-white/10 transition-colors border border-transparent focus-within:border-amber-500/30">
                <Calendar className="text-amber-500 mr-2 h-4 w-4 flex-shrink-0" />
                <input
                  type="date"
                  name="date"
                  value={searchParams.date || ''}
                  onChange={handleSearchChange}
                  className="bg-transparent border-none outline-none text-white w-full font-light text-sm [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
                />
              </div>

              <div className="flex-1 sm:w-28 bg-white/5 rounded-xl flex items-center px-3 py-3 md:py-4 focus-within:bg-white/10 transition-colors border border-transparent focus-within:border-amber-500/30">
                <Clock className="text-amber-500 mr-2 h-4 w-4 flex-shrink-0" />
                <input
                  type="time"
                  name="time"
                  value={searchParams.time || ''}
                  onChange={handleSearchChange}
                  className="bg-transparent border-none outline-none text-white w-full font-light text-sm [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
                />
              </div>

              <div className="flex-1 sm:w-28 bg-white/5 rounded-xl flex items-center px-3 py-3 md:py-4 focus-within:bg-white/10 transition-colors border border-transparent focus-within:border-amber-500/30">
                <Users className="text-amber-500 mr-2 h-4 w-4 flex-shrink-0" />
                <input
                  type="number"
                  name="guests"
                  min="1"
                  value={searchParams.guests || ''}
                  onChange={handleSearchChange}
                  placeholder="Guests"
                  className="bg-transparent border-none outline-none text-white w-full placeholder:text-zinc-500 font-light text-sm"
                />
              </div>
            </div>

            <button
              onClick={handleSearchSubmit}
              className="w-full lg:w-auto bg-amber-500 hover:bg-amber-400 text-black px-8 py-3 md:py-4 flex items-center justify-center rounded-xl font-medium transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] whitespace-nowrap"
            >
              Find Table
            </button>
          </motion.div>
        </div>
      </section>

      {/* Featured Secton */}
      <section className="py-24 bg-zinc-950 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-5xl font-serif text-white mb-4">Curated Selections</h2>
              <p className="text-zinc-400 font-light max-w-xl">Exceptional venues handpicked by our culinary experts for unforgettable dining moments.</p>
            </div>
            <Link to="/restaurants" className="hidden md:flex items-center text-amber-500 hover:text-white transition-colors group">
              <span className="uppercase tracking-wider text-sm font-medium mr-2">View All</span>
              <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              <p className="text-zinc-400">Loading exquisite venues...</p>
            ) : featured.length > 0 ? (
              featured.map(i => (
                <RestaurantCard key={i._id} restaurant={i} />
              ))
            ) : (
              <p className="text-zinc-400">No restaurants available at the moment.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

import React, { useState } from 'react';
import { Star, MapPin, Clock, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavorite } from '../../app/features/authSlice';

const RestaurantCard = ({ restaurant }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLiking, setIsLiking] = useState(false);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  // Check if restaurant._id / id is in user.favorites
  const restaurantId = restaurant._id || restaurant.id;
  const isFavorite = user?.favorites?.includes(restaurantId);

  const handleFavoriteClick = async (e) => {
    e.stopPropagation(); // prevent navigation
    if (!isAuthenticated) {
      navigate('/login', { state: { message: 'Please log in to save favorites' } });
      return;
    }
    if (isLiking) return;
    setIsLiking(true);
    await dispatch(toggleFavorite(restaurantId));
    setIsLiking(false);
  };

  return (
    <motion.div
      onClick={() => navigate(`/restaurants/${restaurant._id || restaurant.id}`)}
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="group bg-zinc-900 rounded-2xl overflow-hidden border border-white/5 hover:border-amber-500/30 transition-all duration-500 cursor-pointer shadow-lg hover:shadow-[0_10px_30px_rgba(212,175,55,0.1)]"
    >
      <div className="relative h-64 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
        <img
          src={restaurant.image || "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=2070&auto=format"}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
        />

        {/* Badges and Heart */}
        <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 items-end">
          <button
            onClick={handleFavoriteClick}
            disabled={isLiking}
            className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md border transition-all ${isFavorite
              ? 'bg-amber-500/20 border-amber-500/50'
              : 'bg-black/40 border-white/10 hover:bg-black/60 hover:border-white/30'
              }`}
          >
            <AnimatePresence mode="wait">
              {isLiking ? (
                <motion.div
                  key="spinner"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"
                />
              ) : (
                <motion.div
                  key="heart"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: isFavorite ? [1, 1.2, 1] : 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Heart className={`w-5 h-5 transition-colors ${isFavorite ? 'text-amber-500 fill-amber-500' : 'text-white'}`} />
                </motion.div>
              )}
            </AnimatePresence>
          </button>

          <div className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center shadow-lg mt-1">
            <Star className="text-amber-500 fill-amber-500 w-3 h-3 mr-1" />
            <span className="text-white text-xs font-medium">
              {Number(restaurant.rating || 0).toFixed(1)}
              <span className="text-zinc-400 ml-1 font-light">({restaurant.reviewCount || 0} reviews)</span>
            </span>
          </div>
          {restaurant.hasPackages && (
            <div className="bg-amber-500/20 backdrop-blur-md px-3 py-1 rounded-full border border-amber-500/30 flex items-center shadow-lg">
              <span className="text-amber-400 text-xs font-medium">✨ Packages</span>
            </div>
          )}
        </div>

        <div className="absolute bottom-4 left-4 z-20 flex gap-2 w-full pr-8 justify-between items-end">
          <span className="text-amber-500 text-xs font-semibold tracking-wider uppercase mb-1 block">
            {restaurant.cuisine || "Modern European"}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-2xl font-serif text-white mb-2 group-hover:text-amber-500 transition-colors">
          {restaurant.name || "The Golden Truffle"}
        </h3>

        <div className="flex items-center text-zinc-400 text-sm font-light mb-4 text-balance">
          <MapPin className="w-4 h-4 mr-1 text-white/50 shrink-0" />
          <span>{restaurant.location || "Mayfair, London"}</span>
        </div>

        <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-4 text-sm">
          <div className="flex items-center text-zinc-400">
            <Clock className="w-4 h-4 mr-1.5" />
            <span>{restaurant.workingHours?.weekday || '11:00 AM - 11:00 PM'}</span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/restaurants/${restaurant._id || restaurant.id}?book=true`);
            }}
            className="text-amber-500 font-medium hover:text-white transition-colors underline-offset-4 hover:underline"
          >
            Book Now
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default RestaurantCard;

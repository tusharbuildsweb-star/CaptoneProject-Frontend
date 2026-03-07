import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import api from '../../services/api';
import RestaurantCard from '../../components/cards/RestaurantCard';

const FavoritesPage = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const response = await api.get('users/favorites');
                setFavorites(response.data);
            } catch (error) {
                console.error('Failed to fetch favorites', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFavorites();
    }, []);

    return (
        <div className="min-h-screen bg-zinc-950 pt-28 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-10 flex items-center gap-4"
                >
                    <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center border border-amber-500/30">
                        <Heart className="w-6 h-6 text-amber-500 fill-amber-500" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-serif text-white">Your Favorites</h1>
                        <p className="text-zinc-400 mt-1">Restaurants you love and want to visit again.</p>
                    </div>
                </motion.div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : favorites.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {favorites.map((restaurant) => (
                            <RestaurantCard key={restaurant._id} restaurant={restaurant} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-32 bg-zinc-900/50 rounded-2xl border border-white/5">
                        <Heart className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
                        <h2 className="text-2xl font-serif text-white mb-2">No favorites yet</h2>
                        <p className="text-zinc-400 max-w-md mx-auto">
                            You haven't added any restaurants to your favorites list. Explore our collections and find your new favorite spot!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FavoritesPage;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Trash2 } from 'lucide-react';
import useFavorites from '../hooks/useFavorites';

const Favorites = () => {
    const { favorites, removeFromFavorites } = useFavorites();
    const navigate = useNavigate();

    if (favorites.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="text-center">
                    <Heart size={80} className="mx-auto mb-6 text-gray-600" />
                    <h2 className="text-3xl font-bold mb-4">No Favorites Yet</h2>
                    <p className="text-gray-400 mb-6 max-w-md mx-auto">
                        Start adding movies and TV shows to your favorites by clicking the heart icon!
                    </p>
                    <button
                        onClick={() => navigate('/')}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold transition-colors"
                    >
                        Browse Content
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen px-4 md:px-8 pt-24 pb-12">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                            <Heart size={40} className="text-red-500" fill="currentColor" />
                            My Favorites
                        </h1>
                        <p className="text-gray-400">{favorites.length} {favorites.length === 1 ? 'item' : 'items'}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                    {favorites.map((item) => (
                        <div
                            key={`${item.type}-${item.id}`}
                            className="group relative rounded-xl overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/30 transition-all duration-300 hover:scale-105 cursor-pointer"
                        >
                            <div
                                onClick={() => navigate(`/player/${item.type}/${item.id}`)}
                                className="aspect-[2/3] relative overflow-hidden"
                            >
                                {item.poster ? (
                                    <img
                                        src={`https://image.tmdb.org/t/p/w500${item.poster}`}
                                        alt={item.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                                        <span className="text-gray-500 text-sm">No Image</span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>

                            <div className="p-3">
                                <h3 className="font-semibold text-sm line-clamp-2 mb-1">{item.title}</h3>
                                <div className="flex items-center justify-between text-xs text-gray-400">
                                    <span className="flex items-center gap-1">
                                        ⭐ {item.rating?.toFixed(1) || 'N/A'}
                                    </span>
                                    <span className="uppercase text-xs px-2 py-0.5 bg-white/10 rounded">
                                        {item.type}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeFromFavorites(item.id, item.type);
                                }}
                                className="absolute top-2 right-2 p-2 bg-black/70 hover:bg-red-600 rounded-full text-white transition-colors opacity-0 group-hover:opacity-100 z-10"
                                aria-label="Remove from favorites"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Favorites;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Trash2, Film, Tv, List } from 'lucide-react';
import useFavorites from '../hooks/useFavorites';

const Favorites = () => {
    const { favorites, removeFromFavorites } = useFavorites();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('all');

    const filteredFavorites = favorites.filter(item => {
        if (activeTab === 'all') return true;
        if (activeTab === 'movies') return item.type === 'movie';
        if (activeTab === 'tv') return item.type === 'tv';
        return true;
    });

    const tabs = [
        { id: 'all', label: 'All Favorites' },
        { id: 'movies', label: 'Movies' },
        { id: 'tv', label: 'TV Shows' },
        { id: 'watchlist', label: 'Watchlist' }, // Placeholder
    ];

    if (favorites.length === 0) {
        return (
            <div className="min-h-screen bg-[#0f1014] flex items-center justify-center px-4 pt-20">
                <div className="text-center">
                    <Heart size={80} className="mx-auto mb-6 text-gray-700" />
                    <h2 className="text-3xl font-bold mb-4 text-white">Your collection is empty</h2>
                    <p className="text-gray-400 mb-8 max-w-md mx-auto">
                        Start building your personal library by adding movies and TV shows to your favorites.
                    </p>
                    <button
                        onClick={() => navigate('/')}
                        className="px-8 py-3 bg-white text-black hover:bg-gray-200 rounded-full font-bold transition-all transform hover:scale-105"
                    >
                        Explore Content
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0f1014] px-6 md:px-12 pt-24 pb-20">
            <div className="max-w-[1700px] mx-auto">
                <div className="mb-10">
                    <h1 className="text-4xl font-bold text-white mb-2">My Collection</h1>
                    <p className="text-gray-400">Your favorite movies and TV shows in one place</p>
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap gap-2 mb-10">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${activeTab === tab.id
                                    ? 'bg-white text-black'
                                    : 'bg-[#16181f] text-gray-400 hover:bg-[#22252f] hover:text-white border border-white/10'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Section Title (Dynamic based on filter) */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-white">
                        {activeTab === 'all' && 'All Items'}
                        {activeTab === 'movies' && 'Favorite Movies'}
                        {activeTab === 'tv' && 'Favorite TV Shows'}
                        {activeTab === 'watchlist' && 'Watchlist'}
                    </h2>
                    <span className="text-gray-500 text-sm">{filteredFavorites.length} items</span>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {filteredFavorites.map((item) => (
                        <div
                            key={`${item.type}-${item.id}`}
                            className="group relative rounded-xl overflow-hidden bg-[#16181f] border border-white/5 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] cursor-pointer shadow-lg"
                        >
                            <div
                                onClick={() => navigate(`/player/${item.type}/${item.id}`)}
                                className="aspect-[2/3] relative overflow-hidden"
                            >
                                {item.poster ? (
                                    <img
                                        src={`https://image.tmdb.org/t/p/w500${item.poster}`}
                                        alt={item.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                                        <span className="text-gray-500 text-sm">No Image</span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

                                {/* Top Right Rating Badge */}
                                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-xs font-bold text-yellow-400 flex items-center gap-1 border border-white/10">
                                    ★ {item.rating?.toFixed(1) || 'N/A'}
                                </div>
                            </div>

                            <div className="p-4 relative">
                                <h3 className="font-bold text-white text-base line-clamp-1 mb-1 group-hover:text-blue-400 transition-colors">{item.title}</h3>
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                    <span className="capitalize">{item.type === 'movie' ? 'Movie' : 'TV Show'}</span>
                                    {/* Remove button moved/styled for better UX inside Card or prominent */}
                                </div>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeFromFavorites(item.id, item.type);
                                    }}
                                    className="absolute bottom-4 right-4 p-2 bg-[#2a2a2a]/80 hover:bg-red-500/90 rounded-full text-gray-400 hover:text-white transition-all opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0"
                                    title="Remove from collection"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Favorites;

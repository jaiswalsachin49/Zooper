import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlay, FaTrash, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const ContinueWatchingRow = () => {
    const [items, setItems] = useState([]);
    const navigate = useNavigate();
    const scrollRef = useRef(null);

    useEffect(() => {
        const loadItems = () => {
            try {
                const stored = localStorage.getItem('zooper_continue_watching');
                if (stored) {
                    setItems(JSON.parse(stored));
                }
            } catch (e) {
                console.error("Failed to load continue watching", e);
            }
        };

        loadItems();
        // Add listener for storage updates (in case player updates it in another tab/component)
        window.addEventListener('storage', loadItems);
        return () => window.removeEventListener('storage', loadItems);
    }, []);

    const handleRemove = (e, id) => {
        e.stopPropagation();
        const newItems = items.filter(item => item.id !== id);
        setItems(newItems);
        localStorage.setItem('zooper_continue_watching', JSON.stringify(newItems));
    };

    const handlePlay = (item) => {
        navigate(`/player/${item.media_type || 'movie'}/${item.id}`, {
            state: { movieData: item }
        });
    };

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = direction === 'left' ? -current.offsetWidth : current.offsetWidth;
            current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    if (items.length === 0) return null;

    return (
        <div className="mb-10 px-6 group relative">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4 border-l-4 border-blue-500 pl-4">Continue Watching</h2>

            <div className="relative">
                <button
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0 hover:bg-black/80 hidden md:block"
                    onClick={() => scroll('left')}
                >
                    <FaChevronLeft size={24} />
                </button>

                <div
                    ref={scrollRef}
                    className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 scroll-smooth snap-x"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {items.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => handlePlay(item)}
                            className="min-w-[240px] md:min-w-[280px] cursor-pointer relative group/card snap-start"
                        >
                            {/* Card Image */}
                            <div className="aspect-video relative rounded-lg overflow-hidden border border-white/10 bg-gray-800">
                                <img
                                    src={`https://image.tmdb.org/t/p/w500${item.backdrop_path || item.poster_path}`}
                                    alt={item.title}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover/card:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover/card:bg-black/40 transition-colors flex items-center justify-center">
                                    <FaPlay className="text-white opacity-0 group-hover/card:opacity-100 transform scale-0 group-hover/card:scale-100 transition-all duration-300 drop-shadow-lg" size={32} />
                                </div>

                                {/* Progress Bar (Visual Fake or timestamp based if we had duration) */}
                                <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-700">
                                    <div className="h-full bg-blue-500 w-1/2"></div>
                                </div>

                                {/* Remove Button */}
                                <button
                                    onClick={(e) => handleRemove(e, item.id)}
                                    className="absolute top-2 right-2 bg-black/60 p-1.5 rounded-full text-white/70 hover:text-red-400 hover:bg-black/80 opacity-0 group-hover/card:opacity-100 transition-opacity"
                                    title="Remove from history"
                                >
                                    <FaTrash size={12} />
                                </button>
                            </div>

                            {/* Title */}
                            <h3 className="text-white/90 text-sm font-medium mt-2 truncate group-hover/card:text-white transition-colors">
                                {item.title || item.name}
                            </h3>
                            <div className="text-xs text-gray-400">
                                {item.timestamp ? `Resume from ${Math.floor(item.timestamp / 60)}m` : 'Resume'}
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0 hover:bg-black/80 hidden md:block"
                    onClick={() => scroll('right')}
                >
                    <FaChevronRight size={24} />
                </button>
            </div>
        </div>
    );
};

export default ContinueWatchingRow;

import React, { useEffect } from "react";
import { X, Play, Star, Calendar, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DetailModal = ({ isOpen, onClose, content }) => {
    const navigate = useNavigate();

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!isOpen || !content) return null;

    return (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            <div className="relative w-full max-w-4xl bg-[#0f1014] rounded-2xl overflow-hidden shadow-2xl border border-white/10 animate-in fade-in zoom-in duration-300">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                >
                    <X size={24} />
                </button>

                {/* Hero Image */}
                <div className="relative h-[400px] w-full">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f1014] via-transparent to-transparent z-[1]" />
                    <img
                        src={`https://image.tmdb.org/t/p/original${content.backdrop_path || content.poster_path}`}
                        alt={content.title || content.name}
                        className="w-full h-full object-cover"
                    />

                    <div className="absolute bottom-0 left-0 p-8 z-[2] w-full">
                        <h2 className="text-4xl font-bold text-white mb-2">
                            {content.title || content.name}
                        </h2>

                        <div className="flex items-center gap-4 text-gray-300 text-sm mb-4">
                            <span className="flex items-center gap-1 text-yellow-400">
                                <Star size={16} fill="currentColor" />
                                {content.vote_average?.toFixed(1)}
                            </span>
                            <span className="flex items-center gap-1">
                                <Calendar size={16} />
                                {(content.release_date || content.first_air_date)?.slice(0, 4)}
                            </span>
                            {content.media_type && (
                                <span className="px-2 py-0.5 bg-white/10 rounded text-xs uppercase border border-white/10">
                                    {content.media_type}
                                </span>
                            )}
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => navigate(`/player/${content.media_type || 'movie'}/${content.id}`)}
                                className="flex items-center gap-2 bg-white text-black px-6 py-2.5 rounded-lg font-bold hover:bg-gray-200 transition-colors"
                            >
                                <Play size={20} fill="currentColor" />
                                Play Now
                            </button>
                            {/* Add to list button could go here */}
                        </div>
                    </div>
                </div>

                {/* Content Details */}
                <div className="p-8 pt-0">
                    <p className="text-gray-300 text-lg leading-relaxed mb-6">
                        {content.overview}
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-sm text-gray-400">
                        <div>
                            <span className="block text-gray-500 mb-1">Original Language</span>
                            <span className="text-white uppercase">{content.original_language}</span>
                        </div>
                        <div>
                            <span className="block text-gray-500 mb-1">Popularity</span>
                            <span className="text-white">{content.popularity?.toFixed(0)}</span>
                        </div>
                        <div>
                            <span className="block text-gray-500 mb-1">Vote Count</span>
                            <span className="text-white">{content.vote_count}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailModal;

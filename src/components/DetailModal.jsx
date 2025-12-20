import React, { useEffect, useState } from "react";
import { X, Play, Plus, Check, ThumbsUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useFavorites from "../hooks/useFavorites";
import api from "../services/api";

const DetailModal = ({ isOpen, onClose, content }) => {
    const navigate = useNavigate();
    const { toggleFavorite, isFavorite } = useFavorites();
    const favorited = content ? isFavorite(content.id, content.media_type || 'movie') : false;
    const [cast, setCast] = useState([]);
    const [castLoading, setCastLoading] = useState(false);
    const [castError, setCastError] = useState(false);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";

            // Fetch cast data
            if (content?.id) {
                const fetchCast = async () => {
                    setCastLoading(true);
                    setCastError(false);
                    try {
                        const mediaType = content.media_type || 'movie';
                        const response = await api.get(`/${mediaType}/${content.id}/credits`);
                        setCast(response.data.cast?.slice(0, 10) || []);
                        setCastLoading(false);
                    } catch (error) {
                        console.error("Failed to fetch cast", error);
                        setCastError(true);
                        setCastLoading(false);
                        setCast([]);
                    }
                };
                fetchCast();
            }
        } else {
            document.body.style.overflow = "unset";
            setCast([]);
            setCastLoading(false);
            setCastError(false);
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen, content]);

    if (!isOpen || !content) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            <div className="relative w-full max-w-5xl max-h-[90vh] bg-[#141414] rounded-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200 flex flex-col">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 p-2 bg-[#181818] hover:bg-[#2a2a2a] rounded-full text-white transition-colors border border-white/10"
                >
                    <X size={20} />
                </button>

                {/* Scrollable Content */}
                <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    {/* Hero Section */}
                    <div className="relative h-[350px] md:h-[450px] w-full flex-shrink-0">
                        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/20 to-transparent z-[1]" />
                        <img
                            src={`https://image.tmdb.org/t/p/original${content.backdrop_path || content.poster_path}`}
                            alt={content.title || content.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.target.src = `https://image.tmdb.org/t/p/w500${content.poster_path}`;
                                e.target.onerror = () => {
                                    e.target.style.display = 'none';
                                    e.target.parentElement.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                                };
                            }}
                        />

                        <div className="absolute bottom-0 left-0 p-8 md:p-12 z-[2] w-full max-w-3xl">
                            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-lg leading-tight">
                                {content.title || content.name}
                            </h2>

                            <div className="flex items-center gap-4 text-white text-sm md:text-base font-medium mb-6">
                                <span className="text-green-500 font-bold">
                                    {Math.round(content.vote_average * 10)}% Match
                                </span>
                                <span className="text-gray-300">
                                    {(content.release_date || content.first_air_date)?.slice(0, 4)}
                                </span>
                                <span className="border border-gray-500/50 px-2 py-0.5 rounded text-xs text-gray-300">HD</span>
                                {content.media_type && (
                                    <span className="capitalize text-gray-300 border border-gray-500/50 px-2 py-0.5 rounded text-xs">
                                        {content.media_type}
                                    </span>
                                )}
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        onClose();
                                        navigate(`/player/${content.media_type || 'movie'}/${content.id}`, { state: { movieData: content } });
                                    }}
                                    className="flex items-center gap-2 bg-white text-black px-8 py-2.5 rounded font-bold hover:bg-gray-200 transition-colors text-lg"
                                >
                                    <Play size={24} fill="currentColor" />
                                    Play
                                </button>
                                <button
                                    onClick={() => toggleFavorite(content)}
                                    className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-gray-500 bg-[#2a2a2a]/60 hover:border-white text-white transition-all backdrop-blur-sm"
                                    title={favorited ? "Remove from Favorites" : "Add to Favorites"}
                                >
                                    {favorited ? <Check size={20} /> : <Plus size={20} />}
                                </button>
                                <button
                                    className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-gray-500 bg-[#2a2a2a]/60 hover:border-white text-white transition-all backdrop-blur-sm"
                                >
                                    <ThumbsUp size={20} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Content Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-6 md:p-10">
                        <div className="md:col-span-2 space-y-4">
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                {/* Additional metadata could go here */}
                            </div>
                            <p className="text-white text-base md:text-lg leading-relaxed">
                                {content.overview}
                            </p>

                            {/* Cast List */}
                            {castLoading ? (
                                <div className="mt-6">
                                    <h3 className="text-lg font-semibold text-white mb-4">Cast</h3>
                                    <div className="flex gap-4 overflow-x-hidden">
                                        {[1, 2, 3, 4].map((i) => (
                                            <div key={i} className="flex-shrink-0 w-24">
                                                <div className="aspect-[2/3] bg-white/5 rounded-lg animate-pulse mb-2"></div>
                                                <div className="h-3 bg-white/5 rounded animate-pulse mb-1"></div>
                                                <div className="h-2 bg-white/5 rounded animate-pulse w-3/4"></div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : castError ? (
                                <div className="mt-6">
                                    <h3 className="text-lg font-semibold text-white mb-2">Cast</h3>
                                    <p className="text-gray-500 text-sm">Unable to load cast information.</p>
                                </div>
                            ) : cast.length > 0 ? (
                                <div className="mt-6">
                                    <h3 className="text-lg font-semibold text-white mb-4">Cast</h3>
                                    <div className="flex overflow-x-auto gap-4 pb-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                                        {cast.map((actor) => (
                                            <div key={actor.id} className="flex-shrink-0 w-24 group cursor-pointer">
                                                <div className="aspect-[2/3] rounded-lg overflow-hidden bg-white/5 mb-2">
                                                    {actor.profile_path ? (
                                                        <img
                                                            src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                                                            alt={actor.name}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                            onError={(e) => {
                                                                e.target.style.display = 'none';
                                                                e.target.parentElement.innerHTML = `
                                                                    <div class="w-full h-full flex items-center justify-center text-gray-600">
                                                                        <svg class="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                                                                            <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                                                                        </svg>
                                                                    </div>
                                                                `;
                                                            }}
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-600">
                                                            <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                </div>
                                                <p className="text-xs font-medium text-white truncate">{actor.name}</p>
                                                <p className="text-[10px] text-gray-500 truncate">{actor.character}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : null}
                        </div>

                        <div className="space-y-4 text-sm">
                            <div>
                                <span className="block text-gray-500 mb-1">Original Language</span>
                                <span className="text-white capitalize">{new Intl.DisplayNames(['en'], { type: 'language' }).of(content.original_language)}</span>
                            </div>
                            <div>
                                <span className="block text-gray-500 mb-1">Votes</span>
                                <span className="text-white">{content.vote_count}</span>
                            </div>
                            <div>
                                <span className="block text-gray-500 mb-1">Popularity</span>
                                <span className="text-white">{Math.round(content.popularity)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailModal;

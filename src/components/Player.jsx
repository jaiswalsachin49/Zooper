import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, Server, Maximize, Minimize, Heart, Calendar, Star, Info } from 'lucide-react'
import useFavorites from '../hooks/useFavorites'
import api from '../services/api'

const VIDSRC_SERVERS = [
    { name: 'Player 1', url: import.meta.env.VITE_PLAYER1 },
    { name: 'Player 2', url: import.meta.env.VITE_PLAYER2 },
    { name: 'Player 3', url: import.meta.env.VITE_PLAYER3 },
]

const Player = () => {
    const { type, playerId } = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const [currentServer, setCurrentServer] = useState(0)
    const [showServerMenu, setShowServerMenu] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [initialStartTime, setInitialStartTime] = useState(0)
    const playerContainerRef = useRef(null)
    const { isFavorite, toggleFavorite } = useFavorites()

    // State for movie details if not provided in location
    const [details, setDetails] = useState(location.state?.movieData || null)

    const actualType = (!type || type === "undefined") ? "movie" : type;

    // Fetch details if missing
    useEffect(() => {
        if (!details && playerId) {
            const fetchDetails = async () => {
                try {
                    const response = await api.get(`/${actualType}/${playerId}`);
                    setDetails(response.data);
                } catch (error) {
                    console.error("Failed to fetch movie details", error);
                }
            };
            fetchDetails();
        }
    }, [details, playerId, actualType]);

    // Load saved progress
    useEffect(() => {
        const savedProgress = localStorage.getItem('zooper_continue_watching');
        if (savedProgress) {
            try {
                const progressData = JSON.parse(savedProgress);
                // Find progress for this specific item
                const itemProgress = progressData.find(item => item.id.toString() === playerId.toString());
                if (itemProgress) {
                    // Start a bit earlier for context (e.g. 5 seconds)
                    console.log("Resuming from saved timestamp:", itemProgress.timestamp);
                    setInitialStartTime(Math.max(0, itemProgress.timestamp - 5));
                }
            } catch (e) {
                console.error("Error parsing continue watching data", e);
            }
        }
    }, [playerId]);


    // Build video URL based on selected server
    const getVideoURL = () => {
        const server = VIDSRC_SERVERS[currentServer]
        let url = `${server.url}/${actualType}/${playerId}`
        if (initialStartTime > 0) {
            url += `?start_at=${Math.floor(initialStartTime)}`
        }
        return url
    }

    // Message listener removed as third-party player events are unreliable.
    // We rely on the disclaimer to inform users that progress is not tracked.

    useEffect(() => {
        // Reset loading state when server changes
        setIsLoading(true)
    }, [currentServer])

    // Fullscreen change event listener
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement)
        }

        document.addEventListener('fullscreenchange', handleFullscreenChange)
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
        document.addEventListener('mozfullscreenchange', handleFullscreenChange)
        document.addEventListener('MSFullscreenChange', handleFullscreenChange)

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange)
            document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
            document.removeEventListener('mozfullscreenchange', handleFullscreenChange)
            document.removeEventListener('MSFullscreenChange', handleFullscreenChange)
        }
    }, [])

    const toggleFullscreen = () => {
        // We only toggle fullscreen on the player container if strictly needed, 
        // but typically for a "page" layout, we might want to fullscreen just the video wrapper 
        // OR the whole page. The previous implementation fullscreened `playerContainerRef`.
        // We will keep that behavior for the "maximize" button.

        if (!document.fullscreenElement) {
            // Enter fullscreen
            if (playerContainerRef.current.requestFullscreen) {
                playerContainerRef.current.requestFullscreen()
            } else if (playerContainerRef.current.webkitRequestFullscreen) {
                playerContainerRef.current.webkitRequestFullscreen()
            } else if (playerContainerRef.current.mozRequestFullScreen) {
                playerContainerRef.current.mozRequestFullScreen()
            } else if (playerContainerRef.current.msRequestFullscreen) {
                playerContainerRef.current.msRequestFullscreen()
            }
        } else {
            // Exit fullscreen
            if (document.exitFullscreen) {
                document.exitFullscreen()
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen()
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen()
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen()
            }
        }
    }

    const handleServerChange = (index) => {
        setCurrentServer(index)
        setShowServerMenu(false)
    }

    if (!playerId) {
        return (
            <div className="w-full h-screen flex justify-center items-center bg-[#0f1014] text-white">
                <div className="text-center text-xl">Invalid video link.</div>
            </div>
        )
    }

    // Determine if we are favorited
    // We need to construct a "content" object for the hook if 'details' is available
    const isFavorited = details ? isFavorite(details.id, actualType) : false;

    const handleToggleFavorite = () => {
        if (details) {
            // Ensure the data passed matches what useFavorites expects
            // Standardize data for the hook if needed, but the hook seems robust enough for TMDB objects.
            toggleFavorite({
                ...details,
                media_type: actualType, // Ensure media_type is set
            });
        }
    };

    return (
        <div className="min-h-screen bg-[#0f1014] text-white flex flex-col">
            {/* Top Navigation / Controls (visible when not fullscreen, or overlaid) */}
            <div className="px-6 py-4 flex items-center gap-4 z-10">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all backdrop-blur-md"
                    aria-label="Go back"
                >
                    <ArrowLeft size={24} />
                </button>
                <div className="flex-1" />
            </div>

            {/* Video Player Section */}
            <div className="w-full max-w-7xl mx-auto px-0 md:px-6">
                <div
                    ref={playerContainerRef}
                    className={`relative w-full aspect-video bg-black shadow-2xl rounded-xl overflow-hidden group ${isFullscreen ? 'w-full h-screen fixed top-0 left-0 z-50 rounded-none' : ''}`}
                >
                    {/* Server Selection & Fullscreen Controls - visible in overlay */}
                    <div className="absolute top-4 right-4 z-[20] flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        {/* Server Selection */}
                        <div className="relative">
                            <button
                                onClick={() => setShowServerMenu(!showServerMenu)}
                                className="p-2 bg-black/60 hover:bg-black/80 rounded-md text-white transition-all backdrop-blur-md border border-white/20 flex items-center gap-2 text-sm font-medium"
                            >
                                <Server size={18} />
                                <span>{VIDSRC_SERVERS[currentServer].name}</span>
                            </button>

                            {/* Server Menu */}
                            {showServerMenu && (
                                <div className="absolute top-full right-0 mt-2 bg-black/90 backdrop-blur-xl rounded-lg border border-white/20 overflow-hidden shadow-2xl min-w-[150px]">
                                    {VIDSRC_SERVERS.map((server, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleServerChange(index)}
                                            className={`w-full px-4 py-3 text-left transition-colors text-sm ${currentServer === index
                                                ? 'bg-blue-600 text-white'
                                                : 'text-gray-300 hover:bg-white/10'
                                                }`}
                                        >
                                            {server.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Fullscreen Toggle */}
                        <button
                            onClick={toggleFullscreen}
                            className="p-2 bg-black/60 hover:bg-black/80 rounded-md text-white transition-all backdrop-blur-md border border-white/20"
                        >
                            {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
                        </button>
                    </div>

                    {/* Loading Indicator */}
                    {isLoading && (
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[10] pointer-events-none">
                            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    )}

                    {/* Iframe */}
                    <div className="w-full h-full relative">
                        <iframe
                            key={`${currentServer}-${initialStartTime}`}
                            className='w-full h-full'
                            title="Video Player"
                            allow='autoplay; encrypted-media; gyroscope; picture-in-picture'
                            allowFullScreen
                            src={getVideoURL()}
                            onLoad={() => setIsLoading(false)}
                            onError={() => setIsLoading(false)}
                            referrerPolicy="origin"
                            sandbox='allow-scripts allow-same-origin allow-forms allow-pointer-lock allow-presentation allow-top-navigation allow-top-navigation-by-user-activation'
                        />
                    </div>
                </div>
            </div>

            {/* Movie Details & Disclaimer Section */}
            <div className="max-w-7xl mx-auto w-full px-6 py-8">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                    {/* Content Details */}
                    <div className="flex-1">
                        {details ? (
                            <>
                                <h1 className="text-3xl font-bold text-white mb-2">{details.title || details.name}</h1>

                                <div className="flex items-center gap-4 text-gray-400 text-sm mb-6">
                                    <div className="flex items-center gap-1">
                                        <Star size={16} className="text-yellow-500 fill-yellow-500" />
                                        <span>{details.vote_average?.toFixed(1)}</span>
                                    </div>
                                    <span>•</span>
                                    <div className="flex items-center gap-1">
                                        <Calendar size={16} />
                                        <span>{(details.release_date || details.first_air_date)?.slice(0, 4)}</span>
                                    </div>
                                    <span>•</span>
                                    <span className="capitalize">{actualType === 'movie' ? 'Movie' : 'TV Show'}</span>
                                </div>

                                <div className="flex items-center gap-4 mb-8">
                                    <button
                                        onClick={handleToggleFavorite}
                                        className={`px-6 py-2.5 rounded-full font-bold flex items-center gap-2 transition-all transform active:scale-95 ${isFavorited
                                            ? 'bg-red-600 text-white hover:bg-red-700'
                                            : 'bg-white text-black hover:bg-gray-200'
                                            }`}
                                    >
                                        <Heart size={20} className={isFavorited ? 'fill-white' : ''} />
                                        {isFavorited ? 'Favorited' : 'Add to Favorites'}
                                    </button>
                                </div>

                                <div className="bg-[#16181f] p-6 rounded-xl border border-white/5">
                                    <h3 className="text-lg font-semibold text-white mb-2">Overview</h3>
                                    <p className="text-gray-400 leading-relaxed font-light">
                                        {details.overview || "No overview available."}
                                    </p>
                                </div>
                            </>
                        ) : (
                            <div className="animate-pulse space-y-4">
                                <div className="h-8 bg-white/10 rounded w-1/3"></div>
                                <div className="h-4 bg-white/10 rounded w-1/4"></div>
                                <div className="h-32 bg-white/10 rounded w-full"></div>
                            </div>
                        )}

                        {/* Disclaimer */}
                        <div className="mt-8 flex items-start gap-3 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-yellow-200/80 text-sm">
                            <Info size={20} className="shrink-0 mt-0.5 text-yellow-500" />
                            <div className="space-y-2">
                                <p>
                                    <strong className="block text-yellow-500 mb-1">Disclaimer</strong>
                                    We do not keep track of your episode progress or continue watching history. Please remember where you left off.
                                </p>
                                <p>
                                    If the video is not found or fails to load, please try switching servers using the server menu in the top right corner of the player.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Player

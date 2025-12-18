import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, Server, Maximize, Minimize, Heart, Calendar, Star, Info, ChevronDown } from 'lucide-react'
import useFavorites from '../hooks/useFavorites'
import api from '../services/api'

const PLAYER_SERVERS = [
    { name: 'Server 1', url: import.meta.env.VITE_PLAYER1, isPrimary: true },
    { name: 'Server 2', url: import.meta.env.VITE_PLAYER2 },
    { name: 'Server 3', url: import.meta.env.VITE_PLAYER3 },
    { name: 'Server 4', url: import.meta.env.VITE_PLAYER4 },
    { name: 'Server 5', url: import.meta.env.VITE_PLAYER5 },
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

    // State for movie/TV details
    const [details, setDetails] = useState(location.state?.movieData || null)

    // TV Show specific states
    const [selectedSeason, setSelectedSeason] = useState(1)
    const [selectedEpisode, setSelectedEpisode] = useState(1)
    const [seasons, setSeasons] = useState([])

    const actualType = (!type || type === "undefined") ? "movie" : type;

    // Fetch details including seasons for TV shows
    useEffect(() => {
        if (playerId) {
            const fetchDetails = async () => {
                try {
                    const response = await api.get(`/${actualType}/${playerId}`);
                    setDetails(response.data);

                    // For TV shows, extract seasons
                    if (actualType === 'tv' && response.data.seasons) {
                        // Filter out season 0 (specials) if exists
                        const validSeasons = response.data.seasons.filter(s => s.season_number > 0);
                        setSeasons(validSeasons);
                    }
                } catch (error) {
                    console.error("Failed to fetch details", error);
                }
            };
            fetchDetails();
        }
    }, [playerId, actualType]);

    // Continue Watching - Load last watched episode
    useEffect(() => {
        if (actualType === 'tv' && playerId && currentServer === 0) {
            const progress = localStorage.getItem('playerProgress');
            if (progress) {
                try {
                    let data = JSON.parse(progress);
                    if (!Array.isArray(data)) data = [data]; // Handle legacy

                    const showProgress = data.find(item => item.id === Number(playerId) && item.media_type === 'tv');

                    if (showProgress?.season && showProgress?.episode) {
                        setSelectedSeason(Number(showProgress.season));
                        setSelectedEpisode(Number(showProgress.episode));
                    } else if (showProgress?.last_season_watched && showProgress?.last_episode_watched) {
                        // Graceful fallback for older data structure
                        setSelectedSeason(Number(showProgress.last_season_watched));
                        setSelectedEpisode(Number(showProgress.last_episode_watched));
                    }
                } catch (e) {
                    console.error('Failed to load progress', e);
                }
            }
        }
    }, [actualType, playerId, currentServer]);

    // Player postMessage event listener for continue watching
    useEffect(() => {
        const handlePlayerMessage = (event) => {
            // Validate origin for security
            if (event.origin !== 'https://vidrock.net') return;

            // Dismiss loading state when we receive a valid message from the player
            setIsLoading(false);

            // Store continue watching data
            if (event.data?.type === 'MEDIA_DATA') {
                // Get existing history first to preserve images if needed
                const existingRaw = localStorage.getItem('playerProgress');
                let history = [];
                try {
                    history = existingRaw ? JSON.parse(existingRaw) : [];
                    if (!Array.isArray(history)) history = [history];
                } catch (e) {
                    history = [];
                }

                // Find existing entry to fallback to its images if needed
                const existingEntry = history.find(h => h.id === Number(playerId));

                const mediaData = {
                    ...event.data.data,
                    id: Number(playerId),
                    media_type: actualType,
                    // Use a distinct field for the save time
                    last_updated: Date.now(),
                    // Ensure we capture playback progress correctly
                    progress: event.data.data.currentTime || event.data.data.timestamp || 0,

                    // Priority: 1. Current Page Details, 2. Event Data, 3. Existing Saved Data
                    poster_path: details?.poster_path || event.data.data.poster_path || existingEntry?.poster_path,
                    backdrop_path: details?.backdrop_path || event.data.data.backdrop_path || existingEntry?.backdrop_path,
                    title: details?.title || details?.name || event.data.data.title || event.data.data.name || existingEntry?.title || existingEntry?.name
                };

                // Remove existing entry for this ID to avoid duplicates and move to top
                history = history.filter(h => h.id !== mediaData.id);
                history.unshift(mediaData);

                // Keep max 20 items
                if (history.length > 20) history.pop();

                localStorage.setItem('playerProgress', JSON.stringify(history));
                if (process.env.NODE_ENV === 'development') {
                    console.log('Progress saved:', mediaData);
                }
            }

            // Track player events (optional, for analytics)
            if (event.data?.type === 'PLAYER_EVENT') {
                const { event: eventType, currentTime, duration, season, episode } = event.data.data;
                console.log(`Player ${eventType}:`, { currentTime, duration, season, episode });
            }
        };

        window.addEventListener('message', handlePlayerMessage);
        return () => window.removeEventListener('message', handlePlayerMessage);
    }, [playerId, actualType, details]);

    // Build video URL based on selected server
    const getVideoURL = () => {
        const server = PLAYER_SERVERS[currentServer]

        // Primary server (index 0)
        if (server.isPrimary) {
            // VidRock configuration parameters
            const params = new URLSearchParams({
                // theme: '2563EB', // blue-600 (without #)
                episodeselector: 'true', // We have our own
                nextbutton: 'true', // We can manage next episode manually or let user click
                autoplay: 'false',
                autonext: 'true'
            });

            if (actualType === 'tv') {
                return `${server.url}/tv/${playerId}/${selectedSeason}/${selectedEpisode}?${params.toString()}`
            } else {
                return `${server.url}/movie/${playerId}?${params.toString()}`
            }
        }

        // Other servers
        let url = `${server.url}/${actualType}/${playerId}`
        if (initialStartTime > 0) {
            url += `?start_at=${Math.floor(initialStartTime)}`
        }
        return url
    }

    useEffect(() => {
        // Reset loading state when server, season, or episode changes
        setIsLoading(true)

        // Safety timeout to disable loader if iframe onLoad fails
        const timer = setTimeout(() => setIsLoading(false), 5000);
        return () => clearTimeout(timer);
    }, [currentServer, selectedSeason, selectedEpisode])

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
    const isFavorited = details ? isFavorite(details.id, actualType) : false;

    const handleToggleFavorite = () => {
        if (details) {
            toggleFavorite({
                ...details,
                media_type: actualType,
            });
        }
    };

    // Get current season data
    const currentSeasonData = seasons.find(s => s.season_number === selectedSeason);
    const episodeCount = currentSeasonData?.episode_count || 20; // Default to 20 if unknown

    return (
        <div className="min-h-screen bg-[#0f1014] text-white flex flex-col">
            {/* Top Navigation / Controls */}
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
                    {/* Server Selection & Fullscreen Controls */}
                    <div className="absolute top-4 right-4 z-[20] flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        {/* Server Selection */}
                        <div className="relative">
                            <button
                                onClick={() => setShowServerMenu(!showServerMenu)}
                                className="p-2 bg-black/60 hover:bg-black/80 rounded-md text-white transition-all backdrop-blur-md border border-white/20 flex items-center gap-2 text-sm font-medium"
                            >
                                <Server size={18} />
                                <span>{PLAYER_SERVERS[currentServer].name}</span>
                            </button>

                            {/* Server Menu */}
                            {showServerMenu && (
                                <div className="absolute top-full right-0 mt-2 bg-black/90 backdrop-blur-xl rounded-lg border border-white/20 overflow-hidden shadow-2xl min-w-[150px]">
                                    {PLAYER_SERVERS.map((server, index) => (
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
                    <style>
                        {`
                            iframe {
                                width: 100%;
                                height: 100%;
                                border: none;
                                overflow: hidden;
                            }
                        `}
                    </style>
                    <div className="w-full h-full relative">
                        <iframe
                            key={`${currentServer}-${selectedSeason}-${selectedEpisode}`}
                            className='w-full h-full'
                            title="Video Player"
                            allow='autoplay; encrypted-media; gyroscope; picture-in-picture'
                            allowFullScreen
                            // sandbox='allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-downloads-to-extend-cache allow-downloads'
                            scrolling="no"
                            src={getVideoURL()}
                            onLoad={() => setIsLoading(false)}
                            onError={() => setIsLoading(false)}
                            referrerPolicy="origin"
                        />
                    </div>
                </div>
            </div>

            {/* Right Column: Season/Episode Selector (Only for TV, moved here for side-by-side) */}
            {actualType === 'tv' && seasons.length > 0 && (
                <div className="max-w-7xl mx-auto w-full px-6 py-6">
                    <div className="flex flex-col lg:flex-row gap-6 items-start">
                        {/* Movie Details (Left side when flex-row, Top when flex-col) */}
                        <div className="flex-1 w-full">
                            {/* Movie Details & Disclaimer Section */}
                            <div className="w-full">
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
                                <div className="mt-8 flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-200/80 text-sm">
                                    <Info size={20} className="shrink-0 mt-0.5 text-blue-500" />
                                    <div className="space-y-2">
                                        <p>
                                            <strong className="block text-blue-500 mb-1">Continue Watching</strong>
                                            Your watch progress is automatically saved and synced across sessions.
                                            {actualType === 'tv' && ' For TV shows, we will remember your last watched episode.'}
                                        </p>
                                        <p>
                                            If the video is not found or fails to load, please try switching servers using the server menu in the top right corner of the player.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Season/Episode Selector (Right side) */}
                        <div className="w-full lg:w-[400px] shrink-0">
                            <div className="sticky top-6 relative overflow-hidden rounded-2xl bg-[#16181f] border border-white/10 shadow-2xl h-fit">
                                {/* Blue Accent Top */}
                                {/* <div className="h-1 w-full bg-gradient-to-r from-blue-600 to-purple-600"></div> */}

                                <div className="p-6">
                                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                                        </svg>
                                        Episodes
                                    </h3>

                                    <div className="space-y-6">
                                        {/* Season Selector */}
                                        <div>
                                            <label className="block text-xs font-semibold uppercase text-gray-500 mb-2 tracking-wider">Season</label>
                                            <div className="relative">
                                                <select
                                                    value={selectedSeason}
                                                    onChange={(e) => {
                                                        setSelectedSeason(Number(e.target.value));
                                                        setSelectedEpisode(1);
                                                    }}
                                                    className="w-full appearance-none bg-[#0a0d14] border border-white/10 hover:border-blue-500/50 focus:border-blue-500 rounded-lg px-4 py-3 text-white focus:outline-none cursor-pointer transition-all"
                                                >
                                                    {seasons.map(s => (
                                                        <option key={s.season_number} value={s.season_number}>
                                                            Season {s.season_number}
                                                        </option>
                                                    ))}
                                                </select>
                                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                                            </div>
                                            <p className="text-xs text-gray-500 mt-2 text-right">
                                                {currentSeasonData?.episode_count || episodeCount} episodes
                                            </p>
                                        </div>

                                        {/* Episode List (Vertical) */}
                                        <div>
                                            <label className="block text-xs font-semibold uppercase text-gray-500 mb-2 tracking-wider">Select Episode</label>
                                            <div className="grid grid-cols-4 lg:grid-cols-4 gap-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                                {Array.from({ length: episodeCount }, (_, i) => {
                                                    const epNum = i + 1;
                                                    const isSelected = selectedEpisode === epNum;
                                                    return (
                                                        <button
                                                            key={epNum}
                                                            onClick={() => setSelectedEpisode(epNum)}
                                                            className={`
                                                                    h-12 px-1 rounded
                                                                    text-xs font-medium
                                                                    transition
                                                                    ${isSelected
                                                                    ? 'bg-blue-500 text-white'
                                                                    : 'text-gray-500 hover:text-white hover:bg-white/5'}
                                                            `}
                                                        >
                                                            {epNum}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* Navigation Buttons */}
                                        <div className="flex gap-3 pt-4 border-t border-white/5">
                                            <button
                                                onClick={() => setSelectedEpisode(prev => Math.max(1, prev - 1))}
                                                disabled={selectedEpisode === 1}
                                                className="flex-1 py-3 bg-[#0a0d14] hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white text-sm font-medium transition-all border border-white/5"
                                            >
                                                Prev
                                            </button>
                                            <button
                                                onClick={() => setSelectedEpisode(prev => Math.min(episodeCount, prev + 1))}
                                                disabled={selectedEpisode === episodeCount}
                                                className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-[#0a0d14] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white text-sm font-medium transition-all shadow-lg hover:shadow-blue-500/20 disabled:shadow-none"
                                            >
                                                Next
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* For Movies, just show details (centered max width) */}
            {actualType === 'movie' && (
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
                            <div className="mt-8 flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-200/80 text-sm">
                                <Info size={20} className="shrink-0 mt-0.5 text-blue-500" />
                                <div className="space-y-2">
                                    <p>
                                        <strong className="block text-blue-500 mb-1">Continue Watching</strong>
                                        Your watch progress is automatically saved and synced across sessions.
                                        {actualType === 'tv' && ' For TV shows, we will remember your last watched episode.'}
                                    </p>
                                    <p>
                                        If the video is not found or fails to load, please try switching servers using the server menu in the top right corner of the player.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Player

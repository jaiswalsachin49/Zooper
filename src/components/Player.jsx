import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, Server, Maximize, Minimize, Heart, Calendar, Star, Info, ChevronDown } from 'lucide-react'
import useFavorites from '../hooks/useFavorites'
import api from '../services/api'

const PLAYER_SERVERS = [
    { name: 'Player 1', url: import.meta.env.VITE_PLAYER1, isPrimary: true },
    { name: 'Player 2', url: import.meta.env.VITE_PLAYER2, isPrimary: true },
    { name: 'Player 3', url: import.meta.env.VITE_PLAYER3 },
    { name: 'Player 4', url: import.meta.env.VITE_PLAYER4 },
    { name: 'Player 5', url: import.meta.env.VITE_PLAYER5, isPrimary: true },
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
    const [hasError, setHasError] = useState(false)
    const playerContainerRef = useRef(null)
    const { isFavorite, toggleFavorite } = useFavorites()

    // State for movie/TV details
    const [details, setDetails] = useState(location.state?.movieData || null)
    const [cast, setCast] = useState([])
    const [castLoading, setCastLoading] = useState(false)
    const [castError, setCastError] = useState(false)

    // TV Show specific states
    const [selectedSeason, setSelectedSeason] = useState(1)
    const [selectedEpisode, setSelectedEpisode] = useState(1)
    const [seasons, setSeasons] = useState([])
    const [episodeDetails, setEpisodeDetails] = useState([])

    const actualType = (!type || type === "undefined") ? "movie" : type;

    // Fetch details including seasons for TV shows and cast
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

                    // Fetch cast
                    setCastLoading(true);
                    setCastError(false);
                    try {
                        const creditsResponse = await api.get(`/${actualType}/${playerId}/credits`);
                        setCast(creditsResponse.data.cast?.slice(0, 20) || []);
                    } catch (creditsError) {
                        console.error("Failed to fetch cast", creditsError);
                        setCastError(true);
                    } finally {
                        setCastLoading(false);
                    }
                } catch (error) {
                    console.error("Failed to fetch details", error);
                }
            };
            fetchDetails();
        }
    }, [playerId, actualType]);

    // Fetch episode details for TV shows
    useEffect(() => {
        if (actualType === 'tv' && playerId && selectedSeason) {
            const fetchEpisodeDetails = async () => {
                try {
                    const response = await api.get(`/tv/${playerId}/season/${selectedSeason}`);
                    setEpisodeDetails(response.data.episodes || []);
                } catch (error) {
                    console.error("Failed to fetch episode details", error);
                    setEpisodeDetails([]);
                }
            };
            fetchEpisodeDetails();
        }
    }, [playerId, selectedSeason, actualType]);

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

    // Player postMessage event listener for continue watching (VidFast & VidLink)
    useEffect(() => {
        const handlePlayerMessage = (event) => {
            // Validate origin for security - support both VidFast and VidLink
            const validOrigins = [
                'https://vidfast.pro',
                'https://vidfast.in',
                'https://vidfast.io',
                'https://vidfast.me',
                'https://vidfast.net',
                'https://vidfast.pm',
                'https://vidfast.xyz',
                'https://vidlink.pro',
                'https://vidrock.net' // Legacy support
            ];

            if (!validOrigins.includes(event.origin)) return;

            // Dismiss loading state when we receive a valid message from the player
            setIsLoading(false);

            // Handle PLAYER_EVENT for real-time progress tracking
            if (event.data?.type === 'PLAYER_EVENT') {
                const { event: eventType, currentTime, duration, season, episode } = event.data.data;

                if (process.env.NODE_ENV === 'development') {
                    console.log(`Player ${eventType}:`, { currentTime, duration, season, episode });
                }

                // Save progress on important events
                if (['timeupdate', 'pause', 'seeked'].includes(eventType)) {
                    // Throttle timeupdate saves to every 10 seconds
                    if (eventType === 'timeupdate') {
                        const lastSave = window._lastProgressSave || 0;
                        if (Date.now() - lastSave < 10000) return; // Skip if saved less than 10s ago
                    }

                    const progressData = {
                        id: Number(playerId),
                        media_type: actualType,
                        title: details?.title || details?.name,
                        poster_path: details?.poster_path,
                        backdrop_path: details?.backdrop_path,
                        progress: {
                            watched: currentTime,
                            duration: duration
                        },
                        last_updated: Date.now()
                    };

                    // Add season/episode for TV shows
                    if (actualType === 'tv') {
                        progressData.last_season_watched = selectedSeason;
                        progressData.last_episode_watched = selectedEpisode;
                        progressData.show_progress = {
                            [`s${selectedSeason}e${selectedEpisode}`]: {
                                season: selectedSeason,
                                episode: selectedEpisode,
                                progress: {
                                    watched: currentTime,
                                    duration: duration
                                },
                                last_updated: Date.now()
                            }
                        };
                    }

                    // Get and update existing progress
                    try {
                        let allProgress = [];
                        const stored = localStorage.getItem('playerProgress');
                        if (stored) {
                            allProgress = JSON.parse(stored);
                            if (!Array.isArray(allProgress)) allProgress = [allProgress];
                        }

                        // Find and update existing entry
                        const existingIndex = allProgress.findIndex(
                            item => item.id === Number(playerId) && item.media_type === actualType
                        );

                        if (existingIndex >= 0) {
                            // Merge with existing, preserving episode progress for TV shows
                            if (actualType === 'tv' && allProgress[existingIndex].show_progress) {
                                progressData.show_progress = {
                                    ...allProgress[existingIndex].show_progress,
                                    ...progressData.show_progress
                                };
                            }
                            allProgress[existingIndex] = { ...allProgress[existingIndex], ...progressData };
                        } else {
                            allProgress.unshift(progressData);
                        }

                        // Keep max 20 items
                        if (allProgress.length > 20) allProgress = allProgress.slice(0, 20);

                        localStorage.setItem('playerProgress', JSON.stringify(allProgress));
                        window._lastProgressSave = Date.now();

                        if (process.env.NODE_ENV === 'development') {
                            console.log(`Progress saved (${eventType}):`, progressData);
                        }
                    } catch (e) {
                        console.error('Error saving progress:', e);
                    }
                }

                // Handle video ended
                if (eventType === 'ended') {
                    if (process.env.NODE_ENV === 'development') {
                        console.log('Video playback ended');
                    }
                    // Could trigger auto-play next episode here
                }
            }

            // Store continue watching data from MEDIA_DATA event
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
                    // Explicitly save the current season and episode from our state
                    season: selectedSeason,
                    episode: selectedEpisode,
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
                    console.log('Progress saved (MEDIA_DATA):', mediaData);
                }
            }
        };

        window.addEventListener('message', handlePlayerMessage);
        return () => window.removeEventListener('message', handlePlayerMessage);
    }, [playerId, actualType, details, selectedSeason, selectedEpisode]);

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
        setHasError(false)

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
        <div className="min-h-screen bg-[#0f1014] text-white flex flex-col overflow-x-hidden">
            {/* Top Navigation / Controls */}
            <div className="px-6 py-4 flex items-center gap-4 z-10">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all backdrop-blur-md"
                    aria-label="Go back"
                >
                    <ArrowLeft size={24} />
                </button>
                <div className="flex-1 w-[50%]" />
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
                        {/* <button
                            onClick={toggleFullscreen}
                            className="p-2 bg-black/60 hover:bg-black/80 rounded-md text-white transition-all backdrop-blur-md border border-white/20"
                        >
                            {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
                        </button> */}
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
                        {hasError ? (
                            <div className="absolute inset-0 flex flex-col justify-center items-center bg-black/90 z-20 space-y-4">
                                <div className="text-red-500 mb-2">
                                    <Info size={48} />
                                </div>
                                <h3 className="text-xl font-bold text-white">Playback Error</h3>
                                <p className="text-gray-400 text-center max-w-md px-4">
                                    We encountered an error loading the video. This might be due to server issues or network restrictions.
                                </p>
                                <button
                                    onClick={() => handleServerChange((currentServer + 1) % PLAYER_SERVERS.length)}
                                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                                >
                                    Try Next Server
                                </button>
                            </div>
                        ) : (
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
                                onError={() => {
                                    setIsLoading(false);
                                    setHasError(true);
                                }}
                                referrerPolicy="no-referrer"
                            />
                        )}
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

                                        {/* Genres */}
                                        {details.genres && details.genres.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mb-6">
                                                {details.genres.map((genre) => (
                                                    <span key={genre.id} className="px-3 py-1 bg-white/10 rounded-full text-xs text-gray-300">
                                                        {genre.name}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        <div className="bg-[#16181f] p-6 rounded-xl border border-white/5">
                                            <h3 className="text-lg font-semibold text-white mb-2">Overview</h3>
                                            <p className="text-gray-400 leading-relaxed font-light">
                                                {details.overview || "No overview available."}
                                            </p>

                                            {/* Additional Details */}
                                            <div className="mt-4 grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                                                {details.runtime && (
                                                    <div>
                                                        <span className="block text-gray-500 text-sm">Runtime</span>
                                                        <span className="text-white">{details.runtime} min</span>
                                                    </div>
                                                )}
                                                {details.episode_run_time && details.episode_run_time.length > 0 && (
                                                    <div>
                                                        <span className="block text-gray-500 text-sm">Episode Runtime</span>
                                                        <span className="text-white">{details.episode_run_time[0]} min</span>
                                                    </div>
                                                )}
                                                {details.status && (
                                                    <div>
                                                        <span className="block text-gray-500 text-sm">Status</span>
                                                        <span className="text-white">{details.status}</span>
                                                    </div>
                                                )}
                                                {details.number_of_seasons && (
                                                    <div>
                                                        <span className="block text-gray-500 text-sm">Seasons</span>
                                                        <span className="text-white">{details.number_of_seasons}</span>
                                                    </div>
                                                )}
                                                {details.production_countries && details.production_countries.length > 0 && (
                                                    <div>
                                                        <span className="block text-gray-500 text-sm">Country</span>
                                                        <span className="text-white">{details.production_countries.map(c => c.name).join(', ')}</span>
                                                    </div>
                                                )}
                                                {details.spoken_languages && details.spoken_languages.length > 0 && (
                                                    <div>
                                                        <span className="block text-gray-500 text-sm">Languages</span>
                                                        <span className="text-white">{details.spoken_languages.map(l => l.english_name).join(', ')}</span>
                                                    </div>
                                                )}
                                                {details.production_companies && details.production_companies.length > 0 && (
                                                    <div className="col-span-2">
                                                        <span className="block text-gray-500 text-sm mb-1">Production</span>
                                                        <span className="text-white text-sm">{details.production_companies.slice(0, 3).map(c => c.name).join(' • ')}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div >
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
                                        {/Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor) && (
                                            <p className="mt-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded text-yellow-200">
                                                <strong className="block text-yellow-500 mb-1">Chrome Users</strong>
                                                If Player 1 or Player 2 doesn't work, please switch to <strong>Player 3</strong> or <strong>Player 4</strong> using the server menu above for better compatibility.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div >
                        </div >

                        {/* Season/Episode Selector (Right side) */}
                        < div className="w-full lg:w-[400px] shrink-0" >
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

                                        {/* Episode List */}
                                        <div>
                                            <label className="block text-xs font-semibold uppercase text-gray-500 mb-3 tracking-wider">Episodes</label>
                                            <div className="space-y-1 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                                                {episodeDetails.length > 0 ? (
                                                    episodeDetails.map((episode) => {
                                                        const isSelected = selectedEpisode === episode.episode_number;
                                                        return (
                                                            <button
                                                                key={episode.episode_number}
                                                                onClick={() => setSelectedEpisode(episode.episode_number)}
                                                                className={`
                                                                    w-full text-left px-4 py-3 rounded-lg
                                                                    transition-all
                                                                    ${isSelected
                                                                        ? 'bg-blue-600 text-white'
                                                                        : 'text-gray-400 hover:text-white hover:bg-white/5'}
                                                                `}
                                                            >
                                                                <div className="flex items-center gap-3">
                                                                    <span className="text-sm font-semibold min-w-[80px]">
                                                                        Episode #{episode.episode_number}
                                                                    </span>
                                                                    <span className="text-sm truncate">
                                                                        {episode.name || 'Episode ' + episode.episode_number}
                                                                    </span>
                                                                </div>
                                                            </button>
                                                        );
                                                    })
                                                ) : (
                                                    // Fallback to number grid if episode details not loaded
                                                    Array.from({ length: episodeCount }, (_, i) => {
                                                        const epNum = i + 1;
                                                        const isSelected = selectedEpisode === epNum;
                                                        return (
                                                            <button
                                                                key={epNum}
                                                                onClick={() => setSelectedEpisode(epNum)}
                                                                className={`
                                                                    w-full text-left px-4 py-3 rounded-lg
                                                                    transition-all
                                                                    ${isSelected
                                                                        ? 'bg-blue-600 text-white'
                                                                        : 'text-gray-400 hover:text-white hover:bg-white/5'}
                                                                `}
                                                            >
                                                                <span className="text-sm font-semibold">
                                                                    Episode #{epNum}
                                                                </span>
                                                            </button>
                                                        );
                                                    })
                                                )}
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
                        </div >
                    </div >

                    {/* Cast List - Full width below both columns to avoid interfering with episode selector */}
                    {
                        castLoading ? (
                            <div className="mt-6 bg-[#16181f] p-6 rounded-xl border border-white/5">
                                <h3 className="text-lg font-semibold text-white mb-4">Cast</h3>
                                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <div key={i} className="flex-shrink-0 w-32">
                                            <div className="aspect-[2/3] bg-white/5 rounded-lg animate-pulse mb-2"></div>
                                            <div className="h-4 bg-white/5 rounded animate-pulse mb-1"></div>
                                            <div className="h-3 bg-white/5 rounded animate-pulse w-3/4"></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : castError ? (
                            <div className="mt-6 bg-[#16181f] p-6 rounded-xl border border-white/5">
                                <h3 className="text-lg font-semibold text-white mb-2">Cast</h3>
                                <p className="text-gray-500 text-sm">Unable to load cast information at this time.</p>
                            </div>
                        ) : cast.length > 0 ? (
                            <div className="mt-6 bg-[#16181f] p-6 rounded-xl border border-white/5">
                                <h3 className="text-lg font-semibold text-white mb-4">Cast</h3>
                                <div className="flex overflow-x-auto gap-4 pb-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                                    {cast.map((actor) => (
                                        <div key={actor.id} className="flex-shrink-0 w-32 group cursor-pointer">
                                            <div className="aspect-[2/3] rounded-lg overflow-hidden bg-white/5 mb-2">
                                                {actor.profile_path ? (
                                                    <img
                                                        src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                                                        alt={actor.name}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                            const fallback = document.createElement('div');
                                                            fallback.className = 'w-full h-full flex items-center justify-center text-gray-600';
                                                            fallback.innerHTML = '<svg class="w-12 h-12" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" /></svg>';
                                                            e.target.parentElement.appendChild(fallback);
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
                                            <p className="text-sm font-medium text-white truncate">{actor.name}</p>
                                            <p className="text-xs text-gray-500 truncate">{actor.character}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : null
                    }
                </div >
            )}

            {/* For Movies, just show details (centered max width) */}
            {
                actualType === 'movie' && (
                    <div className="max-w-7xl mx-auto w-full px-6 py-8">
                        <div className="flex flex-col md:flex-row gap-8 items-start">
                            {/* Content Details */}
                            <div className="flex-1 w-full">
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

                                        {/* Genres */}
                                        {details.genres && details.genres.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mb-6">
                                                {details.genres.map((genre) => (
                                                    <span key={genre.id} className="px-3 py-1 bg-white/10 rounded-full text-xs text-gray-300">
                                                        {genre.name}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        <div className="bg-[#16181f] p-6 rounded-xl border border-white/5">
                                            <h3 className="text-lg font-semibold text-white mb-2">Overview</h3>
                                            <p className="text-gray-400 leading-relaxed font-light">
                                                {details.overview || "No overview available."}
                                            </p>

                                            {/* Additional Details */}
                                            <div className="mt-4 grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                                                {details.runtime && (
                                                    <div>
                                                        <span className="block text-gray-500 text-sm">Runtime</span>
                                                        <span className="text-white">{details.runtime} min</span>
                                                    </div>
                                                )}
                                                {details.status && (
                                                    <div>
                                                        <span className="block text-gray-500 text-sm">Status</span>
                                                        <span className="text-white">{details.status}</span>
                                                    </div>
                                                )}
                                                {details.budget && details.budget > 0 && (
                                                    <div>
                                                        <span className="block text-gray-500 text-sm">Budget</span>
                                                        <span className="text-white">${(details.budget / 1000000).toFixed(1)}M</span>
                                                    </div>
                                                )}
                                                {details.revenue && details.revenue > 0 && (
                                                    <div>
                                                        <span className="block text-gray-500 text-sm">Revenue</span>
                                                        <span className="text-white">${(details.revenue / 1000000).toFixed(1)}M</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Cast List for Movies */}
                                        {castLoading ? (
                                            <div className="mt-6 bg-[#16181f] p-6 rounded-xl border border-white/5">
                                                <h3 className="text-lg font-semibold text-white mb-4">Cast</h3>
                                                <div className="flex gap-4 overflow-x-hidden">
                                                    {[1, 2, 3, 4, 5].map((i) => (
                                                        <div key={i} className="flex-shrink-0 w-32">
                                                            <div className="aspect-[2/3] bg-white/5 rounded-lg animate-pulse mb-2"></div>
                                                            <div className="h-4 bg-white/5 rounded animate-pulse mb-1"></div>
                                                            <div className="h-3 bg-white/5 rounded animate-pulse w-3/4"></div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : castError ? (
                                            <div className="mt-6 bg-[#16181f] p-6 rounded-xl border border-white/5">
                                                <h3 className="text-lg font-semibold text-white mb-2">Cast</h3>
                                                <p className="text-gray-500 text-sm">Unable to load cast information at this time.</p>
                                            </div>
                                        ) : cast.length > 0 ? (
                                            <div className="mt-6 bg-[#16181f] p-6 rounded-xl border border-white/5">
                                                <h3 className="text-lg font-semibold text-white mb-4">Cast</h3>
                                                <div className="flex overflow-x-auto gap-4 pb-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                                                    {cast.map((actor) => (
                                                        <div key={actor.id} className="flex-shrink-0 w-32 group cursor-pointer">
                                                            <div className="aspect-[2/3] rounded-lg overflow-hidden bg-white/5 mb-2">
                                                                {actor.profile_path ? (
                                                                    <img
                                                                        src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                                                                        alt={actor.name}
                                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                                        onError={(e) => {
                                                                            e.target.style.display = 'none';
                                                                            const fallback = document.createElement('div');
                                                                            fallback.className = 'w-full h-full flex items-center justify-center text-gray-600';
                                                                            fallback.innerHTML = '<svg class="w-12 h-12" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" /></svg>';
                                                                            e.target.parentElement.appendChild(fallback);
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
                                                            <p className="text-sm font-medium text-white truncate">{actor.name}</p>
                                                            <p className="text-xs text-gray-500 truncate">{actor.character}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : null}
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
                )
            }
        </div >
    )
}

export default Player

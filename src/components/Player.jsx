import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, Server, Maximize, Minimize } from 'lucide-react'

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

    const actualType = (!type || type === "undefined") ? "movie" : type;
    const movieData = location.state?.movieData;

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

    // specific message listener for vidsrc
    useEffect(() => {
        const handleMessage = (event) => {
            // Verify origin if possible, or check structure strictly
            if (!event.data) return;

            // Check if it's a time update event from vidsrc (usually just an object with time)
            // or sometimes nested. We need to log to be sure, but standard vidsrc often sends { type: 'time', time: 123 } or similar.
            // Based on search results, we look for PLAYER_EVENT or similar structure, 
            // but lacking exact docs, we'll try to find a 'time' property in the data.

            // Simple heuristic: if data has 'time' and it's a number
            const currentTime = event.data?.time || event.data?.data?.time;

            if (typeof currentTime === 'number' && currentTime > 5 && movieData) {
                const newItem = {
                    id: playerId,
                    title: movieData.title || movieData.name,
                    poster_path: movieData.poster_path,
                    backdrop_path: movieData.backdrop_path,
                    media_type: actualType,
                    timestamp: currentTime,
                    last_watched: Date.now()
                };

                const existingDataStr = localStorage.getItem('zooper_continue_watching');
                let existingData = [];
                if (existingDataStr) {
                    try {
                        existingData = JSON.parse(existingDataStr);
                    } catch (e) { }
                }

                // Remove existing entry for this video
                existingData = existingData.filter(item => item.id.toString() !== playerId.toString());
                // Add new entry to top
                existingData.unshift(newItem);
                // Keep only last 20
                existingData = existingData.slice(0, 20);

                localStorage.setItem('zooper_continue_watching', JSON.stringify(existingData));
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [playerId, movieData, actualType]);

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
            <div className="w-full h-screen flex justify-center items-center bg-black">
                <div className="text-center text-xl">Invalid video link.</div>
            </div>
        )
    }

    return (
        <div ref={playerContainerRef} className='w-full h-screen flex justify-center items-center bg-black fixed top-0 left-0 z-[100]'>
            {/* Top Controls Container */}
            <div className="absolute top-6 right-6 z-[105] flex items-center gap-3">
                {/* Server Selection */}
                <div className="relative">
                    <button
                        onClick={() => setShowServerMenu(!showServerMenu)}
                        className="p-3 bg-black/60 hover:bg-black/80 rounded-full text-white transition-all backdrop-blur-md border border-white/20 shadow-2xl flex items-center gap-2"
                        aria-label="Change server"
                        title="Change server"
                    >
                        <Server size={24} />
                    </button>

                    {/* Server Menu */}
                    {showServerMenu && (
                        <div className="absolute top-full right-0 mt-2 bg-black/90 backdrop-blur-xl rounded-xl border border-white/20 overflow-hidden shadow-2xl min-w-[150px] z-[110]">
                            {VIDSRC_SERVERS.map((server, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleServerChange(index)}
                                    className={`w-full px-4 py-3 text-left transition-colors ${currentServer === index
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-300 hover:bg-white/10'
                                        }`}
                                >
                                    {server.name}
                                    {currentServer === index && (
                                        <span className="ml-2 text-xs">✓</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="p-3 bg-black/60 hover:bg-black/80 rounded-full text-white transition-all backdrop-blur-md border border-white/20 shadow-2xl"
                    aria-label="Go back"
                    title="Go back"
                >
                    <ArrowLeft size={24} />
                </button>
            </div>

            {/* Fullscreen Toggle Button */}
            <button
                onClick={toggleFullscreen}
                className="absolute bottom-2 right-6 z-[105] p-3 bg-black/60 hover:bg-black/80 rounded-full text-white outline-none transition-all backdrop-blur-md shadow-2xl"
                aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
                {isFullscreen ? <Minimize size={24} /> : <Maximize size={24} />}
            </button>

            {/* Loading Indicator */}
            {isLoading && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[102]">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}

            {/* Video Player */}
            <div className="w-full h-full relative">
                <iframe
                    key={`${currentServer}-${initialStartTime}`} // Force reload start time change
                    className='w-full h-full'
                    title="Video Player"
                    allow='autoplay; encrypted-media; gyroscope; picture-in-picture'
                    allowFullScreen
                    sandbox='allow-forms allow-same-origin allow-scripts'
                    src={getVideoURL()}
                    onLoad={() => setIsLoading(false)}
                    onError={() => setIsLoading(false)}
                    referrerPolicy="origin"
                />
            </div>
        </div>
    )
}

export default Player

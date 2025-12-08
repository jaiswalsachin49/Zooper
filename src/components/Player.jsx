import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Server, Maximize, Minimize } from 'lucide-react'

const VIDSRC_SERVERS = [
    { name: 'Player 1', url: import.meta.env.VITE_PLAYER1 },
    { name: 'Player 2', url: import.meta.env.VITE_PLAYER2 },
    { name: 'Player 3', url: import.meta.env.VITE_PLAYER3 },
]

const Player = () => {
    const { type, playerId } = useParams()
    const navigate = useNavigate()
    const [currentServer, setCurrentServer] = useState(0)
    const [showServerMenu, setShowServerMenu] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const playerContainerRef = useRef(null)

    const actualType = (!type || type === "undefined") ? "movie" : type;
    
    // Build video URL based on selected server
    const getVideoURL = () => {
        const server = VIDSRC_SERVERS[currentServer]
        return `${server.url}/${actualType}/${playerId}`
    }

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

    const handleStartOver = () => {
        setStartTime(0);
        setShowResumePrompt(false);
    };

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
            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="absolute top-6 right-6 z-[105] p-3 bg-black/60 hover:bg-black/80 rounded-full text-white transition-all backdrop-blur-md border border-white/20 shadow-2xl"
                aria-label="Go back"
                title="Go back"
            >
                <ArrowLeft size={24} />
            </button>

            {/* Fullscreen Toggle Button */}
            <button
                onClick={toggleFullscreen}
                className="absolute bottom-2 right-6 z-[105] p-3 bg-black/60 hover:bg-black/80 rounded-full text-white outline-none transition-all backdrop-blur-md shadow-2xl"
                aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
                {isFullscreen ? <Minimize size={24} /> : <Maximize size={24} />}
            </button>

            {/* Server Selection Button */}
            <div className="absolute top-6 right-20 z-[105]">
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
                    <div className="absolute top-6 right-12 mb-3 bg-black/90 backdrop-blur-xl rounded-xl border border-white/20 overflow-hidden shadow-2xl min-w-[180px]">
                        {VIDSRC_SERVERS.map((server, index) => (
                            <button
                                key={index}
                                onClick={() => handleServerChange(index)}
                                className={`w-full px-4 py-3 text-left transition-colors ${
                                    currentServer === index 
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

            {/* Resume Prompt */}
            {/* {showResumePrompt && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[110] bg-black/90 backdrop-blur-xl p-8 rounded-2xl border border-white/20 text-center shadow-2xl">
                    <h3 className="text-2xl font-bold mb-4">Resume Playback?</h3>
                    <p className="text-gray-300 mb-6">
                        Continue from {Math.floor(resumeTime / 60)}:{String(Math.floor(resumeTime % 60)).padStart(2, '0')}
                    </p>
                    <div className="flex gap-4">
                        <button
                            onClick={handleStartOver}
                            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-colors"
                        >
                            Start Over
                        </button>
                        <button
                            onClick={handleResume}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold transition-colors"
                        >
                            Resume
                        </button>
                    </div>
                </div>
            )} */}

            {/* Loading Indicator */}
            {isLoading && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[102]">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}

            {/* Video Player */}
            <div className="w-full h-full relative">
                <iframe
                    key={currentServer} // Force reload when server changes
                    className='w-full h-full'
                    title="Video Player"
                    allow='autoplay; encrypted-media; gyroscope; picture-in-picture'
                    allowFullScreen
                    src={getVideoURL()}
                    onLoad={() => setIsLoading(false)}
                    onError={() => setIsLoading(false)}
                />
            </div>
        </div>
    )
}

export default Player

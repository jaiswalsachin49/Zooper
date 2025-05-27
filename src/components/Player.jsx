import React from 'react'
import { useParams } from 'react-router-dom'

const Player = () => {
    const { playerId } = useParams()
    const VideoURL = `https://vidsrc.xyz/embed/movie/${playerId}`
    return (
        <div>
            <iframe
            className='w-full h-screen'
            allow='autplay; encrypted-media; gyroscope; picture-in-picture'
            allowFullScreen
            src={VideoURL}
            >
            </iframe>
        </div>
    )
}

export default Player
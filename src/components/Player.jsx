import React from 'react'
import { useParams } from 'react-router-dom'

const Player = () => {
    const { type, playerId } = useParams()

    const actualType = (!type || type === "undefined") ? "movie" : type;
    const embedURL = `https://vidsrc.xyz/embed/${actualType}/${playerId}`

    if (!playerId) {
        return <div className="text-center text-xl">Invalid video link.</div>
    }

    return (
        <div className='w-full h-screen flex justify-center items-center bg-black fixed top-0 left-0 z-50'>
            <iframe
                className='w-full h-screen'
                title="Video Player"
                allow='autoplay; encrypted-media; gyroscope; picture-in-picture'
                allowFullScreen
                src={embedURL}>
            </iframe>
        </div>
    )
}

export default Player

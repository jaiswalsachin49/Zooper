import React from 'react'
import { useParams } from 'react-router-dom'

const Player = () => {
    const { type, playerId } = useParams()
    const embedURL = `https://vidsrc.xyz/embed/${type}/${playerId}`

    return (
        <div>
            <iframe
                className='w-full h-screen'
                allow='autoplay; encrypted-media; gyroscope; picture-in-picture'
                allowFullScreen
                src={embedURL}
            >
            </iframe>
        </div>
    )
}

export default Player

import React from 'react';
import useTrendingData from '../../hooks/TrendingData';
import MovieCard from '../Card';

export default function TrendingMovie() {
    const { trendingData, loading, error } = useTrendingData("movie");
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
    return(
        <div className="text-black px-6 mb-20">
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 ml-15 mr-15">
            {trendingData && trendingData.map((movie) => (
            movie.poster_path && 
            <MovieCard
            key={movie.id}
            image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            title={movie.title || movie.name}
            description={movie.overview}
            id={movie.id}
            />
        ))}
        </div>
    </div>
    )
}

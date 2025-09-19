import React from "react";
import useTrendingData from "../../hooks/TrendingData";
import MovieCard from "../Card";

export default function TrendingTv() {
    const { trendingData, loading, error } = useTrendingData("tv");

    if (loading) return <p className='text-center text-1xl font-bold not-italic'>Loading...</p>;
    if (error) return <p className='text-center text-1xl font-bold not-italic mb-2'>Error: {error.message}</p>;

    return (
        <div className="text-black px-6 mb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 px-4">
            {trendingData &&
            trendingData.map(
                (movie) =>
                movie.poster_path && (
                    <MovieCard
                    key={movie.id}
                    image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    backdrop_path={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                    media_type={movie.media_type}
                    title={movie.title || movie.name}
                    description={movie.overview}
                    id={movie.id}
                    />
                )
            )}
        </div>
        </div>
    );
    }

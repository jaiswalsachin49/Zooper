import React from "react";
import TVData from "../hooks/TVData";
import MovieCard from "./Card";
import HeroBanner from "./HeroBanner";
import CardSkeleton from "./CardSkeleton";

export default function TVShows() {
  const { data, loading, error } = TVData();
  if (loading) {
    return (
      <div className="text-black px-6 mb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 px-4 mt-32">
          {[...Array(10)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }
  if (error) return <div className="flex items-center justify-center h-screen w-full bg-black"> <p className='text-center text-1xl font-bold not-italic mb-2'>Error: {error.message}</p></div>;

  return (
    <div className="text-black px-6 mb-20 min-h-full">
      {data.length > 0 && <HeroBanner movies={data} type="tv" />}
      <h1 className="text-3xl font-bold mb-15 mt-15 ml-15 text-white">Popular TV-Shows</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 px-4">
        {data.map((movie) => (
          movie.poster_path &&
          <MovieCard
            key={movie.id}
            media_type="tv"
            image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            backdrop_path={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            title={movie.title ? movie.title : movie.name}
            description={movie.overview}
            id={movie.id}
            vote_average={movie.vote_average}
            first_air_date={movie.first_air_date}
            original_language={movie.original_language}
            popularity={movie.popularity}
            vote_count={movie.vote_count}
          />
        ))}
      </div>
    </div>
  );
}

import React from "react";
import TVData from "../hooks/TVData";
import MovieCard from "./Card";
import HeroBanner from "./HeroBanner";

export default function TVShows() {
  const data = TVData();  

  return (
    <div className="text-black px-6 mb-20">
      {data.length > 0 && <HeroBanner movies={data} type="tv" />}
      <h1 className="text-3xl font-bold mb-15 mt-15 ml-15 text-white">Popular TV-Shows</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 px-4">
        {data.map((movie) => (
          movie.poster_path &&
          <MovieCard
            key={movie.id}
            media_type="tv"
            image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            title={movie.title? movie.title:movie.name}
            description={movie.overview}
            id={movie.id}
          />
        ))}
      </div>
    </div>
  );
}

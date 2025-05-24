import React from "react";
import MovieData from "../hooks/MovieData";
import MovieCard from "./Card";
import HeroBanner from "./HeroBanner";

export default function Films() {
  const data = MovieData();  

  return (
    <div className="text-black px-6 mb-20">
        {data.length > 0 && <HeroBanner movies={data} />}
      <h1 className="text-3xl font-bold mb-15 mt-15 ml-15 text-white">Popular Films</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 ml-15 mr-15">
        {data.map((movie) => (
          <MovieCard
            key={movie.id}
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

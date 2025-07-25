import React, { useContext } from "react";
import MovieData from "../hooks/MovieData";
import MovieCard from "./Card";
import HeroBanner from "./HeroBanner";
import { GenresContext } from "../context/genres.context";

export default function Films() {
  const { genre } = useContext(GenresContext);
  const data = MovieData(genre);

  const genres = [
    { id: 28, name: "Action" },
    { id: 12, name: "Adventure" },
    { id: 16, name: "Animation" },
    { id: 35, name: "Comedy" },
    { id: 80, name: "Crime" },
    { id: 99, name: "Documentary" },
    { id: 18, name: "Drama" },
    { id: 10751, name: "Family" },
    { id: 14, name: "Fantasy" },
    { id: 36, name: "History" },
    { id: 27, name: "Horror" },
    { id: 10402, name: "Music" },
    { id: 9648, name: "Mystery" },
    { id: 10749, name: "Romance" },
    { id: 878, name: "Science Fiction" },
    { id: 53, name: "Thriller" },
    { id: 10752, name: "War" },
    { id: 37, name: "Western" },
  ];

  return (
    <div className="text-black px-6 mb-20">
      {data.length > 0 && <HeroBanner movies={data} type="movie" />}
      <h1 className="text-3xl font-bold mb-10 mt-10 text-white">
        {genre ? `${genres.find((g) => g.id === genre)?.name} Films` : "Films"}
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 px-4">
        {data.map((movie) => (
          <MovieCard
            key={movie.id}
            image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            media_type="movie"
            title={movie.title || movie.name}
            description={movie.overview}
            id={movie.id}
          />
        ))}
      </div>
    </div>
  );
}

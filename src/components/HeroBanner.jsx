import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const HeroBanner = ({ movies }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-switch slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === movies.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [movies]);

  if (!movies.length) return null;

  const movie = movies[currentIndex];

  return (
    <div className="relative w-full h-[80vh] overflow-hidden rounded-xl mt-15 mb-10">
      <img
        src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
        alt={movie.title? movie.title : movie.name}
        className="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 "></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-end h-full pb-20 max-w-6xl mx-auto text-white">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">{movie.title? movie.title:movie.name}</h1>

        <div className="flex items-center text-sm opacity-80 space-x-4 mb-4">
          <span>{movie.release_date?.slice(0, 4)}</span>
          <span>{movie.release_date && "|"}</span>
          <span>{Math.floor(Math.random() * (160 - 90 + 1)) + 90} min</span>
          <span>|</span>
          <span>{Math.floor(Math.random() * 2) + 1} Languages</span>
        </div>

        <p className="text-gray-300 max-w-xl line-clamp-3 mb-6">
          {movie.overview}
        </p>

        <div className="flex space-x-4">
          <Link
            to={`/movie/${movie.id}`}
            className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
          >
            Watch Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;

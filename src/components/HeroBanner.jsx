import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronLeft, FaChevronRight, FaPlay, FaInfoCircle, FaPlus, FaCheck } from "react-icons/fa";
import useFavorites from "../hooks/useFavorites";

const HeroBanner = ({ movies = [], type, onMoreInfoClick }) => {
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useFavorites();

  const filteredMovies = movies.filter(
    (movie) => movie.backdrop_path && movie.overview
  ); 

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (filteredMovies.length === 0) return;
    const interval = setInterval(handleNext, 8000); // 8 seconds per slide
    return () => clearInterval(interval);
  }, [currentIndex, filteredMovies.length]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === filteredMovies.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? filteredMovies.length - 1 : prev - 1));
  };

  if (filteredMovies.length === 0) return null;

  return (
    <div className="relative w-full h-[85vh] overflow-hidden group">
      {/* Slider Track */}
      <div
        className="flex transition-transform duration-700 ease-in-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {filteredMovies.map((movie) => {
          const isFav = isFavorite(movie.id, movie.media_type || "movie");
          return (
            <div key={movie.id} className="min-w-full relative h-full">
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                  alt={movie.title || movie.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f1014] via-transparent to-transparent" />
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 pb-24 md:pb-32 z-10">
                <div className="max-w-3xl space-y-6">
                  <h1 className="text-4xl md:text-7xl font-bold text-white drop-shadow-lg leading-tight">
                    {movie.title || movie.name}
                  </h1>

                  <div className="flex items-center gap-4 text-gray-300 text-sm md:text-base font-medium">
                    <span className="text-green-400 font-bold">
                      {Math.round(movie.vote_average * 10)}% Match
                    </span>
                    <span>{(movie.release_date || movie.first_air_date)?.slice(0, 4)}</span>
                    <span className="border border-gray-500 px-2 rounded text-xs">HD</span>
                  </div>

                  <p className="text-gray-300 text-base md:text-lg line-clamp-3 max-w-2xl drop-shadow-md">
                    {movie.overview}
                  </p>

                  <div className="flex items-center gap-4 pt-4">
                    <button
                      onClick={() => navigate(`/player/${type ? type : movie.media_type || "movie"}/${movie.id}`, { state: { movieData: movie } })}
                      className="flex items-center gap-2 bg-white text-black px-6 md:px-8 py-3 rounded-lg font-bold hover:bg-gray-200 transition active:scale-95"
                    >
                      <FaPlay size={18} /> Play
                    </button>

                    <button
                      onClick={() => onMoreInfoClick && onMoreInfoClick(movie)}
                      className="flex items-center gap-2 bg-gray-500/40 text-white px-6 md:px-8 py-3 rounded-lg font-bold hover:bg-gray-500/60 backdrop-blur-sm transition active:scale-95"
                    >
                      <FaInfoCircle size={20} /> More Info
                    </button>

                    <button
                      onClick={() => toggleFavorite(movie)}
                      className="p-3 rounded-full border-2 border-gray-400 text-gray-300 hover:border-white hover:text-white transition bg-black/20 backdrop-blur-sm"
                      title={isFav ? "Remove from Favorites" : "Add to Favorites"}
                    >
                      {isFav ? <FaCheck /> : <FaPlus />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Buttons (Hidden on mobile, visible on hover) */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/30 md:bg-transparent md:hover:bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hidden md:block"
      >
        <FaChevronLeft size={30} />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/30 md:bg-transparent md:hover:bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hidden md:block"
      >
        <FaChevronRight size={30} />
      </button>

      {/* Dots Indicators */}
      <div className="absolute bottom-10 right-10 flex gap-2 z-20">
        {filteredMovies.map((_, idx) => (
          <div
            key={idx}
            className={`h-1 rounded-full transition-all duration-300 ${idx === currentIndex ? "w-8 bg-white" : "w-4 bg-gray-500/50"
              }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroBanner;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const HeroBanner = ({ movies = [], type }) => {
  const navigate = useNavigate();
  const filteredMovies = movies.filter(
    (movie) => movie.backdrop_path && movie.overview
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [duration, setDuration] = useState(0);
  const [languages, setLanguages] = useState(0);

  useEffect(() => {
    setCurrentIndex(0);
  }, [movies]);

  useEffect(() => {
    if (filteredMovies.length === 0) return;

    const interval = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [filteredMovies, currentIndex]);

  useEffect(() => {
    setDuration(Math.floor(Math.random() * (160 - 90 + 1)) + 90);
    setLanguages(Math.floor(Math.random() * 2) + 1);
  }, [currentIndex]);

  if (filteredMovies.length === 0) return null;

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === filteredMovies.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? filteredMovies.length - 1 : prevIndex - 1
    );
  };

  const movie = filteredMovies[currentIndex];

  return (
    <div className="relative w-full h-[80vh] overflow-hidden rounded-xl mt-30 mb-10">
      <img
        key={movie.id}
        src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
        alt={movie.title || movie.name}
        className="absolute inset-0 w-full h-full object-cover animate-in fade-in zoom-in duration-1000"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-[#0f1014] via-black/40 to-transparent"></div>

      <div className="relative flex flex-col justify-end h-full pb-20 max-w-6xl mx-auto text-white px-6">
        <h1 key={movie.id + "title"} className="text-4xl md:text-7xl font-bold mb-4 animate-in fade-in slide-in-from-right-8 duration-700">
          {movie.title || movie.name}
        </h1>

        <div className="flex items-center text-sm opacity-80 space-x-4 mb-4">
          <span>{movie.release_date?.slice(0, 4)}</span>
          <span>|</span>
          <span>{duration} min</span>
          <span>|</span>
          <span>{languages} Languages</span>
        </div>

        <p key={movie.id + "desc"} className="text-gray-200 max-w-xl line-clamp-3 mb-8 text-lg animate-in fade-in slide-in-from-right-12 duration-1000 delay-100">
          {movie.overview}
        </p>

        <div className="flex space-x-4">
          <button
            onClick={() => navigate(`/player/${type ? type : movie.media_type || "movie"}/${movie.id}`)}
            className="bg-blue-900 text-white px-8 py-3 rounded-xl font-bold hover:scale-105 transition-all duration-300 shadow-lg shadow-blue-500/20 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300"
          >
            Watch Now
          </button>
        </div>
      </div>

      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 hover:bg-black/70 hover:scale-[150%] p-3 rounded-full text-white transition z-10"
      >
        <FaChevronLeft size={20} />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full text-white hover:scale-[150%] hover:bg-black/70 transition z-10"
      >
        <FaChevronRight size={20} />
      </button>
    </div>
  );
};

export default HeroBanner;

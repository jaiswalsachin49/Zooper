import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const HeroBanner = ({ movies = [] }) => {
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
        src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
        alt={movie.title || movie.name}
        className="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out"
      />

      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative flex flex-col justify-end h-full pb-20 max-w-6xl mx-auto text-white">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          {movie.title || movie.name}
        </h1>

        <div className="flex items-center text-sm opacity-80 space-x-4 mb-4">
          <span>{movie.release_date?.slice(0, 4)}</span>
          <span>|</span>
          <span>{duration} min</span>
          <span>|</span>
          <span>{languages} Languages</span>
        </div>

        <p className="text-gray-300 max-w-xl line-clamp-3 mb-6">
          {movie.overview}
        </p>

        <div className="flex space-x-4">
          <button
            onClick={() => navigate(`/player/${movie.media_type}/${movie.id}`)}
            className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
          >
            Watch Now
          </button>
        </div>
      </div>

      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 p-3 rounded-full text-white hover:bg-black/70 transition z-10"
      >
        <FaChevronLeft size={20} />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 p-3 rounded-full text-white hover:bg-black/70 transition z-10"
      >
        <FaChevronRight size={20} />
      </button>
    </div>
  );
};

export default HeroBanner;

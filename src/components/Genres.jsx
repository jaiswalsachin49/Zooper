import React, { useState, useContext } from "react";
import { GenresContext } from "../context/genres.context";
import { useNavigate } from "react-router-dom";
import Row from "./Row";
import useMovieData from "../hooks/MovieData";

const GENRES = [
  { id: 28, name: "Action", color: "from-red-600 to-orange-600", bg: "/genres/action.jpg" },
  { id: 18, name: "Drama", color: "from-purple-600 to-pink-600", bg: "/genres/drama.jpg" },
  { id: 53, name: "Thriller", color: "from-gray-700 to-gray-900", bg: "/genres/thriller.jpg" },
  { id: 35, name: "Comedy", color: "from-yellow-500 to-orange-500", bg: "/genres/comedy.jpg" },
  { id: 878, name: "Sci-Fi", color: "from-blue-500 to-cyan-500", bg: "/genres/scifi.jpg" },
  { id: 80, name: "Crime", color: "from-red-900 to-red-700", bg: "/genres/crime.jpg" },
  { id: 12, name: "Adventure", color: "from-green-500 to-emerald-700", bg: "/genres/adventure.jpg" },
  { id: 16, name: "Animation", color: "from-pink-500 to-purple-500", bg: "/genres/animation.jpg" },
  { id: 27, name: "Horror", color: "from-gray-900 to-black", bg: "/genres/horror.jpg" },
  { id: 9648, name: "Mystery", color: "from-indigo-600 to-blue-800", bg: "/genres/mystery.jpg" },
  { id: 10749, name: "Romance", color: "from-pink-400 to-rose-500", bg: "/genres/romance.jpg" },
  { id: 14, name: "Fantasy", color: "from-violet-600 to-indigo-600", bg: "/genres/fantasy.jpg" },
];


const Genres = () => {
  const { setGenre } = useContext(GenresContext);
  const navigate = useNavigate();

  const [selectedGenre, setSelectedGenre] = useState(GENRES[0]);
  const { data: popularData, loading } = useMovieData(selectedGenre.id);

  const handleGenreClick = (genre) => {
    if (selectedGenre.id === genre.id) return;
    setSelectedGenre(genre);
  };

  const handleNavigateToGenre = () => {
    setGenre(selectedGenre.id);
    navigate("/films");
  };

  return (
    <div className="bg-[#0f1014] min-h-screen pt-24 px-6 md:px-12 pb-20">
      <div className="max-w-[1600px] mx-auto">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Browse by Genre
          </h1>
          <p className="text-gray-400">Discover content by category</p>
        </div>

        {/* Genre Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-16">
          {GENRES.map((g) => (
            <div
              key={g.id}
              onClick={() => handleGenreClick(g)}
              className={`relative h-32 md:h-40 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 transform hover:scale-[1.02] active:scale-95 group ring-2 ${selectedGenre.id === g.id ? "ring-white scale-[1.02]" : "ring-transparent"
                }`}
            >
              {/* Background Image */}
              <img
                src={g.bg}
                alt={g.name}
                className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity duration-300"
              />

              {/* Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${g.color} mix-blend-overlay`} />

              {/* Dark Overlay for readability */}
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />

              {/* Pattern Overlay */}
              <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay" />

              {/* Text */}
              <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-4">
                <h3 className="text-xl md:text-2xl font-bold text-white drop-shadow-lg">
                  {g.name}
                </h3>
              </div>
            </div>

          ))}
        </div>

        {/* Selected Genre Preview */}
        <div
          key={selectedGenre.id} // FIX: correct key placement
          className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500"
        >
          <div className="flex justify-between items-end">
            <h2 className="text-2xl text-white font-semibold">
              Popular in {selectedGenre.name}
            </h2>

            <button
              onClick={handleNavigateToGenre}
              className="text-blue-500 hover:text-white text-sm font-bold flex items-center gap-1 transition-colors"
            >
              View All <span className="text-lg">→</span>
            </button>
          </div>

          {loading ? (
            <div className="h-64 flex items-center justify-center text-gray-500">
              Loading popular titles...
            </div>
          ) : (
            <Row title="" movies={popularData?.slice(0, 10) || []} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Genres;

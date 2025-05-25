import React, { useContext } from "react";
import { GenresContext } from "../context/genres.context";
import { useNavigate } from "react-router-dom";

const GenreDropdown = () => {
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

  const { genre, setGenre } = useContext(GenresContext);
  const navigate = useNavigate();

  const handleGenreSelect = (genreId) => {
    setGenre(genreId);
    navigate("/films");
  };

  return (
    <div className="relative group">
      <button className="text-white hover:text-gray-300 transition-colors cursor-pointer">
        {genre ? genres.find(g => g.id === genre)?.name : "Genres"}
      </button>
      <div className="absolute right-0 mt-2 w-56 rounded-xl shadow-lg bg-white ring-1 ring-gray-200 z-20 max-h-64 overflow-y-auto opacity-0 invisible group-hover:opacity-100 group-hover:visible scale-95 group-hover:scale-100 transition-all duration-200 origin-top-right">
        <div className="py-1">
          {genres.map((genreItem) => (
            <button
              key={genreItem.id}
              className={`block w-full text-left px-4 py-2 text-sm transition-colors cursor-pointer ${
                genre === genreItem.id
                  ? "bg-gray-200 text-blue-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => handleGenreSelect(genreItem.id)}
            >
              {genreItem.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GenreDropdown;

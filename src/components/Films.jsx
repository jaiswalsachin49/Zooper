import React, { useContext, useState, useMemo, useEffect } from "react";
import usePaginatedMovies from "../hooks/usePaginatedMovies";
import MovieCard from "./Card";
import { GenresContext } from "../context/genres.context";
import CardSkeleton from "./CardSkeleton";
import { Filter, SlidersHorizontal } from "lucide-react";

const GENRES = [
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

export default function Films() {
  const { genre, setGenre } = useContext(GenresContext);

  const [sortBy, setSortBy] = useState("Popularity");
  const [page, setPage] = useState(1);

  const {
    data,
    loading,
    error,
    totalPages,
  } = usePaginatedMovies(genre, "movie", page);

  // Reset to page 1 whenever genre or sort changes
  useEffect(() => {
    setPage(1);
  }, [genre, sortBy]);

  // Client-side sorting
  const sortedData = useMemo(() => {
    if (!data) return [];
    const sorted = [...data];

    switch (sortBy) {
      case "Popularity":
        return sorted.sort((a, b) => b.popularity - a.popularity);
      case "Rating":
        return sorted.sort((a, b) => b.vote_average - a.vote_average);
      case "Release Year":
        return sorted.sort((a, b) => {
          const dateA = new Date(a.release_date || "1900-01-01");
          const dateB = new Date(b.release_date || "1900-01-01");
          return dateB - dateA;
        });
      default:
        return sorted;
    }
  }, [data, sortBy]);

  return (
    <div className="bg-[#0f1014] min-h-screen pt-24 px-6 pb-20">
      <div className="max-w-[1700px] mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">All Films</h1>
          <p className="text-gray-400">Explore our complete collection of movies</p>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-[#16181f] p-4 rounded-xl border border-white/5 mb-10">

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <Filter size={16} /> Filters:
            </div>

            <select
              value={genre || ""}
              onChange={(e) => setGenre(e.target.value ? parseInt(e.target.value) : null)}
              className="bg-[#22252f] text-white text-sm px-4 py-2 rounded-lg border border-white/10 outline-none focus:border-blue-500 transition-colors"
            >
              <option value="">All Genres</option>
              {GENRES.map((g) => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto justify-end">
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <SlidersHorizontal size={16} /> Sort by:
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#22252f] text-white text-sm px-4 py-2 rounded-lg border border-white/10 outline-none focus:border-blue-500 transition-colors"
            >
              <option value="Popularity">Popularity</option>
              <option value="Rating">Rating</option>
              <option value="Release Year">Release Year</option>
            </select>

            <span className="text-gray-500 text-sm border-l border-white/10 pl-4">
              {sortedData.length} movies
            </span>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {[...Array(10)].map((_, i) => <CardSkeleton key={i} />)}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex items-center justify-center h-64 w-full">
            <p className="text-red-400 font-bold">Error loading films: {error.message}</p>
          </div>
        )}

        {/* Movie Grid */}
        {!loading && !error && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {sortedData.map((movie, index) =>
                movie.poster_path ? (
                  <MovieCard
                    key={`${movie.id}-${index}`}
                    image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    backdrop_path={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                    media_type="movie"
                    title={movie.title}
                    description={movie.overview}
                    id={movie.id}
                    vote_average={movie.vote_average}
                    release_date={movie.release_date}
                    original_language={movie.original_language}
                    popularity={movie.popularity}
                    vote_count={movie.vote_count}
                  />
                ) : null
              )}
            </div>

            {/* Pagination Controls */}
            {/* Numeric Pagination */}
            <div className="flex justify-center items-center gap-2 mt-10 flex-wrap">

              {page > 1 && (
                <button
                  onClick={() => setPage(page - 1)}
                  className="px-3 py-2 bg-[#22252f] text-white rounded-md"
                >
                  Prev
                </button>
              )}

              {/* Always show page 1 */}
              <button
                onClick={() => setPage(1)}
                className={`px-3 py-2 rounded-md ${page === 1 ? "bg-blue-600 text-white" : "bg-[#22252f] text-gray-300"
                  }`}
              >
                1
              </button>

              {/* Left Ellipsis */}
              {page > 4 && <span className="text-gray-500 px-2">...</span>}

              {/* Page window around current */}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p >= page - 2 && p <= page + 2 && p !== 1 && p !== totalPages)
                .map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`px-3 py-2 rounded-md ${page === p
                        ? "bg-blue-600 text-white"
                        : "bg-[#22252f] text-gray-300 hover:bg-[#2c2f3a]"
                      }`}
                  >
                    {p}
                  </button>
                ))}

              {/* Right Ellipsis */}
              {page < totalPages - 3 && <span className="text-gray-500 px-2">...</span>}

              {/* Last Page */}
              {totalPages > 1 && (
                <button
                  onClick={() => setPage(totalPages)}
                  className={`px-3 py-2 rounded-md ${page === totalPages
                      ? "bg-blue-600 text-white"
                      : "bg-[#22252f] text-gray-300"
                    }`}
                >
                  {totalPages}
                </button>
              )}

              {/* Next Button */}
              {page < totalPages && (
                <button
                  onClick={() => setPage(page + 1)}
                  className="px-3 py-2 bg-[#22252f] text-white rounded-md"
                >
                  Next
                </button>
              )}

            </div>

          </>
        )}
      </div>
    </div>
  );
}

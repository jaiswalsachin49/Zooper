import React, { useContext, useEffect } from "react";
import { SearchContext } from "../context/search.context";
import useMultiSearch from "../hooks/MultiSearch";
import HeroBanner from "./HeroBanner";
import MovieCard from "./Card";

export const SearchPage = () => {
  const { searchQuery, searchResults } = useContext(SearchContext);
  useMultiSearch(searchQuery); 
  return (
    <div className="text-black px-6 mb-20">
      {searchResults.length > 0 && <HeroBanner movies={searchResults} />}
      <h1 className="text-3xl font-bold mb-15 mt-15 ml-15 text-white">Search Results</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 px-4">
        {searchResults && searchResults.map((movie) => (
        movie.poster_path && 
          <MovieCard
            key={movie.id}
            media_type={movie.media_type}
            image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            title={movie.title || movie.name}
            description={movie.overview}
            id={movie.id}
          />
        ))}
      </div>
    </div>
  );
};

export default SearchPage;

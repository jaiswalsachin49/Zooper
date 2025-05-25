import apiClient from "../services/api";
import { useState, useEffect } from "react";

export default function useMovieData(genre) {
  const [movies, setMovies] = useState([]);

  async function getMovie() {
    try {
      const response = await apiClient.get("/discover/movie",{
        params: {
          with_genres: genre,
          sort_by: "popularity.desc"
    }});
      setMovies(response.data.results);
    } catch (error) {
      console.error("Error fetching movie data:", error);
    }
  }

  useEffect(() => {
    getMovie();
  }, [genre]);
  return movies;
}

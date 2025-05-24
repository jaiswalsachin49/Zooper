import apiClient from "../services/api";
import { useState, useEffect } from "react";

export default function useMovieData() {
  const [movies, setMovies] = useState([]);

  async function getMovie() {
    try {
      const response = await apiClient.get("/discover/movie");
      setMovies(response.data.results);
    } catch (error) {
      console.error("Error fetching movie data:", error);
    }
  }

  useEffect(() => {
    getMovie();
  }, []);
  return movies;
}

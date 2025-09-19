import apiClient from "../services/api";
import { useState, useEffect } from "react";

export default function useMovieData(genre) {
  const [data, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function getMovie() {
    try {
      const response = await apiClient.get("/discover/movie",{
        params: {
          with_genres: genre,
          sort_by: "popularity.desc"
    }});
      setMovies(response.data.results);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching movie data:", error);
      setLoading(false);
      setError(error);
    }
  }

  useEffect(() => {
    getMovie();
  }, [genre]);
  return {data,loading,error};
}

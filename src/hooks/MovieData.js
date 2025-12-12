import apiClient from "../services/api";
import { useState, useEffect } from "react";

export default function useMovieData(genre, mediaType = "movie") {
  const [data, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function getMedia() {
    try {
      const endpoint = mediaType === "tv" ? "/discover/tv" : "/discover/movie";
      const response = await apiClient.get(endpoint, {
        params: {
          with_genres: genre,
          sort_by: "popularity.desc"
        }
      });
      setMovies(response.data.results);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
      setError(error);
    }
  }

  useEffect(() => {
    getMedia();
  }, [genre, mediaType]);

  return { data, loading, error };
}

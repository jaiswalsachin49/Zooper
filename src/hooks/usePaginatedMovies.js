import apiClient from "../services/api";
import { useState, useEffect } from "react";

export default function usePaginatedMovies(genre, mediaType = "movie", page = 1) {
    const [data, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const endpoint = mediaType === "tv" ? "/discover/tv" : "/discover/movie";

                const response = await apiClient.get(endpoint, {
                    params: {
                        with_genres: genre || "",
                        sort_by: "popularity.desc",
                        page: page,
                    },
                });

                setMovies(response.data.results);
                setTotalPages(Math.min(response.data.total_pages, 500)); // TMDB max = 500
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        }

        fetchData();
    }, [genre, mediaType, page]);

    return { data, loading, error, totalPages };
}

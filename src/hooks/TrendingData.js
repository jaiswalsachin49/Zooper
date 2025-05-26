import apiClient from "../services/api"
import { useState,useEffect } from "react"

export default function useTrendingData(tren="movie") {
    const [trendingData, setTrendingData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTrendingData = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get(`/trending/${tren}/day`);
            setTrendingData(response.data.results);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
        };

        fetchTrendingData();
        }, [tren]);

    return { trendingData, loading, error };

}
import apiClient from "../services/api";
import { useState, useEffect } from "react";

export default function useWebData() {
  const [data, setTv] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function getWebShow() {
    try {
      const response = await apiClient.get("/discover/tv");
      setTv(response.data.results);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching TV data:", error);
      setLoading(false);
      setError(error);
    }
  }

  useEffect(() => {
    getWebShow();
  }, []);
  return {data,loading,error};
}
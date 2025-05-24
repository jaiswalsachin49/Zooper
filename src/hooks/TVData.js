import apiClient from "../services/api";
import { useState, useEffect } from "react";

export default function useWebData() {
  const [tv, setTv] = useState([]);

  async function getWebShow() {
    try {
      const response = await apiClient.get("/discover/tv");
      setTv(response.data.results);
    } catch (error) {
      console.error("Error fetching TV data:", error);
    }
  }

  useEffect(() => {
    getWebShow();
  }, []);
  return tv;
}
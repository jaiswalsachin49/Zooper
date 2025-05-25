import apiClient from "../services/api";
import { useContext, useEffect } from "react";
import { SearchContext } from "../context/search.context";

export default function useMultiSearch(query) {
  const { setSearchResults } = useContext(SearchContext);

  async function getMultiSearch() {
    try {
      const response = await apiClient.get("/search/multi", {
        params: {
          query: query,
          include_adult: false,
        },
      });
      const data = response.data.results;
      setSearchResults(data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (query) {
      getMultiSearch();
    }
  }, [query]);
}

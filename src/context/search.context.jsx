import { createContext } from "react";
import { useState } from "react";
export const SearchContext = createContext();
export const SearchProvider = ({ children }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    return (
        <SearchContext.Provider
        value={{
            searchQuery,
            setSearchQuery,
            searchResults,
            setSearchResults,
        }}
        >
        {children}
        </SearchContext.Provider>
    );
};

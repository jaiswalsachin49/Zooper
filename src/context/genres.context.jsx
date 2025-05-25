import { createContext,useState } from "react";

export const GenresContext = createContext({
    genre: null,
    setGenre: () => {}
});

export const GenresProvider = ({ children }) => {
    const [genre, setGenre] = useState(null);

    return (
        <GenresContext.Provider value={{ genre, setGenre }}>
            {children}
        </GenresContext.Provider>
    );
}
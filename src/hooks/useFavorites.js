import { useState, useEffect } from 'react';

/**
 * Custom hook for managing favorite movies and TV shows
 * Stores favorites in localStorage for persistence
 */
const useFavorites = () => {
  const [favorites, setFavorites] = useState([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('zooper_favorites');
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch (error) {
        console.error('Failed to parse favorites:', error);
        setFavorites([]);
      }
    }
  }, []);

  // Save favorites to localStorage whenever it changes
  useEffect(() => {
    if (favorites.length > 0) {
      localStorage.setItem('zooper_favorites', JSON.stringify(favorites));
    } else {
      localStorage.removeItem('zooper_favorites');
    }
  }, [favorites]);

  /**
   * Toggle favorite status for a content item
   * @param {Object} content - Movie/TV show data from TMDB
   */
  const toggleFavorite = (content) => {
    const favoriteItem = {
      id: content.id,
      type: content.media_type || 'movie',
      title: content.title || content.name,
      poster: content.poster_path,
      backdrop: content.backdrop_path,
      rating: content.vote_average,
      releaseDate: content.release_date || content.first_air_date,
      overview: content.overview,
      addedAt: new Date().toISOString(),
    };

    setFavorites((prev) => {
      const exists = prev.find(item => item.id === content.id && item.type === favoriteItem.type);
      
      if (exists) {
        // Remove from favorites
        return prev.filter(item => !(item.id === content.id && item.type === favoriteItem.type));
      } else {
        // Add to favorites (most recent first)
        return [favoriteItem, ...prev];
      }
    });
  };

  /**
   * Check if a content item is favorited
   * @param {string|number} id - Content ID
   * @param {string} type - Content type ('movie' or 'tv')
   * @returns {boolean} - True if favorited
   */
  const isFavorite = (id, type) => {
    return favorites.some(item => item.id === id && item.type === type);
  };

  /**
   * Get all favorite items
   * @returns {Array} - Array of favorite items
   */
  const getAllFavorites = () => {
    return favorites;
  };

  /**
   * Clear all favorites
   */
  const clearFavorites = () => {
    setFavorites([]);
    localStorage.removeItem('zooper_favorites');
  };

  /**
   * Remove a specific item from favorites
   * @param {string|number} id - Content ID
   * @param {string} type - Content type ('movie' or 'tv')
   */
  const removeFromFavorites = (id, type) => {
    setFavorites(prev => prev.filter(item => !(item.id === id && item.type === type)));
  };

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    getAllFavorites,
    clearFavorites,
    removeFromFavorites,
  };
};

export default useFavorites;

import { useState, useEffect } from 'react';
import { storageService } from '../services/storage';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<number[]>([]);

  useEffect(() => {
    setFavorites(storageService.getFavorites());
  }, []);

  const toggleFavorite = (matchId: number) => {
    storageService.toggleFavorite(matchId);
    setFavorites(storageService.getFavorites());
  };

  const isFavorite = (matchId: number) => {
    return favorites.includes(matchId);
  };

  return {
    favorites,
    toggleFavorite,
    isFavorite,
  };
};
export default useFavorites;

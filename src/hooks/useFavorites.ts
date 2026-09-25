import { useState, useEffect, useCallback } from 'react';
import { storageService } from '../services/storage';
import type { FavoriteTeam } from '../types/dashboard';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<number[]>(() => storageService.getFavorites());
  const [favoriteTeams, setFavoriteTeams] = useState<FavoriteTeam[]>(() => storageService.getFavoriteTeams());

  useEffect(() => {
    const handleFavChange = () => {
      setFavorites(storageService.getFavorites());
    };

    const handleTeamFavChange = () => {
      setFavoriteTeams(storageService.getFavoriteTeams());
    };

    window.addEventListener('favoritesChanged', handleFavChange);
    window.addEventListener('favoriteTeamsChanged', handleTeamFavChange);

    return () => {
      window.removeEventListener('favoritesChanged', handleFavChange);
      window.removeEventListener('favoriteTeamsChanged', handleTeamFavChange);
    };
  }, []);

  const toggleFavorite = useCallback((matchId: number) => {
    const isFav = storageService.toggleFavorite(matchId);
    setFavorites(storageService.getFavorites());
    return isFav;
  }, []);

  const isFavorite = useCallback((matchId: number) => {
    return favorites.includes(matchId);
  }, [favorites]);

  const toggleFavoriteTeam = useCallback((team: FavoriteTeam | { id: number; name: string; logo?: string }) => {
    const isFav = storageService.toggleFavoriteTeam(team);
    setFavoriteTeams(storageService.getFavoriteTeams());
    return isFav;
  }, []);

  const isTeamFavorite = useCallback((teamId: number) => {
    return favoriteTeams.some(t => t.id === teamId);
  }, [favoriteTeams]);

  return {
    favorites,
    favoriteTeams,
    toggleFavorite,
    isFavorite,
    toggleFavoriteTeam,
    isTeamFavorite,
  };
};

export default useFavorites;

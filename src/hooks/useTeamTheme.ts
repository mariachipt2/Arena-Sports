import { useState, useEffect, useCallback } from 'react';
import type { TeamTheme } from '../types/theme';
import { themeService, POPULAR_TEAM_THEMES } from '../services/themeService';
import { DEFAULT_THEME } from '../types/theme';

export const useTeamTheme = () => {
  const [currentTheme, setCurrentTheme] = useState<TeamTheme>(themeService.getActiveTheme());

  useEffect(() => {
    // Sincroniza estado com o serviço
    setCurrentTheme(themeService.getActiveTheme());

    const handleThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent<TeamTheme>;
      setCurrentTheme(customEvent.detail || DEFAULT_THEME);
    };

    window.addEventListener('teamThemeChanged', handleThemeChange);
    return () => {
      window.removeEventListener('teamThemeChanged', handleThemeChange);
    };
  }, []);

  const selectTheme = useCallback((theme: TeamTheme | null) => {
    themeService.applyTheme(theme);
  }, []);

  const selectThemeByTeam = useCallback((teamIdOrName: number | string) => {
    const found = themeService.findTeamTheme(teamIdOrName);
    if (found) {
      themeService.applyTheme(found);
      return true;
    }
    return false;
  }, []);

  const resetTheme = useCallback(() => {
    themeService.resetToDefault();
  }, []);

  const isCustomThemeActive = currentTheme.name !== DEFAULT_THEME.name;

  return {
    currentTheme,
    isCustomThemeActive,
    selectTheme,
    selectThemeByTeam,
    resetTheme,
    popularThemes: POPULAR_TEAM_THEMES,
  };
};

export default useTeamTheme;

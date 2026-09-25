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

  const selectThemeByTeam = useCallback((teamInput: { id?: number; name: string; logo?: string } | number | string) => {
    const resolved = themeService.resolveTeamTheme(teamInput);
    themeService.applyTheme(resolved);
    return true;
  }, []);

  const isThemeActiveForTeam = useCallback((teamInput: { id?: number; name?: string } | number | string): boolean => {
    if (currentTheme.name === DEFAULT_THEME.name) return false;

    let targetId: number | undefined;
    let targetName: string | undefined;

    if (typeof teamInput === 'object' && teamInput !== null) {
      targetId = teamInput.id;
      targetName = teamInput.name;
    } else if (typeof teamInput === 'number') {
      targetId = teamInput;
    } else if (typeof teamInput === 'string') {
      targetName = teamInput;
    }

    if (targetId && currentTheme.id && targetId === currentTheme.id) {
      return true;
    }

    if (targetName && currentTheme.name) {
      const cleanA = targetName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
      const cleanB = currentTheme.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
      if (cleanA === cleanB || cleanA.includes(cleanB) || cleanB.includes(cleanA)) {
        return true;
      }
    }

    return false;
  }, [currentTheme]);

  const toggleThemeByTeam = useCallback((teamInput: { id?: number; name: string; logo?: string } | number | string): { active: boolean; themeName: string } => {
    const isActive = isThemeActiveForTeam(teamInput);
    if (isActive) {
      themeService.resetToDefault();
      return { active: false, themeName: 'Arena' };
    } else {
      const theme = themeService.resolveTeamTheme(teamInput);
      themeService.applyTheme(theme);
      return { active: true, themeName: theme.name };
    }
  }, [isThemeActiveForTeam]);

  const resetTheme = useCallback(() => {
    themeService.resetToDefault();
  }, []);

  const isCustomThemeActive = currentTheme.name !== DEFAULT_THEME.name;

  return {
    currentTheme,
    isCustomThemeActive,
    selectTheme,
    selectThemeByTeam,
    toggleThemeByTeam,
    isThemeActiveForTeam,
    resetTheme,
    popularThemes: POPULAR_TEAM_THEMES,
  };
};

export default useTeamTheme;

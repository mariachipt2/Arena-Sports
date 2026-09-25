export type TabType = 'live' | 'upcoming' | 'finished' | 'favorites' | 'settings';

export type FilterType = 'my_leagues' | 'all' | 'local' | 'international';

export interface QuotaInfo {
  limit: number;
  remaining: number;
  resetDate: string;
}

export interface FavoriteTeam {
  id: number;
  name: string;
  logo?: string;
}

export interface Preferences {
  apiKey: string;
  selectedLeagues: number[]; // ID das ligas que o usuário deseja priorizar
  hiddenLeagues: number[];   // ID das ligas que o usuário optou por não seguir / ocultar
  hiddenLeagueNames?: Record<number, string>; // Mapeia ID -> Nome da Liga para listagem nos ajustes
  useSimulation: boolean;
  favoriteTeams?: FavoriteTeam[]; // Times favoritados pelo usuário para alerta rápido
  priorityPollIntervalSeconds?: number; // Tempo de consulta rápida quando um time favorito estiver jogando (padrão 30s)
}

// Ligas mais populares e seus IDs na API-Football
export const POPULAR_LEAGUES = [
  { id: 71, name: 'Brasileirão Série A', country: 'Brazil', isLocal: true },
  { id: 72, name: 'Brasileirão Série B', country: 'Brazil', isLocal: true },
  { id: 73, name: 'Copa do Brasil', country: 'Brazil', isLocal: true },
  { id: 2, name: 'UEFA Champions League', country: 'Europe', isLocal: false },
  { id: 39, name: 'Premier League', country: 'England', isLocal: false },
  { id: 140, name: 'La Liga', country: 'Spain', isLocal: false },
  { id: 135, name: 'Serie A', country: 'Italy', isLocal: false },
  { id: 78, name: 'Bundesliga', country: 'Germany', isLocal: false },
  { id: 61, name: 'Ligue 1', country: 'France', isLocal: false },
  { id: 13, name: 'Copa Libertadores', country: 'South-America', isLocal: false },
];

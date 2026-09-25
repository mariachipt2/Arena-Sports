import { useState, useEffect, useRef, useCallback } from 'react';
import type { ApiFixture } from '../types/api';
import { apiFootballService } from '../services/apiFootball';
import { storageService } from '../services/storage';
import { themeService } from '../services/themeService';

interface GoalEvent {
  match: ApiFixture;
  scoringTeam: { name: string; logo: string };
  player: string;
  scoreHome: number;
  scoreAway: number;
}

export const useLiveMatches = (onGoalScored?: (event: GoalEvent) => void) => {
  const [liveMatches, setLiveMatches] = useState<ApiFixture[]>([]);
  const [dailyMatches, setDailyMatches] = useState<ApiFixture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  
  const [priorityInfo, setPriorityInfo] = useState<{
    isPriority: boolean;
    teamName: string | null;
  }>({ isPriority: false, teamName: null });

  const previousLiveMatchesRef = useRef<ApiFixture[]>([]);
  const isTabVisibleRef = useRef(true);

  // Avalia se há partida prioritária ocorrendo (time favorito, partida favoritada ou tema do clube ativo)
  const evaluatePriority = useCallback((currentMatches: ApiFixture[]) => {
    const favMatches = storageService.getFavorites();
    const favTeams = storageService.getFavoriteTeams();
    const favTeamIds = new Set(favTeams.map(t => t.id));
    const activeTheme = themeService.getActiveTheme();
    const activeThemeId = activeTheme?.id;

    for (const match of currentMatches) {
      const homeId = match.teams.home.id;
      const awayId = match.teams.away.id;

      if (favTeamIds.has(homeId)) {
        return { isPriority: true, teamName: match.teams.home.name };
      }
      if (favTeamIds.has(awayId)) {
        return { isPriority: true, teamName: match.teams.away.name };
      }
      if (activeThemeId && (homeId === activeThemeId || awayId === activeThemeId)) {
        const teamName = homeId === activeThemeId ? match.teams.home.name : match.teams.away.name;
        return { isPriority: true, teamName };
      }
      if (favMatches.includes(match.fixture.id)) {
        return { isPriority: true, teamName: `${match.teams.home.name} x ${match.teams.away.name}` };
      }
    }

    return { isPriority: false, teamName: null };
  }, []);

  // Carrega apenas partidas ao vivo no polling periódico
  const pollLiveMatches = useCallback(async (isPriority = false) => {
    try {
      const liveData = await apiFootballService.getLiveMatches(isPriority);
      setLiveMatches(liveData);
      setLastUpdated(new Date());

      // Reavalia status de prioridade
      const prio = evaluatePriority(liveData);
      setPriorityInfo(prio);

      // Detecção de gols
      const favorites = storageService.getFavorites();
      const favTeams = storageService.getFavoriteTeams();
      const favTeamIds = new Set(favTeams.map(t => t.id));

      if (previousLiveMatchesRef.current.length > 0 && onGoalScored) {
        liveData.forEach((currentMatch) => {
          const isMatchFav = favorites.includes(currentMatch.fixture.id);
          const isHomeFav = favTeamIds.has(currentMatch.teams.home.id);
          const isAwayFav = favTeamIds.has(currentMatch.teams.away.id);

          if (isMatchFav || isHomeFav || isAwayFav) {
            const prevMatch = previousLiveMatchesRef.current.find(
              (m) => m.fixture.id === currentMatch.fixture.id
            );
            if (prevMatch) {
              const currentHome = currentMatch.goals.home || 0;
              const currentAway = currentMatch.goals.away || 0;
              const prevHome = prevMatch.goals.home || 0;
              const prevAway = prevMatch.goals.away || 0;
              const homeScored = currentHome > prevHome;
              const awayScored = currentAway > prevAway;

              if (homeScored || awayScored) {
                const scoringTeam = homeScored ? currentMatch.teams.home : currentMatch.teams.away;
                const matchEvents = currentMatch.events || [];
                const goalEvents = matchEvents.filter(e => e.type === 'Goal');
                const lastGoal = goalEvents[goalEvents.length - 1];
                const playerName = lastGoal ? lastGoal.player.name : 'Autor Desconhecido';

                onGoalScored({
                  match: currentMatch,
                  scoringTeam,
                  player: playerName,
                  scoreHome: currentHome,
                  scoreAway: currentAway
                });
              }
            }
          }
        });
      }
      previousLiveMatchesRef.current = liveData;
    } catch (err) {
      console.warn('Erro no polling ao vivo:', err);
    }
  }, [onGoalScored, evaluatePriority]);

  // Carrega todos os dados (diários + ao vivo)
  const fetchAllMatches = useCallback(async () => {
    try {
      const [liveData, dailyData] = await Promise.all([
        apiFootballService.getLiveMatches(),
        apiFootballService.getDailyMatches()
      ]);

      setLiveMatches(liveData);
      setDailyMatches(dailyData);
      setLastUpdated(new Date());
      setError(null);
      previousLiveMatchesRef.current = liveData;

      // Avalia prioridade inicial
      const prio = evaluatePriority(liveData);
      setPriorityInfo(prio);

      // Sincroniza status oficial da cota com a API
      apiFootballService.syncQuotaStatus();
    } catch (err) {
      console.error('Erro ao buscar partidas:', err);
      setError('Erro ao atualizar dados esportivos.');
    } finally {
      setLoading(false);
    }
  }, [evaluatePriority]);

  // Efeito de inicialização e eventos de visibilidade / preferências
  useEffect(() => {
    fetchAllMatches(); // Execução inicial completa

    const handleVisibilityChange = () => {
      isTabVisibleRef.current = document.visibilityState === 'visible';
      if (isTabVisibleRef.current) {
        if (previousLiveMatchesRef.current.length > 0) {
          console.log('[Visibility API] Aba ativa com jogos ao vivo. Atualizando placares...');
          pollLiveMatches(priorityInfo.isPriority);
        } else {
          console.log('[Visibility API] Aba ativa, mas sem jogos ao vivo. Polling mantido em pausa para economizar cota.');
        }
      } else {
        console.log('[Visibility API] Aba minimizada. Polling pausado.');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    const handlePrefsChange = () => {
      console.log('[Preferences] Configurações alteradas. Recarregando partidas...');
      fetchAllMatches();
    };

    window.addEventListener('preferencesChanged', handlePrefsChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('preferencesChanged', handlePrefsChange);
    };
  }, [fetchAllMatches, pollLiveMatches, priorityInfo.isPriority]);

  // Reavaliação imediata de prioridade quando o usuário favorita um time ou partida
  useEffect(() => {
    const handleFavoritesUpdate = () => {
      const prio = evaluatePriority(liveMatches);
      setPriorityInfo(prio);
    };

    window.addEventListener('favoritesChanged', handleFavoritesUpdate);
    window.addEventListener('favoriteTeamsChanged', handleFavoritesUpdate);
    window.addEventListener('teamThemeChanged', handleFavoritesUpdate);
    window.addEventListener('priorityIntervalChanged', handleFavoritesUpdate);

    return () => {
      window.removeEventListener('favoritesChanged', handleFavoritesUpdate);
      window.removeEventListener('favoriteTeamsChanged', handleFavoritesUpdate);
      window.removeEventListener('teamThemeChanged', handleFavoritesUpdate);
      window.removeEventListener('priorityIntervalChanged', handleFavoritesUpdate);
    };
  }, [evaluatePriority, liveMatches]);

  // Intervalo dinâmico de polling:
  // Se houver time favorito jogando: usa o tempo configurado (padrão 30s)
  // Caso contrário: intervalo padrão seguro de 120s (2 minutos)
  const priorityIntervalSeconds = storageService.getPriorityPollInterval();
  const pollIntervalMs = priorityInfo.isPriority
    ? priorityIntervalSeconds * 1000
    : 120000;

  // Efeito de Polling inteligente e econômico da API Real
  useEffect(() => {
    // Se NÃO houver partidas ao vivo acontecendo no momento, PAUSA o polling para poupar cota
    const hasLiveMatches = liveMatches.length > 0;
    if (!hasLiveMatches) {
      return;
    }

    console.log(
      `[Polling Inteligente] Intervalo ativo: ${pollIntervalMs / 1000}s | Modo Prioritário: ${priorityInfo.isPriority ? `Sim (Time: ${priorityInfo.teamName})` : 'Padrão (120s)'}`
    );

    const intervalId = setInterval(() => {
      if (isTabVisibleRef.current) {
        pollLiveMatches(priorityInfo.isPriority);
      }
    }, pollIntervalMs);

    return () => clearInterval(intervalId);
  }, [pollLiveMatches, liveMatches.length, pollIntervalMs, priorityInfo.isPriority, priorityInfo.teamName]);

  return {
    liveMatches,
    dailyMatches,
    loading,
    error,
    lastUpdated,
    refetch: fetchAllMatches,
    isPriorityPolling: priorityInfo.isPriority,
    priorityTeamPlaying: priorityInfo.teamName,
    pollIntervalSeconds: priorityInfo.isPriority ? priorityIntervalSeconds : 120
  };
};

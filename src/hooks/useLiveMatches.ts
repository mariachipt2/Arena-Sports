import { useState, useEffect, useRef, useCallback } from 'react';
import type { ApiFixture } from '../types/api';
import { apiFootballService } from '../services/apiFootball';
import { updateSimulation } from '../services/mockData';
import { storageService } from '../services/storage';

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
  
  const previousLiveMatchesRef = useRef<ApiFixture[]>([]);
  const isTabVisibleRef = useRef(true);

  // Carrega apenas partidas ao vivo no polling periódico
  const pollLiveMatches = useCallback(async () => {
    try {
      const prefs = storageService.getPreferences();
      if (prefs.useSimulation) {
        updateSimulation();
      }

      const liveData = await apiFootballService.getLiveMatches();
      setLiveMatches(liveData);
      setLastUpdated(new Date());

      // Detecção de gols
      const favorites = storageService.getFavorites();
      if (previousLiveMatchesRef.current.length > 0 && onGoalScored) {
        liveData.forEach((currentMatch) => {
          if (favorites.includes(currentMatch.fixture.id)) {
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
  }, [onGoalScored]);

  // Carrega todos os dados (diários + ao vivo)
  const fetchAllMatches = useCallback(async () => {
    try {
      const prefs = storageService.getPreferences();
      if (prefs.useSimulation) {
        updateSimulation();
      }

      const [liveData, dailyData] = await Promise.all([
        apiFootballService.getLiveMatches(),
        apiFootballService.getDailyMatches()
      ]);

      setLiveMatches(liveData);
      setDailyMatches(dailyData);
      setLastUpdated(new Date());
      setError(null);
      previousLiveMatchesRef.current = liveData;
    } catch (err) {
      console.error('Erro ao buscar partidas:', err);
      setError('Erro ao atualizar dados esportivos.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Efeito principal de Polling + Page Visibility
  useEffect(() => {
    fetchAllMatches(); // Execução inicial completa

    // Ouvinte para detectar quando a aba está ativa ou minimizada
    const handleVisibilityChange = () => {
      isTabVisibleRef.current = document.visibilityState === 'visible';
      if (isTabVisibleRef.current) {
        console.log('[Visibility API] Aba ativa. Atualizando placares...');
        pollLiveMatches();
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

    // Intervalo de atualização apenas para jogos ao vivo
    const prefs = storageService.getPreferences();
    const intervalTime = prefs.useSimulation ? 5000 : 60000;

    const intervalId = setInterval(() => {
      if (isTabVisibleRef.current) {
        pollLiveMatches();
      }
    }, intervalTime);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('preferencesChanged', handlePrefsChange);
    };
  }, [fetchAllMatches, pollLiveMatches]);

  return {
    liveMatches,
    dailyMatches,
    loading,
    error,
    lastUpdated,
    refetch: fetchAllMatches
  };
};

import { useState, useEffect, useRef, useCallback } from 'react';
import type { ApiFixture } from '../types/api';
import { apiFootballService } from '../services/apiFootball';
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
      const [liveData, dailyData] = await Promise.all([
        apiFootballService.getLiveMatches(),
        apiFootballService.getDailyMatches()
      ]);

      setLiveMatches(liveData);
      setDailyMatches(dailyData);
      setLastUpdated(new Date());
      setError(null);
      previousLiveMatchesRef.current = liveData;

      // Sincroniza status oficial da cota com a API
      apiFootballService.syncQuotaStatus();
    } catch (err) {
      console.error('Erro ao buscar partidas:', err);
      setError('Erro ao atualizar dados esportivos.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Efeito de inicialização e eventos de visibilidade / preferências
  useEffect(() => {
    fetchAllMatches(); // Execução inicial completa

    const handleVisibilityChange = () => {
      isTabVisibleRef.current = document.visibilityState === 'visible';
      if (isTabVisibleRef.current) {
        if (previousLiveMatchesRef.current.length > 0) {
          console.log('[Visibility API] Aba ativa com jogos ao vivo. Atualizando placares...');
          pollLiveMatches();
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
  }, [fetchAllMatches, pollLiveMatches]);

  // Efeito de Polling inteligente e econômico da API Real
  useEffect(() => {
    // Se NÃO houver partidas ao vivo acontecendo no momento, PAUSA o polling para poupar cota
    const hasLiveMatches = liveMatches.length > 0;
    if (!hasLiveMatches) {
      return;
    }

    // Se houver partidas ao vivo, consulta em intervalo seguro (2 minutos)
    const intervalId = setInterval(() => {
      if (isTabVisibleRef.current) {
        pollLiveMatches();
      }
    }, 120000); // 2 minutos

    return () => clearInterval(intervalId);
  }, [pollLiveMatches, liveMatches.length]);

  return {
    liveMatches,
    dailyMatches,
    loading,
    error,
    lastUpdated,
    refetch: fetchAllMatches
  };
};

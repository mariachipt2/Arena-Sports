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

  // Carrega os dados da API ou do Mock
  const fetchMatches = useCallback(async () => {
    try {
      const prefs = storageService.getPreferences();
      
      // Se estiver em modo de simulação, atualiza a simulação na memória local
      if (prefs.useSimulation) {
        updateSimulation();
      }

      // Busca partidas
      const liveData = await apiFootballService.getLiveMatches();
      const dailyData = await apiFootballService.getDailyMatches();

      setLiveMatches(liveData);
      setDailyMatches(dailyData);
      setLastUpdated(new Date());
      setError(null);

      // --- DETECÇÃO DE GOLS PARA NOTIFICAÇÕES (TOASTS) ---
      const favorites = storageService.getFavorites();
      
      if (previousLiveMatchesRef.current.length > 0 && onGoalScored) {
        liveData.forEach((currentMatch) => {
          // Apenas notifica se for um jogo favoritado pelo usuário
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
                
                // Pega o jogador do último gol cadastrado nos eventos da partida
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

      // Atualiza a referência
      previousLiveMatchesRef.current = liveData;
    } catch (err) {
      console.error('Erro ao buscar partidas:', err);
      setError('Erro ao atualizar dados esportivos.');
    } finally {
      setLoading(false);
    }
  }, [onGoalScored]);

  // Efeito principal de Polling + Page Visibility
  useEffect(() => {
    fetchMatches(); // Execução inicial

    // Ouvinte para detectar quando a aba está ativa ou minimizada
    const handleVisibilityChange = () => {
      isTabVisibleRef.current = document.visibilityState === 'visible';
      if (isTabVisibleRef.current) {
        console.log('[Visibility API] Aba ativa. Atualizando placares...');
        fetchMatches();
      } else {
        console.log('[Visibility API] Aba minimizada. Polling pausado.');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Configura o intervalo de atualização inteligente
    const prefs = storageService.getPreferences();
    // No modo simulação, atualiza mais rápido (5s) para o usuário ver os gols acontecendo
    // Em produção (API), atualiza a cada 60s para economizar cota
    const intervalTime = prefs.useSimulation ? 5000 : 60000;

    const intervalId = setInterval(() => {
      if (isTabVisibleRef.current) {
        fetchMatches();
      }
    }, intervalTime);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchMatches]);

  return {
    liveMatches,
    dailyMatches,
    loading,
    error,
    lastUpdated,
    refetch: fetchMatches
  };
};

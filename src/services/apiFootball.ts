import type { ApiFixture, MatchLineup, MatchStatistics } from '../types/api';
import type { QuotaInfo } from '../types/dashboard';
import { mockDataService } from './mockData';
import { storageService } from './storage';

const API_HOST = 'v3.football.api-sports.io';
const API_URL = `https://${API_HOST}`;

// Função utilitária para pegar a data atual formatada (YYYY-MM-DD)
const getTodayDateString = (): string => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Captura e atualiza informações de cota a partir dos headers de resposta da API
const updateQuotaFromHeaders = (headers: Headers) => {
  const remaining = headers.get('x-ratelimit-requests-remaining');
  const limit = headers.get('x-ratelimit-requests-limit');

  if (remaining !== null && limit !== null) {
    const quota: QuotaInfo = {
      limit: parseInt(limit, 10),
      remaining: parseInt(remaining, 10),
      resetDate: new Date(Date.now() + 24 * 3600 * 1000).toLocaleTimeString() // Estimativa simplificada de reset
    };
    storageService.saveQuota(quota);
  }
};

export const apiFootballService = {
  async fetchFromApi<T>(endpoint: string, cacheKey: string, cacheDurationMinutes: number): Promise<T> {
    const prefs = storageService.getPreferences();

    // Se estiver em modo de simulação ou sem chave de API, lança erro para acionar o fallback do mock
    if (prefs.useSimulation || !prefs.apiKey) {
      throw new Error('SimulationMode');
    }

    // 1. Tenta recuperar do cache local
    const cached = storageService.getCache<T>(cacheKey);
    if (cached) {
      console.log(`[Cache Hit] Chave: ${cacheKey}`);
      return cached;
    }

    // 2. Faz a chamada HTTP real
    console.log(`[API Request] Chamando endpoint: ${endpoint}`);
    const response = await fetch(`${API_URL}/${endpoint}`, {
      method: 'GET',
      headers: {
        'x-rapidapi-host': API_HOST,
        'x-apisports-key': prefs.apiKey
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP_${response.status}`);
    }

    const json = await response.json();
    
    // API-Football pode retornar erros estruturados dentro do JSON (ex: chave inválida ou limite atingido)
    if (json.errors && Object.keys(json.errors).length > 0) {
      console.error('Erros retornados pela API-Football:', json.errors);
      throw new Error(JSON.stringify(json.errors));
    }

    // Atualiza cota através dos headers da resposta
    updateQuotaFromHeaders(response.headers);

    const result = json.response as T;

    // 3. Salva no cache se a resposta for válida
    if (result) {
      storageService.setCache(cacheKey, result, cacheDurationMinutes);
    }

    return result;
  },

  // --- OBTENÇÃO DE PARTIDAS AO VIVO ---
  async getLiveMatches(): Promise<ApiFixture[]> {
    const prefs = storageService.getPreferences();
    if (prefs.useSimulation) {
      return mockDataService.getLiveMatches();
    }
    
    try {
      const apiMatches = await this.fetchFromApi<ApiFixture[]>('fixtures?live=all', 'live_matches', 1);
      if (apiMatches && apiMatches.length > 0) {
        return apiMatches;
      }
      return mockDataService.getLiveMatches();
    } catch (e) {
      console.warn('Usando dados de fallback para jogos ao vivo devido a:', e instanceof Error ? e.message : e);
      return mockDataService.getLiveMatches();
    }
  },

  // --- OBTENÇÃO DE PARTIDAS DO DIA (PRÓXIMAS E ENCERRADAS) ---
  async getDailyMatches(): Promise<ApiFixture[]> {
    const prefs = storageService.getPreferences();
    if (prefs.useSimulation) {
      return [
        ...mockDataService.getFinishedMatches(),
        ...mockDataService.getUpcomingMatches()
      ];
    }

    const today = getTodayDateString();
    try {
      // Endpoint da API: fixtures?date=YYYY-MM-DD
      const apiMatches = await this.fetchFromApi<ApiFixture[]>(`fixtures?date=${today}`, `fixtures_${today}`, 15);
      if (apiMatches && apiMatches.length > 0) {
        return apiMatches;
      }
      return [
        ...mockDataService.getFinishedMatches(),
        ...mockDataService.getUpcomingMatches()
      ];
    } catch (e) {
      console.warn('Usando dados de fallback para jogos do dia devido a:', e instanceof Error ? e.message : e);
      return [
        ...mockDataService.getFinishedMatches(),
        ...mockDataService.getUpcomingMatches()
      ];
    }
  },

  // --- OBTENÇÃO DE DETALHES DE UMA PARTIDA ---
  async getMatchDetails(fixtureId: number): Promise<{
    lineups: MatchLineup[];
    statistics: MatchStatistics[];
  }> {
    try {
      // Faz requisições em paralelo para otimizar tempo
      // Cache de 30 minutos para detalhes de partida (já que mudam pouco ou são fixos pós-jogo)
      const lineupsPromise = this.fetchFromApi<MatchLineup[]>(
        `fixtures/lineups?fixture=${fixtureId}`, 
        `lineups_${fixtureId}`, 
        30
      );
      
      const statsPromise = this.fetchFromApi<MatchStatistics[]>(
        `fixtures/statistics?fixture=${fixtureId}`, 
        `stats_${fixtureId}`, 
        30
      );

      const [lineups, statistics] = await Promise.all([lineupsPromise, statsPromise]);

      return {
        lineups: lineups || [],
        statistics: statistics || []
      };
    } catch (e) {
      console.warn(`Usando simulação para detalhes do jogo ${fixtureId} devido a:`, e instanceof Error ? e.message : e);
      return mockDataService.getMatchDetails(fixtureId);
    }
  }
};

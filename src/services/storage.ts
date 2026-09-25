import type { Preferences, QuotaInfo, FavoriteTeam } from '../types/dashboard';

interface CacheEntry<T> {
  data: T;
  expiry: number; // Timestamp
}

const envKey = (import.meta.env.VITE_API_FOOTBALL_KEY as string) || '569319a5928dc79a97a43d90785a0558';

const CACHE_VERSION = 'v3';

// Limpeza automática de caches legados ou inválidos ao carregar o app
try {
  if (typeof localStorage !== 'undefined') {
    const currentVer = localStorage.getItem('arena_cache_ver');
    if (currentVer !== CACHE_VERSION) {
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const k = localStorage.key(i);
        if (k && k.startsWith('arena_cache_')) {
          localStorage.removeItem(k);
        }
      }
      localStorage.setItem('arena_cache_ver', CACHE_VERSION);
    }
  }
} catch (e) {
  console.warn('Erro ao verificar versão do cache:', e);
}

const DEFAULT_PREFS: Preferences = {
  apiKey: envKey || '',
  selectedLeagues: [71, 73, 2, 39, 140], // Brasileirão Série A, Copa do Brasil, Champions, Premier League, La Liga
  hiddenLeagues: [], // Ligas que o usuário não deseja seguir / ocultou
  hiddenLeagueNames: {}, // Mapeamento id -> nome
  useSimulation: false, // Modo Oficial em Tempo Real (API Oficial)
  favoriteTeams: [], // Times favoritos para modo rápido
  priorityPollIntervalSeconds: 30, // 30 segundos ao vivo quando o time jogar
};

export const storageService = {
  // --- CACHE DE API ---
  setCache<T>(key: string, data: T, durationMinutes: number): void {
    try {
      const entry: CacheEntry<T> = {
        data,
        expiry: Date.now() + durationMinutes * 60 * 1000,
      };
      localStorage.setItem(`arena_cache_${CACHE_VERSION}_${key}`, JSON.stringify(entry));
    } catch (e) {
      console.warn('Erro ao salvar no localStorage cache:', e);
    }
  },

  getCache<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(`arena_cache_${CACHE_VERSION}_${key}`);
      if (!item) return null;

      const entry: CacheEntry<T> = JSON.parse(item);
      if (Date.now() > entry.expiry) {
        localStorage.removeItem(`arena_cache_${CACHE_VERSION}_${key}`);
        return null;
      }
      return entry.data;
    } catch {
      return null;
    }
  },

  // --- PREFERÊNCIAS DO USUÁRIO ---
  getPreferences(): Preferences {
    try {
      let result: Preferences = { ...DEFAULT_PREFS };
      const prefs = localStorage.getItem('arena_preferences');
      if (prefs) {
        const parsed = JSON.parse(prefs);
        result = {
          ...DEFAULT_PREFS,
          ...parsed,
          apiKey: envKey,
          useSimulation: false
        };
      }

      // Sincronização inteligente com a URL (fundamental para PWA / atalhos da tela de início do iPhone)
      if (typeof window !== 'undefined' && window.location) {
        try {
          const urlParams = new URLSearchParams(window.location.search);
          const urlLeagues = urlParams.get('leagues');
          if (urlLeagues) {
            const parsedLeagues = urlLeagues
              .split(',')
              .map(id => parseInt(id.trim(), 10))
              .filter(id => !isNaN(id) && id > 0);

            if (parsedLeagues.length > 0) {
              result.selectedLeagues = parsedLeagues;
              // Persiste no localStorage do contêiner atual (ex: PWA isolado do iPhone)
              localStorage.setItem('arena_preferences', JSON.stringify(result));
            }
          } else if (result.selectedLeagues && result.selectedLeagues.length > 0 && window.history && window.history.replaceState) {
            // Se a URL não tiver o parâmetro ainda, reflete as ligas configuradas na URL
            // para que qualquer atalho criado pelo Safari já salve a URL com as preferências embutidas
            const url = new URL(window.location.href);
            url.searchParams.set('leagues', result.selectedLeagues.join(','));
            window.history.replaceState(null, '', url.toString());
          }
        } catch (e) {
          console.warn('Erro ao sincronizar ligas com a URL:', e);
        }
      }

      if (!prefs || JSON.parse(prefs).useSimulation !== false || JSON.parse(prefs).apiKey !== envKey) {
        localStorage.setItem('arena_preferences', JSON.stringify(result));
        if (prefs) this.clearCache();
      }

      return result;
    } catch {
      return DEFAULT_PREFS;
    }
  },

  savePreferences(prefs: Preferences): void {
    try {
      const sanitizedPrefs: Preferences = {
        ...prefs,
        apiKey: envKey,
        useSimulation: false
      };
      localStorage.setItem('arena_preferences', JSON.stringify(sanitizedPrefs));

      // Atualiza a URL sem recarregar para que o atalho do iOS/iPhone guarde as ligas selecionadas
      if (typeof window !== 'undefined' && window.history && window.history.replaceState) {
        try {
          const url = new URL(window.location.href);
          if (sanitizedPrefs.selectedLeagues && sanitizedPrefs.selectedLeagues.length > 0) {
            url.searchParams.set('leagues', sanitizedPrefs.selectedLeagues.join(','));
          } else {
            url.searchParams.delete('leagues');
          }
          window.history.replaceState(null, '', url.toString());
        } catch (err) {
          console.warn('Erro ao atualizar URL com preferências:', err);
        }
      }
    } catch (e) {
      console.error('Erro ao salvar preferências:', e);
    }
  },

  clearCache(): void {
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('arena_cache_')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
    } catch (e) {
      console.warn('Erro ao limpar cache local:', e);
    }
  },

  // --- COTA DA API ---
  getQuota(): QuotaInfo {
    try {
      const quota = localStorage.getItem('arena_quota');
      if (!quota) {
        // Inicializa com 65% usado (35 restantes) conforme estado atual informado
        const initialQuota: QuotaInfo = {
          limit: 100,
          remaining: 35,
          resetDate: '21:00 BRT'
        };
        localStorage.setItem('arena_quota', JSON.stringify(initialQuota));
        return initialQuota;
      }
      return JSON.parse(quota);
    } catch (e) {
      return { limit: 100, remaining: 35, resetDate: '21:00 BRT' };
    }
  },

  saveQuota(quota: QuotaInfo): void {
    try {
      localStorage.setItem('arena_quota', JSON.stringify(quota));
      window.dispatchEvent(new Event('quotaChanged'));
    } catch (e) {
      console.error('Erro ao salvar cota:', e);
    }
  },

  decrementQuota(): void {
    try {
      const current = this.getQuota();
      if (current && current.remaining > 0) {
        current.remaining = Math.max(0, current.remaining - 1);
        this.saveQuota(current);
      }
    } catch (e) {
      console.warn('Erro ao decrementar cota:', e);
    }
  },

  // --- PARTIDAS FAVORITADAS ---
  getFavorites(): number[] {
    try {
      const favs = localStorage.getItem('arena_favorites');
      if (!favs) return [];
      return JSON.parse(favs);
    } catch (e) {
      return [];
    }
  },

  toggleFavorite(matchId: number): boolean {
    try {
      const favs = this.getFavorites();
      const index = favs.indexOf(matchId);
      let isFav = false;

      if (index === -1) {
        favs.push(matchId);
        isFav = true;
      } else {
        favs.splice(index, 1);
        isFav = false;
      }

      localStorage.setItem('arena_favorites', JSON.stringify(favs));
      window.dispatchEvent(new CustomEvent('favoritesChanged', { detail: favs }));
      return isFav;
    } catch (e) {
      return false;
    }
  },

  isFavorite(matchId: number): boolean {
    const favs = this.getFavorites();
    return favs.includes(matchId);
  },

  // --- TIMES FAVORITADOS (MODO RÁPIDO AO VIVO) ---
  getFavoriteTeams(): FavoriteTeam[] {
    try {
      const stored = localStorage.getItem('arena_favorite_teams');
      if (stored) {
        return JSON.parse(stored);
      }
      const prefs = this.getPreferences();
      return prefs.favoriteTeams || [];
    } catch (e) {
      return [];
    }
  },

  saveFavoriteTeams(teams: FavoriteTeam[]): void {
    try {
      localStorage.setItem('arena_favorite_teams', JSON.stringify(teams));
      const prefs = this.getPreferences();
      this.savePreferences({ ...prefs, favoriteTeams: teams });
      window.dispatchEvent(new CustomEvent('favoriteTeamsChanged', { detail: teams }));
    } catch (e) {
      console.error('Erro ao salvar times favoritos:', e);
    }
  },

  toggleFavoriteTeam(team: FavoriteTeam | { id: number; name: string; logo?: string }): boolean {
    try {
      const teams = this.getFavoriteTeams();
      const index = teams.findIndex(t => t.id === team.id);
      let isFav = false;

      if (index === -1) {
        teams.push({
          id: team.id,
          name: team.name,
          logo: team.logo
        });
        isFav = true;
      } else {
        teams.splice(index, 1);
        isFav = false;
      }

      this.saveFavoriteTeams(teams);
      return isFav;
    } catch (e) {
      return false;
    }
  },

  isTeamFavorite(teamId: number): boolean {
    const teams = this.getFavoriteTeams();
    return teams.some(t => t.id === teamId);
  },

  getPriorityPollInterval(): number {
    try {
      const stored = localStorage.getItem('arena_priority_interval');
      if (stored) {
        const val = parseInt(stored, 10);
        if (!isNaN(val) && val > 0) return val;
      }
      const prefs = this.getPreferences();
      return prefs.priorityPollIntervalSeconds || 30;
    } catch {
      return 30;
    }
  },

  setPriorityPollInterval(seconds: number): void {
    try {
      localStorage.setItem('arena_priority_interval', seconds.toString());
      const prefs = this.getPreferences();
      this.savePreferences({ ...prefs, priorityPollIntervalSeconds: seconds });
      window.dispatchEvent(new CustomEvent('priorityIntervalChanged', { detail: seconds }));
    } catch (e) {
      console.error('Erro ao salvar intervalo prioritário:', e);
    }
  },

  // --- CONTROLE DE LIGAS (SEGUIR / NÃO SEGUIR) ---
  isLeagueFollowed(leagueId: number): boolean {
    const prefs = this.getPreferences();
    return (prefs.selectedLeagues || []).includes(leagueId);
  },

  isLeagueHidden(leagueId: number): boolean {
    const prefs = this.getPreferences();
    return (prefs.hiddenLeagues || []).includes(leagueId);
  },

  toggleFollowLeague(leagueId: number, leagueName?: string): boolean {
    const prefs = this.getPreferences();
    const selected = [...(prefs.selectedLeagues || [])];
    const hidden = [...(prefs.hiddenLeagues || [])];
    const names = { ...(prefs.hiddenLeagueNames || {}) };

    if (leagueName) {
      names[leagueId] = leagueName;
    }

    // Se estiver oculta, desoculta ao seguir
    const hiddenIndex = hidden.indexOf(leagueId);
    if (hiddenIndex !== -1) {
      hidden.splice(hiddenIndex, 1);
    }

    const index = selected.indexOf(leagueId);
    let isFollowed = false;
    if (index === -1) {
      selected.push(leagueId);
      isFollowed = true;
    } else {
      selected.splice(index, 1);
      isFollowed = false;
    }

    this.savePreferences({
      ...prefs,
      selectedLeagues: selected,
      hiddenLeagues: hidden,
      hiddenLeagueNames: names
    });
    window.dispatchEvent(new Event('preferencesChanged'));
    return isFollowed;
  },

  hideLeague(leagueId: number, leagueName?: string): void {
    const prefs = this.getPreferences();
    const hidden = [...(prefs.hiddenLeagues || [])];
    const selected = [...(prefs.selectedLeagues || [])];
    const names = { ...(prefs.hiddenLeagueNames || {}) };

    if (leagueName) {
      names[leagueId] = leagueName;
    }

    // Remove das seguidas caso estivesse
    const selIndex = selected.indexOf(leagueId);
    if (selIndex !== -1) {
      selected.splice(selIndex, 1);
    }

    // Adiciona às ocultadas (não seguidas) se ainda não estiver
    if (!hidden.includes(leagueId)) {
      hidden.push(leagueId);
    }

    this.savePreferences({
      ...prefs,
      selectedLeagues: selected,
      hiddenLeagues: hidden,
      hiddenLeagueNames: names
    });
    window.dispatchEvent(new Event('preferencesChanged'));
  },

  unhideLeague(leagueId: number): void {
    const prefs = this.getPreferences();
    const hidden = [...(prefs.hiddenLeagues || [])];
    const index = hidden.indexOf(leagueId);
    if (index !== -1) {
      hidden.splice(index, 1);
      this.savePreferences({
        ...prefs,
        hiddenLeagues: hidden
      });
      window.dispatchEvent(new Event('preferencesChanged'));
    }
  }
};

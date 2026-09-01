import type { Preferences, QuotaInfo } from '../types/dashboard';

interface CacheEntry<T> {
  data: T;
  expiry: number; // Timestamp
}

const envKey = (import.meta.env.VITE_API_FOOTBALL_KEY as string) || '569319a5928dc79a97a43d90785a0558';

const DEFAULT_PREFS: Preferences = {
  apiKey: envKey || '569319a5928dc79a97a43d90785a0558',
  selectedLeagues: [71, 73, 2, 39, 140], // Brasileirão Série A, Copa do Brasil, Champions, Premier League, La Liga
  useSimulation: true, // Garante que partidas (Cruzeiro x Atlético, etc.) sempre apareçam de imediato
};

export const storageService = {
  // --- CACHE DE API ---
  setCache<T>(key: string, data: T, durationMinutes: number): void {
    try {
      const entry: CacheEntry<T> = {
        data,
        expiry: Date.now() + durationMinutes * 60 * 1000,
      };
      localStorage.setItem(`arena_cache_${key}`, JSON.stringify(entry));
    } catch (e) {
      console.warn('Erro ao salvar no localStorage cache:', e);
    }
  },

  getCache<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(`arena_cache_${key}`);
      if (!item) return null;

      const entry: CacheEntry<T> = JSON.parse(item);
      if (Date.now() > entry.expiry) {
        localStorage.removeItem(`arena_cache_${key}`);
        return null;
      }
      return entry.data;
    } catch (e) {
      return null;
    }
  },

  // --- PREFERÊNCIAS DO USUÁRIO ---
  getPreferences(): Preferences {
    try {
      const prefs = localStorage.getItem('arena_preferences');
      if (!prefs) return DEFAULT_PREFS;
      const parsed = JSON.parse(prefs);
      
      const finalApiKey = parsed.apiKey || envKey;
      return {
        ...DEFAULT_PREFS,
        ...parsed,
        apiKey: finalApiKey,
        useSimulation: parsed.useSimulation ?? false
      };
    } catch (e) {
      return DEFAULT_PREFS;
    }
  },

  savePreferences(prefs: Preferences): void {
    try {
      const oldPrefs = this.getPreferences();
      const changedMode = oldPrefs.useSimulation !== prefs.useSimulation;
      const changedKey = oldPrefs.apiKey !== prefs.apiKey;

      localStorage.setItem('arena_preferences', JSON.stringify(prefs));

      if (changedMode || changedKey) {
        console.log('[Cache] Limpando cache local de partidas devido a mudança de configurações...');
        this.clearCache();
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
  getQuota(): QuotaInfo | null {
    try {
      const quota = localStorage.getItem('arena_quota');
      if (!quota) return null;
      return JSON.parse(quota);
    } catch (e) {
      return null;
    }
  },

  saveQuota(quota: QuotaInfo): void {
    try {
      localStorage.setItem('arena_quota', JSON.stringify(quota));
    } catch (e) {
      console.error('Erro ao salvar cota:', e);
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
      return isFav;
    } catch (e) {
      return false;
    }
  },

  isFavorite(matchId: number): boolean {
    const favs = this.getFavorites();
    return favs.includes(matchId);
  }
};

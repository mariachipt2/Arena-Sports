import type { Preferences, QuotaInfo } from '../types/dashboard';

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
  useSimulation: false, // Modo Oficial em Tempo Real (API Oficial)
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
      const prefs = localStorage.getItem('arena_preferences');
      if (!prefs) {
        localStorage.setItem('arena_preferences', JSON.stringify(DEFAULT_PREFS));
        return DEFAULT_PREFS;
      }
      const parsed = JSON.parse(prefs);
      
      // Força permanentemente o modo de dados reais e a chave API interna
      const result: Preferences = {
        ...DEFAULT_PREFS,
        ...parsed,
        apiKey: envKey,
        useSimulation: false
      };

      // Se o iPhone ou navegador tiver guardado useSimulation: true, limpa e corrige imediatamente
      if (parsed.useSimulation !== false || parsed.apiKey !== envKey) {
        localStorage.setItem('arena_preferences', JSON.stringify(result));
        this.clearCache();
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

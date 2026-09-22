import type { TeamTheme } from '../types/theme';
import { DEFAULT_THEME } from '../types/theme';

export const POPULAR_TEAM_THEMES: TeamTheme[] = [
  // Nacionais
  {
    id: 127,
    name: 'Flamengo',
    shortName: 'CRF',
    primaryColor: '#e51a24',
    secondaryColor: '#121212',
    accentColor: '#ff4444',
    glowColor: 'rgba(229, 26, 36, 0.35)',
    badgeBorderColor: 'rgba(229, 26, 36, 0.6)'
  },
  {
    id: 121,
    name: 'Palmeiras',
    shortName: 'PAL',
    primaryColor: '#006437',
    secondaryColor: '#ffffff',
    accentColor: '#00e575',
    glowColor: 'rgba(0, 100, 55, 0.4)',
    badgeBorderColor: 'rgba(0, 100, 55, 0.6)'
  },
  {
    id: 131,
    name: 'Corinthians',
    shortName: 'SCCP',
    primaryColor: '#d4af37', // Dourado nobre sobre preto e branco
    secondaryColor: '#1a1a1a',
    accentColor: '#f1c40f',
    glowColor: 'rgba(212, 175, 55, 0.35)',
    badgeBorderColor: 'rgba(212, 175, 55, 0.5)'
  },
  {
    id: 126,
    name: 'São Paulo',
    shortName: 'SPFC',
    primaryColor: '#e50914',
    secondaryColor: '#111111',
    accentColor: '#ff2d37',
    glowColor: 'rgba(229, 9, 20, 0.35)',
    badgeBorderColor: 'rgba(229, 9, 20, 0.5)'
  },
  {
    id: 130,
    name: 'Grêmio',
    shortName: 'GRE',
    primaryColor: '#0d80bf',
    secondaryColor: '#111111',
    accentColor: '#29b6f6',
    glowColor: 'rgba(13, 128, 191, 0.4)',
    badgeBorderColor: 'rgba(13, 128, 191, 0.6)'
  },
  {
    id: 119,
    name: 'Internacional',
    shortName: 'INT',
    primaryColor: '#e50914',
    secondaryColor: '#ffffff',
    accentColor: '#ff3b30',
    glowColor: 'rgba(229, 9, 20, 0.4)',
    badgeBorderColor: 'rgba(229, 9, 20, 0.6)'
  },
  {
    id: 135,
    name: 'Cruzeiro',
    shortName: 'CRU',
    primaryColor: '#005ca9',
    secondaryColor: '#ffffff',
    accentColor: '#2196f3',
    glowColor: 'rgba(0, 92, 169, 0.4)',
    badgeBorderColor: 'rgba(0, 92, 169, 0.6)'
  },
  {
    id: 1062,
    name: 'Atlético-MG',
    shortName: 'CAM',
    primaryColor: '#f39c12',
    secondaryColor: '#1a1a1a',
    accentColor: '#f1c40f',
    glowColor: 'rgba(243, 156, 18, 0.35)',
    badgeBorderColor: 'rgba(243, 156, 18, 0.5)'
  },
  {
    id: 133,
    name: 'Vasco da Gama',
    shortName: 'VAS',
    primaryColor: '#e53935',
    secondaryColor: '#111111',
    accentColor: '#ffffff',
    glowColor: 'rgba(229, 57, 53, 0.35)',
    badgeBorderColor: 'rgba(229, 57, 53, 0.5)'
  },
  {
    id: 128,
    name: 'Santos',
    shortName: 'SAN',
    primaryColor: '#d4af37',
    secondaryColor: '#111111',
    accentColor: '#ffffff',
    glowColor: 'rgba(212, 175, 55, 0.35)',
    badgeBorderColor: 'rgba(212, 175, 55, 0.5)'
  },
  {
    id: 120,
    name: 'Botafogo',
    shortName: 'BOT',
    primaryColor: '#7f8c8d',
    secondaryColor: '#1a1a1a',
    accentColor: '#ffffff',
    glowColor: 'rgba(255, 255, 255, 0.25)',
    badgeBorderColor: 'rgba(255, 255, 255, 0.4)'
  },
  {
    id: 124,
    name: 'Fluminense',
    shortName: 'FLU',
    primaryColor: '#85002b',
    secondaryColor: '#006341',
    accentColor: '#00a86b',
    glowColor: 'rgba(133, 0, 43, 0.4)',
    badgeBorderColor: 'rgba(133, 0, 43, 0.6)'
  },
  {
    id: 118,
    name: 'Bahia',
    shortName: 'BAH',
    primaryColor: '#005bac',
    secondaryColor: '#e2001a',
    accentColor: '#0088ff',
    glowColor: 'rgba(0, 91, 172, 0.4)',
    badgeBorderColor: 'rgba(0, 91, 172, 0.6)'
  },
  {
    id: 154,
    name: 'Fortaleza',
    shortName: 'FOR',
    primaryColor: '#003399',
    secondaryColor: '#e50914',
    accentColor: '#3388ff',
    glowColor: 'rgba(0, 51, 153, 0.4)',
    badgeBorderColor: 'rgba(0, 51, 153, 0.6)'
  },

  // Internacionais
  {
    id: 541,
    name: 'Real Madrid',
    shortName: 'RMA',
    primaryColor: '#00529f',
    secondaryColor: '#fea600',
    accentColor: '#fea600',
    glowColor: 'rgba(0, 82, 159, 0.4)',
    badgeBorderColor: 'rgba(254, 166, 0, 0.6)'
  },
  {
    id: 529,
    name: 'Barcelona',
    shortName: 'BAR',
    primaryColor: '#a50044',
    secondaryColor: '#004d98',
    accentColor: '#edbb00',
    glowColor: 'rgba(165, 0, 68, 0.4)',
    badgeBorderColor: 'rgba(165, 0, 68, 0.6)'
  },
  {
    id: 50,
    name: 'Manchester City',
    shortName: 'MCI',
    primaryColor: '#6cabdd',
    secondaryColor: '#1c2c5b',
    accentColor: '#97c8f2',
    glowColor: 'rgba(108, 171, 221, 0.4)',
    badgeBorderColor: 'rgba(108, 171, 221, 0.6)'
  },
  {
    id: 40,
    name: 'Liverpool',
    shortName: 'LIV',
    primaryColor: '#c8102e',
    secondaryColor: '#00b2a9',
    accentColor: '#00b2a9',
    glowColor: 'rgba(200, 16, 46, 0.4)',
    badgeBorderColor: 'rgba(200, 16, 46, 0.6)'
  },
  {
    id: 42,
    name: 'Arsenal',
    shortName: 'ARS',
    primaryColor: '#db0007',
    secondaryColor: '#023474',
    accentColor: '#ff3338',
    glowColor: 'rgba(219, 0, 7, 0.4)',
    badgeBorderColor: 'rgba(219, 0, 7, 0.6)'
  },
  {
    id: 49,
    name: 'Chelsea',
    shortName: 'CHE',
    primaryColor: '#034694',
    secondaryColor: '#ee242c',
    accentColor: '#2b78d6',
    glowColor: 'rgba(3, 70, 148, 0.4)',
    badgeBorderColor: 'rgba(3, 70, 148, 0.6)'
  },
  {
    id: 85,
    name: 'Paris Saint-Germain',
    shortName: 'PSG',
    primaryColor: '#004170',
    secondaryColor: '#da291c',
    accentColor: '#e53935',
    glowColor: 'rgba(0, 65, 112, 0.4)',
    badgeBorderColor: 'rgba(0, 65, 112, 0.6)'
  },
  {
    id: 157,
    name: 'Bayern München',
    shortName: 'BAY',
    primaryColor: '#dc052d',
    secondaryColor: '#0066b2',
    accentColor: '#ff2d55',
    glowColor: 'rgba(220, 5, 45, 0.4)',
    badgeBorderColor: 'rgba(220, 5, 45, 0.6)'
  }
];

export const themeService = {
  // Procura tema por ID do time ou por nome aproximado
  findTeamTheme(teamIdOrName: number | string): TeamTheme | null {
    if (typeof teamIdOrName === 'number') {
      const byId = POPULAR_TEAM_THEMES.find(t => t.id === teamIdOrName);
      if (byId) return byId;
    }

    const clean = String(teamIdOrName).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const found = POPULAR_TEAM_THEMES.find(t => {
      const tClean = t.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      return clean.includes(tClean) || tClean.includes(clean);
    });

    return found || null;
  },

  // Retorna o tema ativo armazenado ou padrão
  getActiveTheme(): TeamTheme {
    try {
      const stored = localStorage.getItem('arena_team_theme');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Erro ao ler tema ativo:', e);
    }
    return DEFAULT_THEME;
  },

  // Aplica as propriedades CSS no elemento raiz (:root)
  applyTheme(theme: TeamTheme | null): void {
    const root = document.documentElement;
    const active = theme || DEFAULT_THEME;

    // Atualiza as variáveis CSS principais
    root.style.setProperty('--color-primary', active.primaryColor);
    root.style.setProperty('--color-primary-glow', active.glowColor);
    root.style.setProperty('--border-color-glow', active.glowColor);
    root.style.setProperty('--shadow-glow', `0 0 22px ${active.glowColor}`);

    if (active.accentColor) {
      root.style.setProperty('--color-accent', active.accentColor);
    } else {
      root.style.setProperty('--color-accent', '#ff7f66');
    }

    // Grava no localStorage
    if (theme && theme.name !== DEFAULT_THEME.name) {
      localStorage.setItem('arena_team_theme', JSON.stringify(theme));
      root.setAttribute('data-team-active', 'true');
    } else {
      localStorage.removeItem('arena_team_theme');
      root.removeAttribute('data-team-active');
    }

    // Dispara evento customizado para os componentes do React reagirem
    window.dispatchEvent(new CustomEvent('teamThemeChanged', { detail: active }));
  },

  // Redefine para o visual original Arena
  resetToDefault(): void {
    this.applyTheme(DEFAULT_THEME);
  },

  // Inicializa o tema salvo ao abrir a aplicação
  initializeTheme(): void {
    const active = this.getActiveTheme();
    this.applyTheme(active);
  }
};

import type { TeamTheme } from '../types/theme';
import { DEFAULT_THEME } from '../types/theme';

export const POPULAR_TEAM_THEMES: TeamTheme[] = [
  // --- SELEÇÕES NACIONAIS ---
  {
    id: 6,
    name: 'Brasil',
    shortName: 'BRA',
    primaryColor: '#009c3b', // Verde Canarinho
    secondaryColor: '#ffdf00', // Amarelo
    accentColor: '#ffdf00',
    glowColor: 'rgba(0, 156, 59, 0.45)',
    badgeBorderColor: 'rgba(255, 223, 0, 0.7)'
  },
  {
    id: 20,
    name: 'Australia',
    shortName: 'AUS',
    primaryColor: '#00843d', // Verde Socceroos
    secondaryColor: '#ffcd00', // Dourado
    accentColor: '#ffcd00',
    glowColor: 'rgba(0, 132, 61, 0.45)',
    badgeBorderColor: 'rgba(255, 205, 0, 0.7)'
  },
  {
    id: 26,
    name: 'Argentina',
    shortName: 'ARG',
    primaryColor: '#75aadb', // Azul Celeste
    secondaryColor: '#ffffff',
    accentColor: '#f6b40e',
    glowColor: 'rgba(117, 170, 219, 0.45)',
    badgeBorderColor: 'rgba(117, 170, 219, 0.7)'
  },
  {
    id: 2,
    name: 'França',
    shortName: 'FRA',
    primaryColor: '#002395', // Azul Bleus
    secondaryColor: '#ed2939',
    accentColor: '#ed2939',
    glowColor: 'rgba(0, 35, 149, 0.45)',
    badgeBorderColor: 'rgba(237, 41, 57, 0.7)'
  },
  {
    id: 27,
    name: 'Portugal',
    shortName: 'POR',
    primaryColor: '#da291c', // Vermelho das Quinas
    secondaryColor: '#006600',
    accentColor: '#ffe900',
    glowColor: 'rgba(218, 41, 28, 0.45)',
    badgeBorderColor: 'rgba(255, 233, 0, 0.7)'
  },
  {
    id: 10,
    name: 'Inglaterra',
    shortName: 'ENG',
    primaryColor: '#ce1124', // Vermelho Three Lions
    secondaryColor: '#00247d',
    accentColor: '#ffffff',
    glowColor: 'rgba(206, 17, 36, 0.45)',
    badgeBorderColor: 'rgba(0, 36, 125, 0.7)'
  },
  {
    id: 25,
    name: 'Alemanha',
    shortName: 'GER',
    primaryColor: '#e0a912', // Ouro e Preto nobre
    secondaryColor: '#000000',
    accentColor: '#dd0000',
    glowColor: 'rgba(224, 169, 18, 0.45)',
    badgeBorderColor: 'rgba(221, 0, 0, 0.7)'
  },
  {
    id: 9,
    name: 'Espanha',
    shortName: 'ESP',
    primaryColor: '#c60b1e', // Vermelho La Roja
    secondaryColor: '#ffc400',
    accentColor: '#ffc400',
    glowColor: 'rgba(198, 11, 30, 0.45)',
    badgeBorderColor: 'rgba(255, 196, 0, 0.7)'
  },
  {
    id: 768,
    name: 'Itália',
    shortName: 'ITA',
    primaryColor: '#004d98', // Azzurra
    secondaryColor: '#ffffff',
    accentColor: '#008c45',
    glowColor: 'rgba(0, 77, 152, 0.45)',
    badgeBorderColor: 'rgba(0, 140, 69, 0.7)'
  },
  {
    id: 7,
    name: 'Uruguai',
    shortName: 'URU',
    primaryColor: '#5ba4e5', // Celeste
    secondaryColor: '#ffffff',
    accentColor: '#fcd116',
    glowColor: 'rgba(91, 164, 229, 0.45)',
    badgeBorderColor: 'rgba(252, 209, 22, 0.7)'
  },
  {
    id: 1118,
    name: 'Holanda',
    shortName: 'NED',
    primaryColor: '#f36c21', // Laranja Oranje
    secondaryColor: '#ffffff',
    accentColor: '#21468b',
    glowColor: 'rgba(243, 108, 33, 0.45)',
    badgeBorderColor: 'rgba(33, 70, 139, 0.7)'
  },
  {
    id: 24,
    name: 'Polônia',
    shortName: 'POL',
    primaryColor: '#dc143c', // Vermelho Polonês
    secondaryColor: '#ffffff',
    accentColor: '#ffffff',
    glowColor: 'rgba(220, 20, 60, 0.45)',
    badgeBorderColor: 'rgba(255, 255, 255, 0.7)'
  },
  {
    id: 770,
    name: 'República Tcheca',
    shortName: 'CZE',
    primaryColor: '#11457e',
    secondaryColor: '#d7141a',
    accentColor: '#ffffff',
    glowColor: 'rgba(17, 69, 126, 0.45)',
    badgeBorderColor: 'rgba(215, 20, 26, 0.7)'
  },
  {
    id: 12,
    name: 'Japão',
    shortName: 'JPN',
    primaryColor: '#001e62', // Azul Samurai
    secondaryColor: '#e4002b',
    accentColor: '#ffffff',
    glowColor: 'rgba(0, 30, 98, 0.45)',
    badgeBorderColor: 'rgba(228, 0, 43, 0.7)'
  },
  {
    id: 3,
    name: 'Croácia',
    shortName: 'CRO',
    primaryColor: '#ff142e',
    secondaryColor: '#003893',
    accentColor: '#ffffff',
    glowColor: 'rgba(255, 20, 46, 0.45)',
    badgeBorderColor: 'rgba(0, 56, 147, 0.7)'
  },

  // --- CLUBES BRASILEIROS ---
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
    primaryColor: '#d4af37',
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
  {
    id: 134,
    name: 'Athletico-PR',
    shortName: 'CAP',
    primaryColor: '#c60018',
    secondaryColor: '#111111',
    accentColor: '#ff2d3b',
    glowColor: 'rgba(198, 0, 24, 0.4)',
    badgeBorderColor: 'rgba(198, 0, 24, 0.6)'
  },
  {
    id: 147,
    name: 'Red Bull Bragantino',
    shortName: 'RBB',
    primaryColor: '#d6001c',
    secondaryColor: '#ffffff',
    accentColor: '#ff334b',
    glowColor: 'rgba(214, 0, 28, 0.4)',
    badgeBorderColor: 'rgba(214, 0, 28, 0.6)'
  },

  // --- CLUBES INTERNACIONAIS ---
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
    id: 33,
    name: 'Manchester United',
    shortName: 'MUN',
    primaryColor: '#da291c',
    secondaryColor: '#ffe500',
    accentColor: '#ff4d3d',
    glowColor: 'rgba(218, 41, 28, 0.4)',
    badgeBorderColor: 'rgba(218, 41, 28, 0.6)'
  },
  {
    id: 47,
    name: 'Tottenham',
    shortName: 'TOT',
    primaryColor: '#132257',
    secondaryColor: '#ffffff',
    accentColor: '#3b5bb5',
    glowColor: 'rgba(19, 34, 87, 0.4)',
    badgeBorderColor: 'rgba(59, 91, 181, 0.6)'
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
  },
  {
    id: 165,
    name: 'Borussia Dortmund',
    shortName: 'BVB',
    primaryColor: '#fde100',
    secondaryColor: '#000000',
    accentColor: '#ffe733',
    glowColor: 'rgba(253, 225, 0, 0.4)',
    badgeBorderColor: 'rgba(253, 225, 0, 0.6)'
  },
  {
    id: 496,
    name: 'Juventus',
    shortName: 'JUV',
    primaryColor: '#d4af37',
    secondaryColor: '#111111',
    accentColor: '#ffffff',
    glowColor: 'rgba(212, 175, 55, 0.35)',
    badgeBorderColor: 'rgba(212, 175, 55, 0.6)'
  },
  {
    id: 505,
    name: 'Inter',
    shortName: 'INT',
    primaryColor: '#0068a8',
    secondaryColor: '#000000',
    accentColor: '#2bb3ff',
    glowColor: 'rgba(0, 104, 168, 0.4)',
    badgeBorderColor: 'rgba(0, 104, 168, 0.6)'
  },
  {
    id: 489,
    name: 'Milan',
    shortName: 'MIL',
    primaryColor: '#fb090b',
    secondaryColor: '#000000',
    accentColor: '#ff4d4f',
    glowColor: 'rgba(251, 9, 11, 0.4)',
    badgeBorderColor: 'rgba(251, 9, 11, 0.6)'
  },
  {
    id: 530,
    name: 'Atlético de Madrid',
    shortName: 'ATM',
    primaryColor: '#cb3524',
    secondaryColor: '#272e61',
    accentColor: '#272e61',
    glowColor: 'rgba(203, 53, 36, 0.4)',
    badgeBorderColor: 'rgba(39, 46, 97, 0.6)'
  },
  {
    id: 211,
    name: 'Benfica',
    shortName: 'SLB',
    primaryColor: '#e30613',
    secondaryColor: '#ffffff',
    accentColor: '#ff404d',
    glowColor: 'rgba(227, 6, 19, 0.4)',
    badgeBorderColor: 'rgba(227, 6, 19, 0.6)'
  },
  {
    id: 212,
    name: 'Porto',
    shortName: 'FCP',
    primaryColor: '#003893',
    secondaryColor: '#ffffff',
    accentColor: '#2b78d6',
    glowColor: 'rgba(0, 56, 147, 0.4)',
    badgeBorderColor: 'rgba(0, 56, 147, 0.6)'
  },
  {
    id: 228,
    name: 'Sporting',
    shortName: 'SCP',
    primaryColor: '#008057',
    secondaryColor: '#ffffff',
    accentColor: '#00b37a',
    glowColor: 'rgba(0, 128, 87, 0.4)',
    badgeBorderColor: 'rgba(0, 128, 87, 0.6)'
  },
  {
    id: 1600,
    name: 'Inter Miami',
    shortName: 'MIA',
    primaryColor: '#f7b5cd',
    secondaryColor: '#231f20',
    accentColor: '#ff8fb3',
    glowColor: 'rgba(247, 181, 205, 0.45)',
    badgeBorderColor: 'rgba(247, 181, 205, 0.7)'
  },
  {
    id: 1017,
    name: 'Al-Hilal',
    shortName: 'HIL',
    primaryColor: '#0054a6',
    secondaryColor: '#ffffff',
    accentColor: '#2888e8',
    glowColor: 'rgba(0, 84, 166, 0.45)',
    badgeBorderColor: 'rgba(0, 84, 166, 0.7)'
  },
  {
    id: 1019,
    name: 'Al-Nassr',
    shortName: 'NAS',
    primaryColor: '#f7d002',
    secondaryColor: '#004282',
    accentColor: '#004282',
    glowColor: 'rgba(247, 208, 2, 0.45)',
    badgeBorderColor: 'rgba(0, 66, 130, 0.7)'
  },
  {
    id: 451,
    name: 'Boca Juniors',
    shortName: 'BOC',
    primaryColor: '#003366',
    secondaryColor: '#fcb026',
    accentColor: '#fcb026',
    glowColor: 'rgba(0, 51, 102, 0.45)',
    badgeBorderColor: 'rgba(252, 176, 38, 0.7)'
  },
  {
    id: 435,
    name: 'River Plate',
    shortName: 'RIV',
    primaryColor: '#eb1923',
    secondaryColor: '#ffffff',
    accentColor: '#ff4d56',
    glowColor: 'rgba(235, 25, 35, 0.45)',
    badgeBorderColor: 'rgba(235, 25, 35, 0.7)'
  }
];

function normalizeTeamStr(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    // Remove sufixos como U17, U20, Sub-17, Feminino, FC, etc.
    .replace(/\b(u-?17|u-?20|u-?23|sub-?17|sub-?20|sub-?23|women|feminino|fem|masculino|fc|ec|sc|cr|ac|cf)\b/g, '')
    .replace(/[^a-z0-9]/g, ' ')
    .trim();
}

export const themeService = {
  // Procura tema por ID do time ou por nome aproximado
  findTeamTheme(teamInput: { id?: number; name?: string } | number | string): TeamTheme | null {
    let teamId: number | undefined;
    let teamName: string | undefined;

    if (typeof teamInput === 'object' && teamInput !== null) {
      teamId = teamInput.id;
      teamName = teamInput.name;
    } else if (typeof teamInput === 'number') {
      teamId = teamInput;
    } else if (typeof teamInput === 'string') {
      teamName = teamInput;
    }

    if (teamId) {
      const byId = POPULAR_TEAM_THEMES.find(t => t.id === teamId);
      if (byId) return byId;
    }

    if (teamName) {
      const clean = normalizeTeamStr(teamName);
      if (!clean) return null;

      // 1. Busca exata ou por includes após normalização
      const found = POPULAR_TEAM_THEMES.find(t => {
        const tClean = normalizeTeamStr(t.name);
        return clean === tClean || clean.includes(tClean) || tClean.includes(clean);
      });
      if (found) return found;

      // 2. Busca por shortName (ex: BRA, AUS)
      const foundShort = POPULAR_TEAM_THEMES.find(t => {
        return clean.toUpperCase() === t.shortName.toUpperCase();
      });
      if (foundShort) return foundShort;
    }

    return null;
  },

  // Gera dinamicamente um tema premium e vibrante para qualquer time do mundo que não esteja na lista fixa
  generateDynamicTheme(teamInput: { id?: number; name: string; logo?: string } | string | number): TeamTheme {
    const rawName = typeof teamInput === 'object' ? teamInput.name : String(teamInput);
    const id = typeof teamInput === 'object' ? teamInput.id : (typeof teamInput === 'number' ? teamInput : undefined);
    const name = rawName || 'Time';

    // Gera um hue vibrante de 0 a 359 determinístico
    let hash = 0;
    const seed = name.toLowerCase().trim();
    for (let i = 0; i < seed.length; i++) {
      hash = (hash << 5) - hash + seed.charCodeAt(i);
      hash |= 0;
    }
    const hue = Math.abs(hash) % 360;
    
    // Cores equilibradas para dark mode esportivo
    const primaryColor = `hsl(${hue}, 82%, 52%)`;
    const accentColor = `hsl(${(hue + 38) % 360}, 92%, 58%)`;
    const glowColor = `hsla(${hue}, 82%, 52%, 0.4)`;
    const badgeBorderColor = `hsla(${hue}, 82%, 52%, 0.65)`;

    // Extrai sigla limpa
    const words = name.replace(/[^a-zA-Z0-9\s]/g, '').trim().split(/\s+/).filter(Boolean);
    let shortName = '';
    if (words.length >= 3) {
      shortName = words.slice(0, 3).map(w => w[0]).join('').toUpperCase();
    } else if (words.length === 2) {
      shortName = (words[0].slice(0, 2) + words[1][0]).toUpperCase();
    } else if (words.length === 1 && words[0].length >= 3) {
      shortName = words[0].slice(0, 3).toUpperCase();
    } else {
      shortName = name.slice(0, 3).toUpperCase();
    }

    return {
      id,
      name,
      shortName,
      primaryColor,
      secondaryColor: '#ffffff',
      accentColor,
      glowColor,
      badgeBorderColor
    };
  },

  // Retorna tema existente ou gera dinamicamente (garantindo 100% de sucesso para qualquer partida)
  resolveTeamTheme(teamInput: { id?: number; name: string; logo?: string } | string | number): TeamTheme {
    const found = this.findTeamTheme(teamInput);
    if (found) return found;
    return this.generateDynamicTheme(teamInput);
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
    root.style.setProperty('--shadow-glow', `0 0 24px ${active.glowColor}`);

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

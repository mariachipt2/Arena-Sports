export interface TeamTheme {
  id?: number;
  name: string;
  shortName: string;
  primaryColor: string;       // Cor principal do time (ex: #C62828 para Flamengo, #006437 para Palmeiras)
  secondaryColor?: string;     // Cor secundária de apoio
  accentColor?: string;        // Cor de acento vibrante
  glowColor: string;           // Cor em rgba para sombras e efeitos de iluminação
  badgeBorderColor?: string;
}

export const DEFAULT_THEME: TeamTheme = {
  name: 'Arena Scores Padrão',
  shortName: 'Arena',
  primaryColor: '#9d7cfc',     // Lavanda Elétrica original
  secondaryColor: '#ff7f66',   // Coral Vibrante
  accentColor: '#ff7f66',
  glowColor: 'rgba(157, 124, 252, 0.25)',
  badgeBorderColor: 'rgba(157, 124, 252, 0.4)'
};

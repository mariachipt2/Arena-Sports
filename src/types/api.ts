// Definições de tipos correspondentes ao retorno da API-Football (v3)

export interface Team {
  id: number;
  name: string;
  logo: string;
  winner: boolean | null;
}

export interface League {
  id: number;
  name: string;
  country: string;
  logo: string;
  flag: string | null;
  season: number;
  round?: string;
}

export interface FixtureStatus {
  long: string;   // ex: "Active", "Match Finished", "Not Started"
  short: string;  // ex: "1H", "2H", "HT", "FT", "NS", "PST"
  elapsed: number | null; // Minutos decorridos
}

export interface FixtureInfo {
  id: number;
  referee: string | null;
  timezone: string;
  date: string;       // ISO String
  timestamp: number;
  status: FixtureStatus;
}

export interface MatchGoals {
  home: number | null;
  away: number | null;
}

export interface MatchScoreDetail {
  halftime: MatchGoals;
  fulltime: MatchGoals;
  extratime: MatchGoals;
  penalty: MatchGoals;
}

export interface ApiFixture {
  fixture: FixtureInfo;
  league: League;
  teams: {
    home: Team;
    away: Team;
  };
  goals: MatchGoals;
  score: MatchScoreDetail;
  events?: MatchEvent[];
  lineups?: MatchLineup[];
  statistics?: MatchStatistics[];
  summary?: string; // Resumo da Ópera
}

export interface MatchEvent {
  time: {
    elapsed: number;
    extra: number | null;
  };
  team: {
    id: number;
    name: string;
    logo: string;
  };
  player: {
    id: number;
    name: string;
  };
  assist: {
    id: number | null;
    name: string | null;
  } | null;
  type: 'Goal' | 'Card' | 'subst' | 'Var'; // Tipos padrão da API-Football
  detail: string; // ex: "Normal Goal", "Yellow Card", "Substitution 1", "Goal disallowed"
  comments: string | null;
}

export interface LineupPlayer {
  player: {
    id: number;
    name: string;
    number: number;
    pos: 'G' | 'D' | 'M' | 'F'; // Goalkeeper, Defender, Midfielder, Forward
    grid: string | null; // ex: "1:1", "2:4" (linha:coluna para desenho tático)
  };
}

export interface MatchLineup {
  team: {
    id: number;
    name: string;
    logo: string;
    colors: {
      player: { primary: string; number: string; border: string } | null;
      goalkeeper: { primary: string; number: string; border: string } | null;
    } | null;
  };
  coach: {
    id: number | null;
    name: string;
  };
  formation: string; // ex: "4-3-3", "4-4-2"
  startXI: LineupPlayer[];
  substitutes: LineupPlayer[];
}

export interface StatItem {
  type: string; // ex: "Ball Possession", "Total Shots", "Fouls", "Corner Kicks"
  value: string | number | null;
}

export interface MatchStatistics {
  team: {
    id: number;
    name: string;
    logo: string;
  };
  statistics: StatItem[];
}

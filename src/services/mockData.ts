import type { ApiFixture, MatchLineup, MatchStatistics } from '../types/api';

// Armazena as partidas ao vivo simuladas em memória para manter o estado persistente durante a sessão
let simulatedLiveMatches: ApiFixture[] = [];

// Lista estática de partidas passadas (encerradas)
const mockFinishedMatches: ApiFixture[] = [
  {
    fixture: {
      id: 9901,
      referee: "Wilton Pereira Sampaio",
      timezone: "America/Sao_Paulo",
      date: new Date(Date.now() - 3 * 3600 * 1000).toISOString(), // 3 horas atrás
      timestamp: Math.floor((Date.now() - 3 * 3600 * 1000) / 1000),
      status: { long: "Match Finished", short: "FT", elapsed: 90 }
    },
    league: { id: 71, name: "Brasileirão Série A", country: "Brazil", logo: "https://media.api-sports.io/football/leagues/71.png", flag: "https://media.api-sports.io/flags/br.svg", season: 2026 },
    teams: {
      home: { id: 131, name: "Corinthians", logo: "https://media.api-sports.io/football/teams/131.png", winner: true },
      away: { id: 126, name: "São Paulo", logo: "https://media.api-sports.io/football/teams/126.png", winner: false }
    },
    goals: { home: 2, away: 1 },
    score: {
      halftime: { home: 1, away: 0 },
      fulltime: { home: 2, away: 1 },
      extratime: { home: null, away: null },
      penalty: { home: null, away: null }
    }
  },
  {
    fixture: {
      id: 9902,
      referee: "Michael Oliver",
      timezone: "Europe/London",
      date: new Date(Date.now() - 24 * 3600 * 1000).toISOString(), // Ontem
      timestamp: Math.floor((Date.now() - 24 * 3600 * 1000) / 1000),
      status: { long: "Match Finished", short: "FT", elapsed: 90 }
    },
    league: { id: 39, name: "Premier League", country: "England", logo: "https://media.api-sports.io/football/leagues/39.png", flag: "https://media.api-sports.io/flags/gb.svg", season: 2026 },
    teams: {
      home: { id: 40, name: "Liverpool", logo: "https://media.api-sports.io/football/teams/40.png", winner: null },
      away: { id: 50, name: "Manchester City", logo: "https://media.api-sports.io/football/teams/50.png", winner: null }
    },
    goals: { home: 2, away: 2 },
    score: {
      halftime: { home: 0, away: 1 },
      fulltime: { home: 2, away: 2 },
      extratime: { home: null, away: null },
      penalty: { home: null, away: null }
    }
  }
];

// Função geradora de próximas partidas (agendadas com horários dinâmicos)
const getUpcomingMatchesList = (): ApiFixture[] => [
  {
    fixture: {
      id: 9907,
      referee: "Wilton Pereira Sampaio",
      timezone: "America/Sao_Paulo",
      date: new Date(Date.now() + 2.5 * 3600 * 1000).toISOString(), // Hoje à noite (2h30 à frente)
      timestamp: Math.floor((Date.now() + 2.5 * 3600 * 1000) / 1000),
      status: { long: "Not Started", short: "NS", elapsed: null }
    },
    league: { id: 71, name: "Brasileirão Série A", country: "Brazil", logo: "https://media.api-sports.io/football/leagues/71.png", flag: "https://media.api-sports.io/flags/br.svg", season: 2026 },
    teams: {
      home: { id: 135, name: "Cruzeiro", logo: "https://media.api-sports.io/football/teams/135.png", winner: null },
      away: { id: 1062, name: "Atlético-MG", logo: "https://media.api-sports.io/football/teams/1062.png", winner: null }
    },
    goals: { home: null, away: null },
    score: {
      halftime: { home: null, away: null },
      fulltime: { home: null, away: null },
      extratime: { home: null, away: null },
      penalty: { home: null, away: null }
    }
  },
  {
    fixture: {
      id: 9903,
      referee: "Raphael Claus",
      timezone: "America/Sao_Paulo",
      date: new Date(Date.now() + 4 * 3600 * 1000).toISOString(), // Hoje mais tarde
      timestamp: Math.floor((Date.now() + 4 * 3600 * 1000) / 1000),
      status: { long: "Not Started", short: "NS", elapsed: null }
    },
    league: { id: 71, name: "Brasileirão Série A", country: "Brazil", logo: "https://media.api-sports.io/football/leagues/71.png", flag: "https://media.api-sports.io/flags/br.svg", season: 2026 },
    teams: {
      home: { id: 121, name: "Palmeiras", logo: "https://media.api-sports.io/football/teams/121.png", winner: null },
      away: { id: 127, name: "Flamengo", logo: "https://media.api-sports.io/football/teams/127.png", winner: null }
    },
    goals: { home: null, away: null },
    score: {
      halftime: { home: null, away: null },
      fulltime: { home: null, away: null },
      extratime: { home: null, away: null },
      penalty: { home: null, away: null }
    }
  },
  {
    fixture: {
      id: 9904,
      referee: "Anthony Taylor",
      timezone: "Europe/London",
      date: new Date(Date.now() + 6 * 3600 * 1000).toISOString(), // Hoje
      timestamp: Math.floor((Date.now() + 6 * 3600 * 1000) / 1000),
      status: { long: "Not Started", short: "NS", elapsed: null }
    },
    league: { id: 39, name: "Premier League", country: "England", logo: "https://media.api-sports.io/football/leagues/39.png", flag: "https://media.api-sports.io/flags/gb.svg", season: 2026 },
    teams: {
      home: { id: 50, name: "Manchester City", logo: "https://media.api-sports.io/football/teams/50.png", winner: null },
      away: { id: 42, name: "Arsenal", logo: "https://media.api-sports.io/football/teams/42.png", winner: null }
    },
    goals: { home: null, away: null },
    score: {
      halftime: { home: null, away: null },
      fulltime: { home: null, away: null },
      extratime: { home: null, away: null },
      penalty: { home: null, away: null }
    }
  },
  {
    fixture: {
      id: 9905,
      referee: "Anderson Daronco",
      timezone: "America/Sao_Paulo",
      date: new Date(Date.now() + 26 * 3600 * 1000).toISOString(), // Amanhã
      timestamp: Math.floor((Date.now() + 26 * 3600 * 1000) / 1000),
      status: { long: "Not Started", short: "NS", elapsed: null }
    },
    league: { id: 73, name: "Copa do Brasil", country: "Brazil", logo: "https://media.api-sports.io/football/leagues/73.png", flag: "https://media.api-sports.io/flags/br.svg", season: 2026 },
    teams: {
      home: { id: 119, name: "Internacional", logo: "https://media.api-sports.io/football/teams/119.png", winner: null },
      away: { id: 120, name: "Botafogo", logo: "https://media.api-sports.io/football/teams/120.png", winner: null }
    },
    goals: { home: null, away: null },
    score: {
      halftime: { home: null, away: null },
      fulltime: { home: null, away: null },
      extratime: { home: null, away: null },
      penalty: { home: null, away: null }
    }
  },
  {
    fixture: {
      id: 9906,
      referee: "Clement Turpin",
      timezone: "Europe/Madrid",
      date: new Date(Date.now() + 30 * 3600 * 1000).toISOString(), // Amanhã
      timestamp: Math.floor((Date.now() + 30 * 3600 * 1000) / 1000),
      status: { long: "Not Started", short: "NS", elapsed: null }
    },
    league: { id: 2, name: "UEFA Champions League", country: "Europe", logo: "https://media.api-sports.io/football/leagues/2.png", flag: "https://media.api-sports.io/flags/eu.svg", season: 2026 },
    teams: {
      home: { id: 541, name: "Real Madrid", logo: "https://media.api-sports.io/football/teams/541.png", winner: null },
      away: { id: 529, name: "Barcelona", logo: "https://media.api-sports.io/football/teams/529.png", winner: null }
    },
    goals: { home: null, away: null },
    score: {
      halftime: { home: null, away: null },
      fulltime: { home: null, away: null },
      extratime: { home: null, away: null },
      penalty: { home: null, away: null }
    }
  }
];

// Inicializa as partidas simuladas ao vivo se vazias
const initializeLiveMatches = () => {
  if (simulatedLiveMatches.length > 0) return;

  simulatedLiveMatches = [
    {
      fixture: {
        id: 9801,
        referee: "Daronco Master",
        timezone: "America/Sao_Paulo",
        date: new Date(Date.now() - 35 * 60 * 1000).toISOString(), // Iniciou há 35 minutos
        timestamp: Math.floor((Date.now() - 35 * 60 * 1000) / 1000),
        status: { long: "First Half", short: "1H", elapsed: 35 }
      },
      league: { id: 71, name: "Brasileirão Série A", country: "Brazil", logo: "https://media.api-sports.io/football/leagues/71.png", flag: "https://media.api-sports.io/flags/br.svg", season: 2026 },
      teams: {
        home: { id: 127, name: "Flamengo", logo: "https://media.api-sports.io/football/teams/127.png", winner: null },
        away: { id: 121, name: "Palmeiras", logo: "https://media.api-sports.io/football/teams/121.png", winner: null }
      },
      goals: { home: 1, away: 0 },
      score: {
        halftime: { home: null, away: null },
        fulltime: { home: null, away: null },
        extratime: { home: null, away: null },
        penalty: { home: null, away: null }
      },
      events: [
        {
          time: { elapsed: 14, extra: null },
          team: { id: 127, name: "Flamengo", logo: "https://media.api-sports.io/football/teams/127.png" },
          player: { id: 101, name: "Pedro" },
          assist: { id: 102, name: "Gerson" },
          type: "Goal",
          detail: "Normal Goal",
          comments: null
        },
        {
          time: { elapsed: 28, extra: null },
          team: { id: 121, name: "Palmeiras", logo: "https://media.api-sports.io/football/teams/121.png" },
          player: { id: 201, name: "Gustavo Gómez" },
          assist: null,
          type: "Card",
          detail: "Yellow Card",
          comments: "Foul"
        }
      ]
    },
    {
      fixture: {
        id: 9802,
        referee: "Szymon Marciniak",
        timezone: "Europe/Madrid",
        date: new Date(Date.now() - 72 * 60 * 1000).toISOString(), // Iniciou há 72 minutos (segundo tempo)
        timestamp: Math.floor((Date.now() - 72 * 60 * 1000) / 1000),
        status: { long: "Second Half", short: "2H", elapsed: 67 } // 72min - 15min de intervalo = 57min na verdade, mas o elapsed representará ~67'
      },
      league: { id: 2, name: "UEFA Champions League", country: "Europe", logo: "https://media.api-sports.io/football/leagues/2.png", flag: "https://media.api-sports.io/flags/eu.svg", season: 2026 },
      teams: {
        home: { id: 541, name: "Real Madrid", logo: "https://media.api-sports.io/football/teams/541.png", winner: null },
        away: { id: 529, name: "Barcelona", logo: "https://media.api-sports.io/football/teams/529.png", winner: null }
      },
      goals: { home: 2, away: 2 },
      score: {
        halftime: { home: 1, away: 2 },
        fulltime: { home: null, away: null },
        extratime: { home: null, away: null },
        penalty: { home: null, away: null }
      },
      events: [
        {
          time: { elapsed: 12, extra: null },
          team: { id: 529, name: "Barcelona", logo: "https://media.api-sports.io/football/teams/529.png" },
          player: { id: 301, name: "Robert Lewandowski" },
          assist: { id: 302, name: "Raphinha" },
          type: "Goal",
          detail: "Normal Goal",
          comments: null
        },
        {
          time: { elapsed: 22, extra: null },
          team: { id: 541, name: "Real Madrid", logo: "https://media.api-sports.io/football/teams/541.png" },
          player: { id: 401, name: "Vinícius Júnior" },
          assist: { id: 402, name: "Jude Bellingham" },
          type: "Goal",
          detail: "Normal Goal",
          comments: null
        },
        {
          time: { elapsed: 39, extra: null },
          team: { id: 529, name: "Barcelona", logo: "https://media.api-sports.io/football/teams/529.png" },
          player: { id: 303, name: "Lamine Yamal" },
          assist: null,
          type: "Goal",
          detail: "Normal Goal",
          comments: null
        },
        {
          time: { elapsed: 58, extra: null },
          team: { id: 541, name: "Real Madrid", logo: "https://media.api-sports.io/football/teams/541.png" },
          player: { id: 403, name: "Kylian Mbappé" },
          assist: { id: 401, name: "Vinícius Júnior" },
          type: "Goal",
          detail: "Normal Goal",
          comments: null
        }
      ]
    }
  ];
};

// Atualiza o estado da simulação (cronômetro corre, gols/eventos ocorrem aleatoriamente)
export const updateSimulation = () => {
  initializeLiveMatches();

  simulatedLiveMatches = simulatedLiveMatches.map(match => {
    const elapsed = match.fixture.status.elapsed || 0;
    
    // Se o jogo acabou ou passou de 90, mantém fixo
    if (elapsed >= 90) {
      return {
        ...match,
        fixture: {
          ...match.fixture,
          status: { long: "Match Finished", short: "FT", elapsed: 90 }
        }
      };
    }

    const nextElapsed = elapsed + 1;
    let nextStatus = match.fixture.status;
    let homeGoals = match.goals.home || 0;
    let awayGoals = match.goals.away || 0;
    const events = [...(match.events || [])];

    // Atualiza status baseado no tempo decorrido
    if (nextElapsed === 45) {
      nextStatus = { long: "Halftime", short: "HT", elapsed: 45 };
    } else if (nextElapsed > 45 && nextElapsed <= 46 && match.fixture.status.short === "HT") {
      nextStatus = { long: "Second Half", short: "2H", elapsed: 46 };
    } else {
      nextStatus = {
        ...match.fixture.status,
        elapsed: nextElapsed
      };
    }

    // Só gera eventos de jogo se o jogo estiver rodando (1H ou 2H) e não no intervalo HT
    if (match.fixture.status.short !== "HT") {
      const rand = Math.random();

      // 1.5% de chance de gol por minuto
      if (rand < 0.015) {
        const isHome = Math.random() > 0.5;
        const scoringTeam = isHome ? match.teams.home : match.teams.away;
        const player = isHome 
          ? (match.teams.home.name === "Flamengo" ? "Pedro" : "Vinícius Júnior")
          : (match.teams.away.name === "Palmeiras" ? "Raphael Veiga" : "Raphinha");
        
        if (isHome) homeGoals++; else awayGoals++;

        events.push({
          time: { elapsed: nextElapsed, extra: null },
          team: { id: scoringTeam.id, name: scoringTeam.name, logo: scoringTeam.logo },
          player: { id: Math.floor(Math.random() * 1000), name: player },
          assist: null,
          type: "Goal",
          detail: "Normal Goal",
          comments: null
        });

        // Dispara uma vibração no navegador (se disponível) para indicar Gol
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          navigator.vibrate([200, 100, 200]);
        }
      } 
      // 2% de chance de cartão
      else if (rand < 0.035) {
        const isHome = Math.random() > 0.5;
        const cardTeam = isHome ? match.teams.home : match.teams.away;
        const player = isHome
          ? (match.teams.home.name === "Flamengo" ? "Léo Ortiz" : "Militão")
          : (match.teams.away.name === "Palmeiras" ? "Richard Ríos" : "Pedri");
        
        events.push({
          time: { elapsed: nextElapsed, extra: null },
          team: { id: cardTeam.id, name: cardTeam.name, logo: cardTeam.logo },
          player: { id: Math.floor(Math.random() * 1000), name: player },
          assist: null,
          type: "Card",
          detail: Math.random() > 0.9 ? "Red Card" : "Yellow Card",
          comments: "Tactical foul"
        });
      }
    }

    return {
      ...match,
      fixture: {
        ...match.fixture,
        status: nextStatus
      },
      goals: { home: homeGoals, away: awayGoals },
      events
    };
  });
};

const getMatchSummary = (homeName: string, awayName: string, homeGoals: number | null, awayGoals: number | null, status: string): string => {
  const hG = homeGoals ?? 0;
  const aG = awayGoals ?? 0;

  if (status === 'FT') {
    if (hG === aG) {
      return `Clássico tenso que terminou em empate por ${hG} a ${aG}. Duelo tático muito estudado por ambos os lados.`;
    }
    const winner = hG > aG ? homeName : awayName;
    return `Partida encerrada com vitória importante do ${winner}. O jogo foi marcado por grande intensidade tática e lances decisivos.`;
  }

  if (status === 'NS') {
    return `Expectativa de grande confronto. O ${homeName} recebe o ${awayName} em casa para um duelo chave na rodada do campeonato.`;
  }

  // Resumos Dinâmicos Ao Vivo
  if (homeName === 'Flamengo' && awayName === 'Palmeiras') {
    if (hG > aG) {
      return `🔴 O Flamengo abriu o placar e está dominando as ações no meio de campo com passes rápidos de Gerson e Arrascaeta. O Palmeiras tenta se defender e aguarda uma bola aérea para contra-atacar.`;
    }
    if (aG > hG) {
      return `🟢 O Palmeiras surpreendeu e está à frente. A equipe de Abel Ferreira compactou a marcação e está explorando muito bem os contra-ataques rápidos pelas alas.`;
    }
    return `⚪ Jogo muito tenso e disputado em alto nível. O Flamengo mantém mais a posse de bola no ataque, enquanto o Palmeiras preenche muito bem os espaços na defesa.`;
  }

  if (homeName === 'Real Madrid' && awayName === 'Barcelona') {
    if (hG > aG) {
      return `👑 Real Madrid em vantagem! O time merengue está conseguindo explorar a velocidade de Vinicius Jr. nas costas da defesa adiantada do Barcelona.`;
    }
    if (aG > hG) {
      return `🔵🔴 O Barcelona joga com a linha defensiva muito alta e sufoca a saída de bola do Real Madrid. O placar reflete a eficiência ofensiva dos catalães liderados por Raphinha e Lewandowski.`;
    }
    return `✨ Clássico eletrizante! Ambas as equipes jogam de forma extremamente ofensiva. O Barcelona adota a estratégia de linha de impedimento alta, enquanto o Real Madrid tenta lançamentos longos para Mbappé.`;
  }

  // Fallback padrão
  if (hG === aG) {
    return `Partida empatada. Jogo bastante disputado com ambas as equipes se estudando no meio-campo e priorizando a segurança defensiva.`;
  }
  const leader = hG > aG ? homeName : awayName;
  return `O ${leader} está em vantagem no placar e dita o ritmo da partida, enquanto o adversário tenta reorganizar suas linhas táticas para buscar o empate.`;
};

export const mockDataService = {
  getLiveMatches(): ApiFixture[] {
    initializeLiveMatches();
    return simulatedLiveMatches.map(m => ({
      ...m,
      summary: getMatchSummary(m.teams.home.name, m.teams.away.name, m.goals.home, m.goals.away, m.fixture.status.short)
    }));
  },

  getUpcomingMatches(): ApiFixture[] {
    return getUpcomingMatchesList().map(m => ({
      ...m,
      summary: getMatchSummary(m.teams.home.name, m.teams.away.name, m.goals.home, m.goals.away, m.fixture.status.short)
    }));
  },

  getFinishedMatches(): ApiFixture[] {
    return mockFinishedMatches.map(m => ({
      ...m,
      summary: getMatchSummary(m.teams.home.name, m.teams.away.name, m.goals.home, m.goals.away, m.fixture.status.short)
    }));
  },

  getMatchDetails(fixtureId: number): {
    lineups: MatchLineup[];
    statistics: MatchStatistics[];
  } {
    // Encontra o jogo nas listas simuladas
    initializeLiveMatches();
    const match = [...simulatedLiveMatches, ...getUpcomingMatchesList(), ...mockFinishedMatches]
      .find(m => m.fixture.id === fixtureId);

    const homeTeam = match ? match.teams.home : { id: 1, name: "Home Team", logo: "" };
    const awayTeam = match ? match.teams.away : { id: 2, name: "Away Team", logo: "" };

    // Helper para gerar escalações dinâmicas e realistas baseadas nos times reais
    const getLineupForTeam = (teamId: number, teamName: string, teamLogo: string): MatchLineup => {
      // Flamengo
      if (teamName.includes('Flamengo') || teamId === 127) {
        return {
          team: { id: 127, name: "Flamengo", logo: teamLogo, colors: null },
          coach: { id: 901, name: "Filipe Luís" },
          formation: "4-3-3",
          startXI: [
            { player: { id: 11, name: "G. Rossi", number: 1, pos: 'G', grid: '1:1' } },
            { player: { id: 12, name: "Wesley", number: 2, pos: 'D', grid: '2:1' } },
            { player: { id: 13, name: "L. Ortiz", number: 3, pos: 'D', grid: '2:2' } },
            { player: { id: 14, name: "Fabrício B.", number: 4, pos: 'D', grid: '2:3' } },
            { player: { id: 15, name: "Ayrton Lucas", number: 6, pos: 'D', grid: '2:4' } },
            { player: { id: 16, name: "Pulgar", number: 5, pos: 'M', grid: '3:1' } },
            { player: { id: 17, name: "De La Cruz", number: 18, pos: 'M', grid: '3:2' } },
            { player: { id: 18, name: "Arrascaeta", number: 10, pos: 'M', grid: '3:3' } },
            { player: { id: 19, name: "Gerson", number: 8, pos: 'F', grid: '4:1' } },
            { player: { id: 101, name: "Pedro", number: 9, pos: 'F', grid: '4:2' } },
            { player: { id: 20, name: "E. Cebolinha", number: 11, pos: 'F', grid: '4:3' } }
          ],
          substitutes: [
            { player: { id: 21, name: "M. Cunha", number: 25, pos: 'G', grid: null } },
            { player: { id: 22, name: "David Luiz", number: 23, pos: 'D', grid: null } },
            { player: { id: 23, name: "Allan", number: 21, pos: 'M', grid: null } },
            { player: { id: 24, name: "Alcaraz", number: 37, pos: 'M', grid: null } },
            { player: { id: 25, name: "Gabigol", number: 99, pos: 'F', grid: null } }
          ]
        };
      }
      
      // Real Madrid
      if (teamName.includes('Real Madrid') || teamId === 541) {
        return {
          team: { id: 541, name: "Real Madrid", logo: teamLogo, colors: null },
          coach: { id: 903, name: "Carlo Ancelotti" },
          formation: "4-3-3",
          startXI: [
            { player: { id: 501, name: "T. Courtois", number: 1, pos: 'G', grid: '1:1' } },
            { player: { id: 502, name: "D. Carvajal", number: 2, pos: 'D', grid: '2:1' } },
            { player: { id: 503, name: "E. Militão", number: 3, pos: 'D', grid: '2:2' } },
            { player: { id: 504, name: "A. Rüdiger", number: 22, pos: 'D', grid: '2:3' } },
            { player: { id: 505, name: "F. Mendy", number: 23, pos: 'D', grid: '2:4' } },
            { player: { id: 506, name: "F. Valverde", number: 8, pos: 'M', grid: '3:1' } },
            { player: { id: 507, name: "A. Tchouaméni", number: 14, pos: 'M', grid: '3:2' } },
            { player: { id: 508, name: "J. Bellingham", number: 5, pos: 'M', grid: '3:3' } },
            { player: { id: 509, name: "Rodrygo", number: 11, pos: 'F', grid: '4:1' } },
            { player: { id: 510, name: "K. Mbappé", number: 9, pos: 'F', grid: '4:2' } },
            { player: { id: 511, name: "Vinícius Jr.", number: 7, pos: 'F', grid: '4:3' } }
          ],
          substitutes: [
            { player: { id: 512, name: "A. Lunin", number: 13, pos: 'G', grid: null } },
            { player: { id: 513, name: "Lucas V.", number: 17, pos: 'D', grid: null } },
            { player: { id: 514, name: "L. Modrić", number: 10, pos: 'M', grid: null } },
            { player: { id: 515, name: "E. Camavinga", number: 6, pos: 'M', grid: null } },
            { player: { id: 516, name: "Arda Güler", number: 15, pos: 'M', grid: null } },
            { player: { id: 517, name: "Endrick", number: 16, pos: 'F', grid: null } }
          ]
        };
      }

      // Barcelona
      if (teamName.includes('Barcelona') || teamId === 529) {
        return {
          team: { id: 529, name: "Barcelona", logo: teamLogo, colors: null },
          coach: { id: 904, name: "Hansi Flick" },
          formation: "4-3-3",
          startXI: [
            { player: { id: 601, name: "Ter Stegen", number: 1, pos: 'G', grid: '1:1' } },
            { player: { id: 602, name: "J. Koundé", number: 23, pos: 'D', grid: '2:1' } },
            { player: { id: 603, name: "P. Cubarsí", number: 2, pos: 'D', grid: '2:2' } },
            { player: { id: 604, name: "I. Martínez", number: 5, pos: 'D', grid: '2:3' } },
            { player: { id: 605, name: "A. Balde", number: 3, pos: 'D', grid: '2:4' } },
            { player: { id: 606, name: "Marc Casadó", number: 17, pos: 'M', grid: '3:1' } },
            { player: { id: 607, name: "Pedri", number: 8, pos: 'M', grid: '3:2' } },
            { player: { id: 608, name: "Dani Olmo", number: 20, pos: 'M', grid: '3:3' } },
            { player: { id: 609, name: "Lamine Yamal", number: 19, pos: 'F', grid: '4:1' } },
            { player: { id: 610, name: "Lewandowski", number: 9, pos: 'F', grid: '4:2' } },
            { player: { id: 611, name: "Raphinha", number: 11, pos: 'F', grid: '4:3' } }
          ],
          substitutes: [
            { player: { id: 612, name: "Iñaki Peña", number: 13, pos: 'G', grid: null } },
            { player: { id: 613, name: "H. Fort", number: 32, pos: 'D', grid: null } },
            { player: { id: 614, name: "F. de Jong", number: 21, pos: 'M', grid: null } },
            { player: { id: 615, name: "Fermín López", number: 16, pos: 'M', grid: null } },
            { player: { id: 616, name: "Ansu Fati", number: 10, pos: 'F', grid: null } },
            { player: { id: 617, name: "Pau Víctor", number: 18, pos: 'F', grid: null } }
          ]
        };
      }

      // Palmeiras ou padrão
      return {
        team: { id: teamId, name: teamName, logo: teamLogo, colors: null },
        coach: { id: 902, name: "Abel Ferreira" },
        formation: "4-4-2",
        startXI: [
          { player: { id: 31, name: "Weverton", number: 21, pos: 'G', grid: '1:1' } },
          { player: { id: 32, name: "Mayke", number: 12, pos: 'D', grid: '2:1' } },
          { player: { id: 33, name: "G. Gómez", number: 15, pos: 'D', grid: '2:2' } },
          { player: { id: 34, name: "Murilo", number: 26, pos: 'D', grid: '2:3' } },
          { player: { id: 35, name: "Piquerez", number: 22, pos: 'D', grid: '2:4' } },
          { player: { id: 36, name: "Aníbal M.", number: 5, pos: 'M', grid: '3:1' } },
          { player: { id: 37, name: "Richard Ríos", number: 27, pos: 'M', grid: '3:2' } },
          { player: { id: 38, name: "Zé Rafael", number: 8, pos: 'M', grid: '3:3' } },
          { player: { id: 39, name: "Raphael Veiga", number: 23, pos: 'M', grid: '3:4' } },
          { player: { id: 40, name: "Estêvão", number: 41, pos: 'F', grid: '4:1' } },
          { player: { id: 41, name: "Flaco López", number: 42, pos: 'F', grid: '4:2' } }
        ],
        substitutes: [
          { player: { id: 42, name: "M. Lomba", number: 1, pos: 'G', grid: null } },
          { player: { id: 43, name: "Marcos Rocha", number: 2, pos: 'D', grid: null } },
          { player: { id: 44, name: "G. Menino", number: 25, pos: 'M', grid: null } },
          { player: { id: 45, name: "Rony", number: 10, pos: 'F', grid: null } }
        ]
      };
    };

    const lineups: MatchLineup[] = [
      getLineupForTeam(homeTeam.id, homeTeam.name, homeTeam.logo),
      getLineupForTeam(awayTeam.id, awayTeam.name, awayTeam.logo)
    ];

    // Estatísticas simuladas dinâmicas
    const homeShots = match ? Math.max(5, (match.goals.home || 0) * 4 + Math.floor(Math.random() * 5)) : 10;
    const awayShots = match ? Math.max(3, (match.goals.away || 0) * 4 + Math.floor(Math.random() * 5)) : 8;
    const possession = match && match.fixture.status.short !== "NS" 
      ? 45 + Math.floor(Math.random() * 11) 
      : 50;

    const statistics: MatchStatistics[] = [
      {
        team: { id: homeTeam.id, name: homeTeam.name, logo: homeTeam.logo },
        statistics: [
          { type: "Ball Possession", value: `${possession}%` },
          { type: "Total Shots", value: homeShots },
          { type: "Shots on Goal", value: Math.floor(homeShots * 0.4) },
          { type: "Corner Kicks", value: Math.floor(homeShots * 0.5) },
          { type: "Fouls", value: 8 + Math.floor(Math.random() * 6) },
          { type: "Yellow Cards", value: match ? match.events?.filter(e => e.type === 'Card' && e.detail === 'Yellow Card' && e.team.id === homeTeam.id).length || 0 : 1 },
          { type: "Red Cards", value: match ? match.events?.filter(e => e.type === 'Card' && e.detail === 'Red Card' && e.team.id === homeTeam.id).length || 0 : 0 }
        ]
      },
      {
        team: { id: awayTeam.id, name: awayTeam.name, logo: awayTeam.logo },
        statistics: [
          { type: "Ball Possession", value: `${100 - possession}%` },
          { type: "Total Shots", value: awayShots },
          { type: "Shots on Goal", value: Math.floor(awayShots * 0.4) },
          { type: "Corner Kicks", value: Math.floor(awayShots * 0.5) },
          { type: "Fouls", value: 8 + Math.floor(Math.random() * 6) },
          { type: "Yellow Cards", value: match ? match.events?.filter(e => e.type === 'Card' && e.detail === 'Yellow Card' && e.team.id === awayTeam.id).length || 0 : 2 },
          { type: "Red Cards", value: match ? match.events?.filter(e => e.type === 'Card' && e.detail === 'Red Card' && e.team.id === awayTeam.id).length || 0 : 0 }
        ]
      }
    ];

    return { lineups, statistics };
  }
};

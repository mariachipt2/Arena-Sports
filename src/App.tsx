import { useState, useCallback } from 'react';
import { Header } from './components/layout/Header';
import { BottomNav } from './components/layout/BottomNav';
import { ToastGoal } from './components/layout/ToastGoal';
import { MatchGrid } from './components/matches/MatchGrid';
import { MatchDetailsSheet } from './components/details/MatchDetailsSheet';
import { SettingsPanel } from './components/settings/SettingsPanel';
import { SkeletonMatch } from './components/common/SkeletonMatch';
import { useLiveMatches } from './hooks/useLiveMatches';
import { useFavorites } from './hooks/useFavorites';
import type { ApiFixture } from './types/api';
import type { TabType, FilterType } from './types/dashboard';
import { storageService } from './services/storage';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('live');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedMatch, setSelectedMatch] = useState<ApiFixture | null>(null);
  
  // Estado para alertas de gol
  const [activeGoalAlert, setActiveGoalAlert] = useState<{
    match: ApiFixture;
    scoringTeam: { name: string; logo: string };
    player: string;
    scoreHome: number;
    scoreAway: number;
  } | null>(null);

  const { favorites } = useFavorites();

  // Callback acionado pelo hook useLiveMatches quando um time marca gol em um jogo favoritado
  const handleGoalScored = useCallback((event: any) => {
    // Configura o alert
    setActiveGoalAlert({
      match: event.match,
      scoringTeam: event.scoringTeam,
      player: event.player,
      scoreHome: event.scoreHome,
      scoreAway: event.scoreAway
    });

    // Se suportado pelo dispositivo, executa haptic feedback (vibração)
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([200, 100, 200]);
    }
  }, []);

  const {
    liveMatches,
    dailyMatches,
    loading,
    error,
    refetch
  } = useLiveMatches(handleGoalScored);

  const [isUpdating, setIsUpdating] = useState(false);

  const handleRefresh = async () => {
    setIsUpdating(true);
    await refetch();
    setTimeout(() => setIsUpdating(false), 800);
  };

  // Classifica as partidas por aba ativa
  const getTabMatches = (): ApiFixture[] => {
    if (activeTab === 'live') {
      return liveMatches;
    }
    
    if (activeTab === 'upcoming') {
      // Filtra partidas agendadas (não iniciadas) dos jogos diários
      return dailyMatches.filter(
        (m) => m.fixture.status.short === 'NS' || m.fixture.status.long === 'Not Started'
      );
    }
    
    if (activeTab === 'finished') {
      // Filtra partidas finalizadas dos jogos diários
      return dailyMatches.filter(
        (m) => ['FT', 'AET', 'PEN'].includes(m.fixture.status.short) || m.fixture.status.long === 'Match Finished'
      );
    }
    
    if (activeTab === 'favorites') {
      // Junta todos os jogos e filtra apenas os favoritados
      const allMatches = [...liveMatches, ...dailyMatches];
      // Remove duplicatas por ID do fixture
      const uniqueMatches = allMatches.filter(
        (match, index, self) => self.findIndex((m) => m.fixture.id === match.fixture.id) === index
      );
      return uniqueMatches.filter((m) => favorites.includes(m.fixture.id));
    }

    return [];
  };

  // Aplica filtros de pesquisa e país/tipo (Nacionais vs Internacionais)
  const getFilteredMatches = (): ApiFixture[] => {
    let matches = getTabMatches();
    const prefs = storageService.getPreferences();

    // 1. Filtro de Tipo (Nacional vs Internacional)
    if (filterType === 'local') {
      // Ligas locais (Brasil)
      matches = matches.filter((m) => m.league.country.toLowerCase() === 'brazil');
    } else if (filterType === 'international') {
      // Ligas internacionais
      matches = matches.filter((m) => m.league.country.toLowerCase() !== 'brazil');
    }

    // 2. Filtro por Busca Textual
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      matches = matches.filter(
        (m) =>
          m.teams.home.name.toLowerCase().includes(query) ||
          m.teams.away.name.toLowerCase().includes(query) ||
          m.league.name.toLowerCase().includes(query) ||
          m.league.country.toLowerCase().includes(query)
      );
    }

    // 3. Ordenação baseada em ligas prioritárias configuradas nas preferências do usuário
    if (prefs.selectedLeagues.length > 0) {
      matches = [...matches].sort((a, b) => {
        const aPriority = prefs.selectedLeagues.includes(a.league.id) ? 1 : 0;
        const bPriority = prefs.selectedLeagues.includes(b.league.id) ? 1 : 0;
        
        if (aPriority !== bPriority) {
          return bPriority - aPriority; // Prioritárias vêm primeiro
        }
        return a.fixture.timestamp - b.fixture.timestamp; // Depois ordena por horário
      });
    }

    return matches;
  };

  const filteredMatches = getFilteredMatches();

  return (
    <div className="app-container">
      {/* Alerta de Gol flutuante */}
      {activeGoalAlert && (
        <ToastGoal
          scoringTeam={activeGoalAlert.scoringTeam}
          player={activeGoalAlert.player}
          scoreHome={activeGoalAlert.scoreHome}
          scoreAway={activeGoalAlert.scoreAway}
          matchDescription={`${activeGoalAlert.match.teams.home.name} vs ${activeGoalAlert.match.teams.away.name}`}
          onClose={() => setActiveGoalAlert(null)}
        />
      )}

      {/* Header do Dashboard */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onRefresh={handleRefresh}
        isUpdating={isUpdating}
        liveCount={liveMatches.length}
      />

      {/* Main Content Area */}
      <main className="main-content">
        
        {activeTab !== 'settings' ? (
          <>
            {/* Barra de Filtros Rápidos (Pílulas Horizontais) */}
            <div className="filter-scroll-container">
              <button 
                className={`filter-pill ${filterType === 'all' ? 'active' : ''}`}
                onClick={() => setFilterType('all')}
              >
                🌍 Todos os Jogos
              </button>
              <button 
                className={`filter-pill ${filterType === 'local' ? 'active' : ''}`}
                onClick={() => setFilterType('local')}
              >
                🇧🇷 Nacionais / Locais
              </button>
              <button 
                className={`filter-pill ${filterType === 'international' ? 'active' : ''}`}
                onClick={() => setFilterType('international')}
              >
                🏆 Internacionais
              </button>
            </div>

            {/* Exibe erro se houver */}
            {error && (
              <div 
                className="glass-panel" 
                style={{ 
                  padding: '16px', 
                  color: 'var(--color-danger)', 
                  borderColor: 'rgba(239,68,68,0.2)',
                  backgroundColor: 'rgba(239,68,68,0.05)',
                  borderRadius: '12px',
                  marginTop: '12px',
                  fontSize: '0.85rem',
                  fontWeight: '600'
                }}
              >
                ⚠️ {error}
              </div>
            )}

            {/* Grid de Jogos ou Skeleton Loader */}
            {loading ? (
              <div className="matches-grid" style={{ marginTop: '16px' }}>
                <SkeletonMatch />
                <SkeletonMatch />
                <SkeletonMatch />
              </div>
            ) : (
              <MatchGrid
                matches={filteredMatches}
                onMatchSelect={setSelectedMatch}
                emptyMessage={
                  activeTab === 'live' 
                    ? "Não há jogos ao vivo ocorrendo no momento para este filtro."
                    : activeTab === 'favorites'
                    ? "Você não possui nenhuma partida favoritada. Clique na estrela dos cards para monitorá-las!"
                    : "Nenhum jogo agendado ou resultado disponível para este filtro."
                }
              />
            )}
          </>
        ) : (
          <SettingsPanel />
        )}
      </main>

      {/* Detalhes do Jogo (Bottom Sheet / Modal) */}
      {selectedMatch && (
        <MatchDetailsSheet
          match={selectedMatch}
          onClose={() => setSelectedMatch(null)}
        />
      )}

      {/* Navegação Inferior para Celular */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        liveCount={liveMatches.length}
      />
    </div>
  );
}

export default App;

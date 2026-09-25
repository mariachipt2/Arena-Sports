import React, { useEffect, useState } from 'react';
import { X, Activity, Users, BarChart2, Calendar, Star, Trophy, Palette, EyeOff } from 'lucide-react';
import type { ApiFixture, MatchLineup, MatchStatistics, StandingItem } from '../../types/api';
import { apiFootballService } from '../../services/apiFootball';
import { storageService } from '../../services/storage';
import { TeamBadge } from '../common/TeamBadge';
import { ScoreBadge } from '../common/ScoreBadge';
import { CalendarButton } from '../common/CalendarButton';
import { MatchTimeline } from './MatchTimeline';
import { PitchLineup } from './PitchLineup';
import { StatsComparison } from './StatsComparison';
import { StandingsTable } from './StandingsTable';
import { useFavorites } from '../../hooks/useFavorites';
import { useTeamTheme } from '../../hooks/useTeamTheme';

interface MatchDetailsSheetProps {
  match: ApiFixture | null;
  onClose: () => void;
}

type DetailTab = 'timeline' | 'lineups' | 'stats' | 'standings';

export const MatchDetailsSheet: React.FC<MatchDetailsSheetProps> = ({ match, onClose }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { toggleThemeByTeam, isThemeActiveForTeam } = useTeamTheme();
  const [activeTab, setActiveTab] = useState<DetailTab>('timeline');
  const [lineups, setLineups] = useState<MatchLineup[]>([]);
  const [stats, setStats] = useState<MatchStatistics[]>([]);
  const [standings, setStandings] = useState<StandingItem[]>([]);
  const [themeFeedback, setThemeFeedback] = useState<string | null>(null);
  const [isLeagueFollowed, setIsLeagueFollowed] = useState<boolean>(() => match ? storageService.isLeagueFollowed(match.league.id) : false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!match) return;

    // Reset de estado ao abrir um novo jogo
    setLineups([]);
    setStats([]);
    setStandings([]);
    setActiveTab('timeline');
    setError(null);
    setIsLeagueFollowed(storageService.isLeagueFollowed(match.league.id));

    // Carregamento Lazy Load sob demanda
    const loadDetails = async () => {
      setLoading(true);
      try {
        const [details, leagueStandings] = await Promise.all([
          apiFootballService.getMatchDetails(match.fixture.id),
          apiFootballService.getLeagueStandings(match.league.id, match.league.season)
        ]);
        setLineups(details.lineups);
        setStats(details.statistics);
        setStandings(leagueStandings);
      } catch (err) {
        console.error('Erro ao buscar detalhes da partida:', err);
        setError('Não foi possível carregar os detalhes desta partida.');
      } finally {
        setLoading(false);
      }
    };

    loadDetails();
  }, [match]);

  if (!match) return null;

  const { fixture, league, teams, goals } = match;
  const isLive = ['1H', '2H', 'HT', 'ET', 'P', 'LIVE'].includes(fixture.status.short);
  const isFinished = ['FT', 'AET', 'PEN'].includes(fixture.status.short);

  // Vencedores
  const homeWinner = teams.home.winner === true || (isFinished && (goals.home || 0) > (goals.away || 0));
  const awayWinner = teams.away.winner === true || (isFinished && (goals.away || 0) > (goals.home || 0));

  const isHomeActive = isThemeActiveForTeam({ id: teams.home.id, name: teams.home.name });
  const isAwayActive = isThemeActiveForTeam({ id: teams.away.id, name: teams.away.name });

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Formata data e hora
  const formattedDate = new Date(fixture.date).toLocaleDateString([], { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'short' 
  });
  const formattedTime = new Date(fixture.date).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <div className="bottom-sheet-backdrop" onClick={handleBackdropClick}>
      <div className="bottom-sheet-content">
        
        {/* Puxador para celular */}
        <div className="bottom-sheet-handle" onClick={onClose}></div>

        {/* Botão de Fechar Modal */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            right: '20px',
            top: '20px',
            background: 'rgba(255,255,255,0.05)',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-text-muted)',
            cursor: 'pointer',
            zIndex: 10
          }}
        >
          <X size={18} />
        </button>

        {/* Header do Jogo (Liga e Status) */}
        <div style={{ textAlign: 'center', marginBottom: '16px', paddingRight: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: '600', flexWrap: 'wrap' }}>
            {league.logo && <img src={league.logo} alt="" width={16} style={{ objectFit: 'contain' }} />}
            <span>{league.name}</span>
            {league.round && <span>• {league.round}</span>}

            {/* Ações da Liga: Seguir / Não Seguir */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', marginLeft: '4px' }}>
              <button
                onClick={() => {
                  const res = storageService.toggleFollowLeague(league.id, league.name);
                  setIsLeagueFollowed(res);
                  setThemeFeedback(res ? `Liga ${league.name} seguida!` : `Deixou de seguir ${league.name}`);
                  setTimeout(() => setThemeFeedback(null), 2500);
                }}
                style={{
                  background: isLeagueFollowed ? 'rgba(157, 124, 252, 0.15)' : 'rgba(255,255,255,0.05)',
                  border: isLeagueFollowed ? '1px solid var(--color-primary)' : '1px solid var(--border-color)',
                  color: isLeagueFollowed ? '#fff' : 'var(--color-text-muted)',
                  borderRadius: '999px',
                  padding: '2px 8px',
                  fontSize: '0.68rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontWeight: '600',
                  transition: 'all 0.15s'
                }}
                title={isLeagueFollowed ? "Você está seguindo esta liga (toque para deixar de seguir)" : "Seguir esta liga"}
              >
                <Star size={11} fill={isLeagueFollowed ? 'var(--color-warning)' : 'none'} color={isLeagueFollowed ? 'var(--color-warning)' : 'currentColor'} />
                <span>{isLeagueFollowed ? 'Seguindo' : 'Seguir liga'}</span>
              </button>

              <button
                onClick={() => {
                  storageService.hideLeague(league.id, league.name);
                  onClose();
                }}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--color-text-muted)',
                  borderRadius: '999px',
                  padding: '2px 8px',
                  fontSize: '0.68rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontWeight: '600',
                  transition: 'all 0.15s'
                }}
                title="Não seguir esta liga (ocultar jogos do feed)"
              >
                <EyeOff size={11} />
                <span>Não seguir</span>
              </button>
            </div>
          </div>
          
          <div 
            style={{ 
              fontSize: '0.75rem', 
              color: 'var(--color-text-dark)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '8px',
              marginTop: '6px',
              flexWrap: 'wrap'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Calendar size={12} />
              <span>{formattedDate} às {formattedTime}</span>
            </div>
            <span>•</span>
            <CalendarButton match={match} variant="full" />
          </div>
        </div>

        {/* Feedback visual de tema ativado */}
        {themeFeedback && (
          <div 
            style={{ 
              textAlign: 'center', 
              margin: '-6px 0 10px 0', 
              fontSize: '0.72rem', 
              color: 'var(--color-primary)', 
              fontWeight: '700',
              background: 'var(--color-primary-glow)',
              padding: '4px 10px',
              borderRadius: '999px',
              display: 'inline-flex',
              alignSelf: 'center',
              boxShadow: '0 0 12px var(--border-color-glow)'
            }}
          >
            ✨ {themeFeedback}
          </div>
        )}

        {/* Painel de Placar Central */}
        <div 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            padding: '10px 0 20px 0',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            marginBottom: '16px'
          }}
        >
          {/* Time Mandante */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '6px' }}>
            <TeamBadge name={teams.home.name} logoUrl={teams.home.logo} size={48} />
            <span style={{ fontSize: '0.9rem', fontWeight: '700', color: homeWinner ? '#fff' : 'var(--color-text-main)' }}>
              {teams.home.name}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                const res = toggleThemeByTeam({ id: teams.home.id, name: teams.home.name, logo: teams.home.logo });
                if (res.active) {
                  setThemeFeedback(`Tema ${res.themeName} ativado!`);
                } else {
                  setThemeFeedback('Tema padrão Arena restaurado!');
                }
                setTimeout(() => setThemeFeedback(null), 2500);
              }}
              style={{
                background: isHomeActive ? 'var(--color-primary)' : 'rgba(255,255,255,0.05)',
                border: isHomeActive ? '1px solid var(--color-primary)' : '1px solid var(--border-color)',
                borderRadius: '6px',
                padding: '3px 8px',
                fontSize: '0.68rem',
                fontWeight: '700',
                color: isHomeActive ? '#fff' : 'var(--color-text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                marginTop: '2px',
                transition: 'all 0.15s',
                boxShadow: isHomeActive ? '0 0 10px var(--border-color-glow)' : 'none'
              }}
              title={isHomeActive ? "Tema ativo! Toque para restaurar o tema padrão" : `Mudar visual do app para as cores do ${teams.home.name}`}
              className={`team-theme-btn ${isHomeActive ? 'active' : ''}`}
            >
              <Palette size={11} />
              <span>{isHomeActive ? 'Tema Ativo' : 'Tema'}</span>
            </button>
          </div>

          {/* Placar / Tempo */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', minWidth: '100px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {(isLive || isFinished) ? (
                <>
                  <ScoreBadge score={goals.home} isLive={isLive} isWinner={homeWinner} />
                  <span style={{ fontWeight: '800', opacity: 0.3 }}>-</span>
                  <ScoreBadge score={goals.away} isLive={isLive} isWinner={awayWinner} />
                </>
              ) : (
                <span style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--color-primary)' }}>VS</span>
              )}
            </div>

            {/* Status do cronômetro */}
            {isLive ? (
              <span className="match-status-pill status-live">
                <span className="badge-live-pulse animate-pulse-live"></span>
                {fixture.status.short === 'HT' ? 'Intervalo' : `${fixture.status.elapsed}'`}
              </span>
            ) : isFinished ? (
              <span className="match-status-pill status-finished">Encerrado</span>
            ) : (
              <span className="match-status-pill status-upcoming" style={{ fontSize: '0.65rem' }}>AGENDADO</span>
            )}
            
            {/* Favoritar */}
            <button
              onClick={() => toggleFavorite(fixture.id)}
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--border-color)',
                padding: '4px 10px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.7rem',
                fontWeight: '700',
                color: isFavorite(fixture.id) ? 'var(--color-warning)' : 'var(--color-text-muted)',
                cursor: 'pointer',
                marginTop: '4px'
              }}
            >
              <Star size={12} fill={isFavorite(fixture.id) ? 'var(--color-warning)' : 'none'} />
              <span>{isFavorite(fixture.id) ? 'Favoritado' : 'Monitorar'}</span>
            </button>
          </div>

          {/* Time Visitante */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '6px' }}>
            <TeamBadge name={teams.away.name} logoUrl={teams.away.logo} size={48} />
            <span style={{ fontSize: '0.9rem', fontWeight: '700', color: awayWinner ? '#fff' : 'var(--color-text-main)' }}>
              {teams.away.name}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                const res = toggleThemeByTeam({ id: teams.away.id, name: teams.away.name, logo: teams.away.logo });
                if (res.active) {
                  setThemeFeedback(`Tema ${res.themeName} ativado!`);
                } else {
                  setThemeFeedback('Tema padrão Arena restaurado!');
                }
                setTimeout(() => setThemeFeedback(null), 2500);
              }}
              style={{
                background: isAwayActive ? 'var(--color-primary)' : 'rgba(255,255,255,0.05)',
                border: isAwayActive ? '1px solid var(--color-primary)' : '1px solid var(--border-color)',
                borderRadius: '6px',
                padding: '3px 8px',
                fontSize: '0.68rem',
                fontWeight: '700',
                color: isAwayActive ? '#fff' : 'var(--color-text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                marginTop: '2px',
                transition: 'all 0.15s',
                boxShadow: isAwayActive ? '0 0 10px var(--border-color-glow)' : 'none'
              }}
              title={isAwayActive ? "Tema ativo! Toque para restaurar o tema padrão" : `Mudar visual do app para as cores do ${teams.away.name}`}
              className={`team-theme-btn ${isAwayActive ? 'active' : ''}`}
            >
              <Palette size={11} />
              <span>{isAwayActive ? 'Tema Ativo' : 'Tema'}</span>
            </button>
          </div>
        </div>

        {/* Resumo da Ópera */}
        {match.summary && (
          <div className="opera-summary-container">
            <span className="opera-summary-icon">📝</span>
            <div>
              <strong style={{ color: 'var(--color-primary)', display: 'block', fontSize: '0.72rem', fontWeight: '800', marginBottom: '3px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Resumo da Ópera
              </strong>
              <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.85)' }}>{match.summary}</span>
            </div>
          </div>
        )}

        {/* Navegação de Abas do Jogo */}
        <div 
          style={{ 
            display: 'flex', 
            borderBottom: '1px solid rgba(255,255,255,0.05)', 
            marginBottom: '16px' 
          }}
        >
          {/* Aba: Linha do Tempo */}
          <button
            onClick={() => setActiveTab('timeline')}
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'timeline' ? '2px solid var(--color-primary)' : '2px solid transparent',
              color: activeTab === 'timeline' ? 'var(--color-primary)' : 'var(--color-text-muted)',
              padding: '10px 0',
              fontWeight: '700',
              fontSize: '0.8rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.2s'
            }}
          >
            <Activity size={14} />
            <span>Lances</span>
          </button>

          {/* Aba: Escalações */}
          <button
            onClick={() => setActiveTab('lineups')}
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'lineups' ? '2px solid var(--color-primary)' : '2px solid transparent',
              color: activeTab === 'lineups' ? 'var(--color-primary)' : 'var(--color-text-muted)',
              padding: '10px 0',
              fontWeight: '700',
              fontSize: '0.8rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.2s'
            }}
          >
            <Users size={14} />
            <span>Escalações</span>
          </button>

          {/* Aba: Estatísticas */}
          <button
            onClick={() => setActiveTab('stats')}
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'stats' ? '2px solid var(--color-primary)' : '2px solid transparent',
              color: activeTab === 'stats' ? 'var(--color-primary)' : 'var(--color-text-muted)',
              padding: '10px 0',
              fontWeight: '700',
              fontSize: '0.8rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.2s'
            }}
          >
            <BarChart2 size={14} />
            <span>Estatísticas</span>
          </button>

          {/* Aba: Classificação na Tabela */}
          <button
            onClick={() => setActiveTab('standings')}
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'standings' ? '2px solid var(--color-primary)' : '2px solid transparent',
              color: activeTab === 'standings' ? 'var(--color-primary)' : 'var(--color-text-muted)',
              padding: '10px 0',
              fontWeight: '700',
              fontSize: '0.8rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.2s'
            }}
          >
            <Trophy size={14} />
            <span>Classificação</span>
          </button>
        </div>

        {/* Área de Conteúdo da Aba */}
        <div style={{ flex: 1, overflowY: 'auto', minHeight: '220px' }}>
          {loading ? (
            <div 
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                height: '180px',
                gap: '10px',
                color: 'var(--color-text-muted)'
              }}
            >
              <div 
                style={{ 
                  width: '24px', 
                  height: '24px', 
                  border: '2px solid var(--border-color)', 
                  borderTopColor: 'var(--color-primary)', 
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite'
                }}
              ></div>
              <span style={{ fontSize: '0.75rem', fontWeight: '600' }}>Carregando dados táticos e tabela...</span>
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', color: 'var(--color-danger)', padding: '30px 10px', fontSize: '0.85rem' }}>
              {error}
            </div>
          ) : (
            <>
              {activeTab === 'timeline' && (
                <MatchTimeline 
                  events={match.events} 
                  homeTeamId={teams.home.id} 
                />
              )}

              {activeTab === 'lineups' && (
                <PitchLineup lineups={lineups} />
              )}

              {activeTab === 'stats' && (
                <StatsComparison 
                  statistics={stats} 
                  homeTeamName={teams.home.name} 
                  awayTeamName={teams.away.name} 
                />
              )}

              {activeTab === 'standings' && (
                <StandingsTable 
                  standings={standings} 
                  homeTeamId={teams.home.id} 
                  awayTeamId={teams.away.id} 
                  leagueName={league.name} 
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MatchDetailsSheet;

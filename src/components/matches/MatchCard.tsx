import React from 'react';
import { Star } from 'lucide-react';
import type { ApiFixture } from '../../types/api';
import { TeamBadge } from '../common/TeamBadge';
import { ScoreBadge } from '../common/ScoreBadge';
import { CalendarButton } from '../common/CalendarButton';
import { useFavorites } from '../../hooks/useFavorites';

interface MatchCardProps {
  match: ApiFixture;
  onClick: () => void;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match, onClick }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { fixture, league, teams, goals } = match;

  const isLive = ['1H', '2H', 'HT', 'ET', 'P', 'LIVE'].includes(fixture.status.short);
  const isFinished = ['FT', 'AET', 'PEN'].includes(fixture.status.short);
  
  // Detecção dos vencedores para aplicar destaque
  const homeWinner = teams.home.winner === true || (isFinished && (goals.home || 0) > (goals.away || 0));
  const awayWinner = teams.away.winner === true || (isFinished && (goals.away || 0) > (goals.home || 0));

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(fixture.id);
  };

  // Formatação do status / tempo do jogo
  const renderStatus = () => {
    if (isLive) {
      return (
        <span className="match-status-pill status-live">
          <span className="badge-live-pulse animate-pulse-live"></span>
          {(() => {
            if (fixture.status.short === 'HT') return 'Intervalo (HT)';
            if (fixture.status.short === 'P') return 'Pênaltis';
            if (fixture.status.short === 'ET') return `Prorrog. ${fixture.status.elapsed ?? 90}'`;
            if (fixture.status.short === 'BT') return 'Prorrogação';
            if (fixture.status.elapsed != null) return `${fixture.status.elapsed}'`;
            return fixture.status.short || 'Ao Vivo';
          })()}
        </span>
      );
    }
    if (isFinished) {
      return <span className="match-status-pill status-finished">Fim (FT)</span>;
    }
    // Agendado - Mostra dia e hora de início formatados
    const matchDate = new Date(fixture.date);
    const now = new Date();
    const isToday = matchDate.toDateString() === now.toDateString();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const isTomorrow = matchDate.toDateString() === tomorrow.toDateString();

    const timeStr = matchDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    let dateLabel = timeStr;
    if (isToday) {
      dateLabel = `Hoje ${timeStr}`;
    } else if (isTomorrow) {
      dateLabel = `Amanhã ${timeStr}`;
    } else {
      const day = String(matchDate.getDate()).padStart(2, '0');
      const month = String(matchDate.getMonth() + 1).padStart(2, '0');
      dateLabel = `${day}/${month} ${timeStr}`;
    }

    return (
      <span className="match-status-pill status-upcoming">
        {dateLabel}
      </span>
    );
  };

  return (
    <div 
      className="glass-panel glass-panel-hover match-card"
      onClick={onClick}
    >
      {/* Header do Card */}
      <div className="match-card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {league.logo && (
            <img 
              src={league.logo} 
              alt={league.name} 
              width={14} 
              height={14} 
              style={{ objectFit: 'contain' }} 
            />
          )}
          <span style={{ fontWeight: '600', letterSpacing: '-0.01em' }}>
            {league.name}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {renderStatus()}
          {!isFinished && <CalendarButton match={match} variant="compact" />}
          <button
            onClick={handleFavoriteClick}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: isFavorite(fixture.id) ? 'var(--color-warning)' : 'var(--color-text-dark)',
              display: 'flex',
              padding: '2px',
              transition: 'color 0.2s, transform 0.1s'
            }}
            onMouseDown={(e) => e.stopPropagation()}
            title="Favoritar Partida"
          >
            <Star 
              size={16} 
              fill={isFavorite(fixture.id) ? 'var(--color-warning)' : 'none'} 
            />
          </button>
        </div>

      </div>

      {/* Body do Card (Times e Placar) */}
      <div className="match-card-body">
        {/* Mandante */}
        <div className="team-row">
          <div className="team-info">
            <TeamBadge name={teams.home.name} logoUrl={teams.home.logo} size={28} />
            <span className={`team-name ${homeWinner ? 'winner' : ''}`}>
              {teams.home.name}
            </span>
          </div>
          {(isLive || isFinished) && (
            <ScoreBadge 
              score={goals.home} 
              isLive={isLive} 
              isWinner={homeWinner} 
            />
          )}
        </div>

        {/* Visitante */}
        <div className="team-row">
          <div className="team-info">
            <TeamBadge name={teams.away.name} logoUrl={teams.away.logo} size={28} />
            <span className={`team-name ${awayWinner ? 'winner' : ''}`}>
              {teams.away.name}
            </span>
          </div>
          {(isLive || isFinished) && (
            <ScoreBadge 
              score={goals.away} 
              isLive={isLive} 
              isWinner={awayWinner} 
            />
          )}
        </div>
      </div>
      
      {/* Footer Simples do Card */}
      {match.summary && (
        <div 
          style={{ 
            fontSize: '0.72rem', 
            color: 'var(--color-text-muted)', 
            marginTop: '10px', 
            borderTop: '1px solid rgba(255,255,255,0.03)',
            paddingTop: '8px',
            fontStyle: 'italic',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          ✨ {match.summary}
        </div>
      )}
    </div>
  );
};

export default MatchCard;

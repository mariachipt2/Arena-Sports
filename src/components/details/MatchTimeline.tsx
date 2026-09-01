import React from 'react';
import type { MatchEvent } from '../../types/api';
import { Info } from 'lucide-react';
import TeamBadge from '../common/TeamBadge';

interface MatchTimelineProps {
  events?: MatchEvent[];
  homeTeamId: number;
}

export const MatchTimeline: React.FC<MatchTimelineProps> = ({ events = [], homeTeamId }) => {
  if (events.length === 0) {
    return (
      <div 
        style={{ 
          textAlign: 'center', 
          color: 'var(--color-text-muted)', 
          padding: '30px 20px', 
          fontSize: '0.85rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        <Info size={20} style={{ opacity: 0.5 }} />
        <span>Nenhum evento registrado ainda nesta partida.</span>
      </div>
    );
  }

  // Ordena os eventos pelo minuto decorrido de forma ascendente (1' a 90')
  const sortedEvents = [...events].sort((a, b) => a.time.elapsed - b.time.elapsed);

  // Renderiza ícones e textos baseados no tipo de evento
  const renderEventDetails = (event: MatchEvent) => {
    switch (event.type) {
      case 'Goal':
        return {
          icon: '⚽',
          iconColor: 'var(--color-success-neon)',
          bgColor: 'rgba(16, 185, 129, 0.1)',
          title: `GOL! (${event.detail})`,
          desc: (
            <span>
              <strong>{event.player.name}</strong>
              {event.assist?.name && (
                <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>
                  {' '}assist. {event.assist.name}
                </span>
              )}
            </span>
          )
        };
      case 'Card':
        const isRed = event.detail.toLowerCase().includes('red');
        return {
          icon: isRed ? '🟥' : '🟨',
          iconColor: isRed ? 'var(--color-danger)' : 'var(--color-warning)',
          bgColor: isRed ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
          title: isRed ? 'Cartão Vermelho' : 'Cartão Amarelo',
          desc: (
            <span>
              <strong>{event.player.name}</strong>
              {event.comments && (
                <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>
                  {' '}({event.comments})
                </span>
              )}
            </span>
          )
        };
      case 'subst':
        return {
          icon: '🔄',
          iconColor: 'var(--color-primary)',
          bgColor: 'rgba(59, 130, 246, 0.1)',
          title: 'Substituição',
          desc: (
            <span>
              Entra: <strong>{event.player.name}</strong> <br />
              Sai: <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>{event.assist?.name || 'N/A'}</span>
            </span>
          )
        };
      default:
        return {
          icon: '📢',
          iconColor: '#a855f7',
          bgColor: 'rgba(168, 85, 247, 0.1)',
          title: event.detail || 'VAR / Decisão',
          desc: <span>{event.player.name || event.comments}</span>
        };
    }
  };

  return (
    <div style={{ position: 'relative', padding: '10px 0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Linha vertical tracejada do centro */}
      <div 
        style={{ 
          position: 'absolute', 
          left: '42px', 
          top: '10px', 
          bottom: '10px', 
          width: '2px', 
          backgroundImage: 'linear-gradient(to bottom, rgba(255,255,255,0.06) 50%, transparent 50%)',
          backgroundSize: '2px 8px',
          zIndex: 1 
        }}
      ></div>

      {sortedEvents.map((event, index) => {
        const details = renderEventDetails(event);
        const isHomeEvent = event.team.id === homeTeamId;

        return (
          <div 
            key={`${event.time.elapsed}_${index}`}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '16px',
              position: 'relative',
              zIndex: 2,
              animation: 'fade-in 0.3s ease-out'
            }}
          >
            {/* Minuto do Jogo */}
            <div 
              style={{ 
                width: '32px', 
                textAlign: 'right', 
                fontSize: '0.85rem', 
                fontWeight: '800', 
                color: 'var(--color-text-muted)',
                paddingTop: '6px'
              }}
              className="tabular-nums"
            >
              {event.time.elapsed}'
            </div>

            {/* Círculo do Ícone */}
            <div 
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: details.bgColor,
                border: '1px solid rgba(255,255,255,0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.8rem',
                flexShrink: 0,
                marginTop: '4px',
                boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
              }}
            >
              {details.icon}
            </div>

            {/* Conteúdo do Evento */}
            <div 
              className="glass-panel"
              style={{
                flex: 1,
                padding: '10px 12px',
                borderRadius: '10px',
                backgroundColor: 'rgba(255,255,255,0.02)',
                borderLeft: `3px solid ${isHomeEvent ? 'var(--color-primary)' : 'var(--color-success)'}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '10px'
              }}
            >
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '2px' }}>
                  {details.title}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#fff', lineHeight: '1.3' }}>
                  {details.desc}
                </div>
              </div>

              {/* Escudo do time dono do evento */}
              <TeamBadge name={event.team.name} logoUrl={event.team.logo} size={20} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MatchTimeline;

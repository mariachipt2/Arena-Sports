import React from 'react';
import type { StandingItem } from '../../types/api';
import { TeamBadge } from '../common/TeamBadge';
import { Trophy, Zap } from 'lucide-react';

interface StandingsTableProps {
  standings: StandingItem[];
  homeTeamId?: number;
  awayTeamId?: number;
  leagueName?: string;
}

export const StandingsTable: React.FC<StandingsTableProps> = ({
  standings,
  homeTeamId,
  awayTeamId,
  leagueName
}) => {
  if (!standings || standings.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '30px 10px', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
        Tabela de classificação indisponível no momento.
      </div>
    );
  }

  // Identifica os dois times da partida atual na tabela
  const homeStanding = standings.find(s => s.team.id === homeTeamId);
  const awayStanding = standings.find(s => s.team.id === awayTeamId);

  // Calcula a diferença de pontos se ambos existirem
  const pointsDiff = (homeStanding && awayStanding) 
    ? Math.abs(homeStanding.points - awayStanding.points)
    : null;

  // Renderiza a pílula de resultado recente (V, E, D)
  const renderFormBadge = (char: string, index: number) => {
    const c = char.trim().toUpperCase();
    let bg = 'rgba(255, 255, 255, 0.1)';
    let color = '#fff';
    let label = c;

    if (c === 'V' || c === 'W') {
      bg = 'rgba(46, 213, 115, 0.2)';
      color = '#2ed573';
      label = 'V';
    } else if (c === 'E') {
      bg = 'rgba(255, 165, 2, 0.2)';
      color = '#ffa502';
      label = 'E';
    } else if (c === 'D' || c === 'L') {
      bg = 'rgba(255, 71, 87, 0.2)';
      color = '#ff4757';
      label = 'D';
    }

    return (
      <span
        key={index}
        style={{
          width: '18px',
          height: '18px',
          borderRadius: '50%',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.62rem',
          fontWeight: '800',
          background: bg,
          color: color,
        }}
        title={`Jogo recente: ${label === 'V' ? 'Vitória' : label === 'E' ? 'Empate' : 'Derrota'}`}
      >
        {label}
      </span>
    );
  };

  // Cor do indicador de zona conforme a posição
  const getZoneIndicatorColor = (rank: number, total: number) => {
    if (rank <= 4) return '#2ed573'; // Libertadores / G4 / Champions
    if (rank <= 6) return '#00d2d3'; // Pré-Libertadores / Europa League
    if (rank <= 12) return '#ffa502'; // Sul-Americana
    if (rank > total - 4) return '#ff4757'; // Z4 / Rebaixamento
    return 'transparent';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%' }}>
      
      {/* Título da Liga se fornecido */}
      {leagueName && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: '700', color: 'var(--color-text-muted)', padding: '0 2px' }}>
          <Trophy size={14} style={{ color: 'var(--color-primary)' }} />
          <span>Tabela Oficial: <strong style={{ color: '#fff' }}>{leagueName}</strong></span>
        </div>
      )}

      {/* Card de Confronto Direto na Tabela */}

      {homeStanding && awayStanding && (
        <div 
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.03), var(--color-primary-glow))',
            border: '1px solid var(--border-color-glow)',
            borderRadius: '12px',
            padding: '12px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 4px 16px rgba(0,0,0,0.2)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Zap size={16} style={{ color: 'var(--color-primary)' }} />
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: '800', color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Confronto Direto na Tabela
              </div>
              <div style={{ fontSize: '0.8rem', color: '#fff', fontWeight: '600', marginTop: '2px' }}>
                {homeStanding.rank}º {homeStanding.team.name} ({homeStanding.points} pts) vs {awayStanding.rank}º {awayStanding.team.name} ({awayStanding.points} pts)
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', display: 'block' }}>Diferença</span>
            <span style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--color-accent)' }}>
              {pointsDiff === 0 ? 'Empatados em pts' : `${pointsDiff} ${pointsDiff === 1 ? 'pt' : 'pts'}`}
            </span>
          </div>
        </div>
      )}

      {/* Tabela de Classificação */}
      <div 
        style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          overflow: 'hidden'
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.76rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'rgba(255, 255, 255, 0.03)', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', color: 'var(--color-text-muted)' }}>
                <th style={{ padding: '8px 10px', width: '42px', textAlign: 'center' }}>#</th>
                <th style={{ padding: '8px 10px' }}>Clube</th>
                <th style={{ padding: '8px 8px', textAlign: 'center', fontWeight: '800', color: '#fff' }}>PTS</th>
                <th style={{ padding: '8px 8px', textAlign: 'center' }}>J</th>
                <th style={{ padding: '8px 8px', textAlign: 'center' }}>V</th>
                <th style={{ padding: '8px 8px', textAlign: 'center' }}>E</th>
                <th style={{ padding: '8px 8px', textAlign: 'center' }}>D</th>
                <th style={{ padding: '8px 8px', textAlign: 'center' }}>SG</th>
                <th style={{ padding: '8px 10px', textAlign: 'center', minWidth: '100px' }}>Forma</th>
              </tr>
            </thead>
            <tbody>
              {standings.map((item) => {
                const isHome = item.team.id === homeTeamId;
                const isAway = item.team.id === awayTeamId;
                const isMatchTeam = isHome || isAway;
                const zoneColor = getZoneIndicatorColor(item.rank, standings.length);
                const formChars = item.form ? item.form.replace(/,/g, '').split('') : [];

                return (
                  <tr
                    key={item.team.id}
                    style={{
                      borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
                      background: isMatchTeam 
                        ? 'linear-gradient(90deg, var(--color-primary-glow), rgba(255,255,255,0.03))' 
                        : 'transparent',
                      fontWeight: isMatchTeam ? '700' : 'normal',
                      transition: 'background 0.15s'
                    }}
                    className="standings-row"
                  >
                    {/* Posição com barra da Zona */}
                    <td style={{ padding: '8px 6px', textAlign: 'center', position: 'relative' }}>
                      <div
                        style={{
                          position: 'absolute',
                          left: '0',
                          top: '20%',
                          bottom: '20%',
                          width: '3px',
                          borderRadius: '0 2px 2px 0',
                          backgroundColor: zoneColor
                        }}
                      />
                      <span 
                        style={{ 
                          color: isMatchTeam ? 'var(--color-primary)' : 'var(--color-text-muted)',
                          fontWeight: isMatchTeam ? '800' : '600'
                        }}
                      >
                        {item.rank}
                      </span>
                    </td>

                    {/* Time e Escudo */}
                    <td style={{ padding: '8px 10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <TeamBadge name={item.team.name} logoUrl={item.team.logo} size={22} />
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ color: isMatchTeam ? '#fff' : 'var(--color-text-main)', whiteSpace: 'nowrap' }}>
                          {item.team.name}
                        </span>
                        {isHome && (
                          <span style={{ fontSize: '0.6rem', padding: '1px 5px', borderRadius: '4px', background: 'var(--color-primary)', color: '#fff', fontWeight: '800' }}>
                            Mandante
                          </span>
                        )}
                        {isAway && (
                          <span style={{ fontSize: '0.6rem', padding: '1px 5px', borderRadius: '4px', background: 'rgba(255,255,255,0.15)', color: '#fff', fontWeight: '800' }}>
                            Visitante
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Pontos */}
                    <td style={{ padding: '8px 8px', textAlign: 'center', fontWeight: '800', color: isMatchTeam ? 'var(--color-primary)' : '#fff' }}>
                      {item.points}
                    </td>

                    {/* Jogos */}
                    <td style={{ padding: '8px 8px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                      {item.all.played}
                    </td>

                    {/* Vitórias */}
                    <td style={{ padding: '8px 8px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                      {item.all.win}
                    </td>

                    {/* Empates */}
                    <td style={{ padding: '8px 8px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                      {item.all.draw}
                    </td>

                    {/* Derrotas */}
                    <td style={{ padding: '8px 8px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                      {item.all.lose}
                    </td>

                    {/* Saldo de Gols */}
                    <td 
                      style={{ 
                        padding: '8px 8px', 
                        textAlign: 'center', 
                        fontWeight: '600',
                        color: item.goalsDiff > 0 ? '#2ed573' : item.goalsDiff < 0 ? '#ff4757' : 'var(--color-text-muted)' 
                      }}
                    >
                      {item.goalsDiff > 0 ? `+${item.goalsDiff}` : item.goalsDiff}
                    </td>

                    {/* Forma recente */}
                    <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', gap: '3px', alignItems: 'center' }}>
                        {formChars.slice(-5).map((char, idx) => renderFormBadge(char, idx))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Legenda das Zonas */}
        <div 
          style={{ 
            padding: '10px 14px', 
            background: 'rgba(0, 0, 0, 0.2)', 
            borderTop: '1px solid rgba(255, 255, 255, 0.04)',
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '12px',
            fontSize: '0.68rem',
            color: 'var(--color-text-muted)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: '#2ed573' }}></span>
            <span>Libertadores / Champions</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: '#00d2d3' }}></span>
            <span>Pré-Libertadores / Europa League</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: '#ffa502' }}></span>
            <span>Sul-Americana</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: '#ff4757' }}></span>
            <span>Rebaixamento</span>
          </div>
        </div>
      </div>

      <style>{`
        .standings-row:hover {
          background: rgba(255, 255, 255, 0.04) !important;
        }
      `}</style>
    </div>
  );
};

export default StandingsTable;

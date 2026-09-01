import React, { useState } from 'react';
import type { MatchLineup } from '../../types/api';
import { GlossaryTerm } from '../common/GlossaryTerm';

interface PitchLineupProps {
  lineups: MatchLineup[];
}

export const PitchLineup: React.FC<PitchLineupProps> = ({ lineups }) => {
  const [activeTeamIndex, setActiveTeamIndex] = useState<number>(0);

  if (!lineups || lineups.length < 2) {
    return (
      <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '20px 0', fontSize: '0.85rem' }}>
        Escalações indisponíveis para este jogo.
      </div>
    );
  }

  const currentLineup = lineups[activeTeamIndex];
  const { formation, startXI, substitutes, coach } = currentLineup;

  // Função para parsear a posição do jogador baseada nas coordenadas grid ("linha:coluna") da API-Football
  // Coordenadas típicas: Y:X (Y = linha de 1 a 5, X = coluna de 1 a 5)
  const getPlayerPosition = (grid: string | null) => {
    if (!grid) return { top: '50%', left: '50%' };
    
    const [yStr, xStr] = grid.split(':');
    const y = parseInt(yStr, 10);
    const x = parseInt(xStr, 10);

    // Ajusta coordenadas verticais (linha Y)
    // No gol (Y=1) -> fica na base do campo (~88% top)
    // No ataque (Y=4 ou 5) -> fica no topo do campo (~12% top)
    let topPercent = 88;
    if (y > 1) {
      // Distribui as linhas entre 18% e 68% do topo
      topPercent = 88 - (y - 1) * 18;
    }

    // Ajusta coordenadas horizontais (coluna X)
    // Ex: se X vai de 1 a 5, distribui lateralmente de 10% a 90%
    let leftPercent = 50;
    if (x) {
      // Se tivermos apenas 1 jogador na linha (ex: goleiro ou centroavante isolado)
      leftPercent = 50;
      
      // Mapeamento dinâmico para espalhar
      // Se considerarmos colunas de 1 a 5
      const colsInRow = startXI.filter(p => p.player.grid?.startsWith(`${y}:`)).length;
      if (colsInRow > 1) {
        // Encontra o index do jogador atual nesta linha específica
        const rowPlayers = startXI
          .filter(p => p.player.grid?.startsWith(`${y}:`))
          .sort((a, b) => {
            const ax = parseInt(a.player.grid?.split(':')[1] || '0', 10);
            const bx = parseInt(b.player.grid?.split(':')[1] || '0', 10);
            return ax - bx;
          });
        const idx = rowPlayers.findIndex(p => p.player.id === startXI.find(s => s.player.grid === grid)?.player.id);
        
        if (colsInRow === 2) {
          leftPercent = idx === 0 ? 30 : 70;
        } else if (colsInRow === 3) {
          leftPercent = idx === 0 ? 20 : idx === 1 ? 50 : 80;
        } else if (colsInRow === 4) {
          leftPercent = idx === 0 ? 15 : idx === 1 ? 38 : idx === 2 ? 62 : 85;
        } else if (colsInRow === 5) {
          leftPercent = idx === 0 ? 12 : idx === 1 ? 31 : idx === 2 ? 50 : idx === 3 ? 69 : 88;
        } else {
          leftPercent = 15 + (idx / (colsInRow - 1)) * 70;
        }
      }
    }

    return {
      top: `${topPercent}%`,
      left: `${leftPercent}%`
    };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Botões para alternar entre time Mandante e Visitante */}
      <div 
        style={{ 
          display: 'flex', 
          backgroundColor: 'rgba(255,255,255,0.03)', 
          border: '1px solid var(--border-color)', 
          borderRadius: '10px', 
          padding: '2px' 
        }}
      >
        {lineups.map((l, index) => (
          <button
            key={l.team.id}
            onClick={() => setActiveTeamIndex(index)}
            style={{
              flex: 1,
              background: activeTeamIndex === index ? 'var(--color-primary)' : 'none',
              color: activeTeamIndex === index ? '#fff' : 'var(--color-text-muted)',
              border: 'none',
              padding: '8px 12px',
              fontSize: '0.8rem',
              fontWeight: '700',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              textAlign: 'center',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              overflow: 'hidden'
            }}
          >
            {l.team.name} ({l.formation})
          </button>
        ))}
      </div>

      {/* Visualização do Campo Tático */}
      <div className="pitch-container">
        <div className="pitch-formation">
          {startXI.map((playerItem) => {
            const { player } = playerItem;
            const posStyles = getPlayerPosition(player.grid);
            const isHomeTheme = activeTeamIndex === 0;

            return (
              <div 
                key={player.id} 
                className="pitch-player"
                style={{
                  position: 'absolute',
                  top: posStyles.top,
                  left: posStyles.left,
                  transform: 'translate(-50%, -50%)',
                  zIndex: 2,
                  transition: 'all 0.3s ease'
                }}
              >
                <div 
                  className="player-jersey"
                  style={{
                    backgroundColor: isHomeTheme ? 'var(--color-primary)' : 'var(--color-success)',
                    borderColor: '#ffffff',
                    borderWidth: '2px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.4)'
                  }}
                >
                  {player.number}
                </div>
                <span className="player-name-pitch">
                  {player.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Informações Técnicas e Banco de Reservas */}
      <div 
        style={{ 
          padding: '12px', 
          backgroundColor: 'rgba(255,255,255,0.02)', 
          border: '1px solid var(--border-color)', 
          borderRadius: '12px',
          fontSize: '0.8rem'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '6px', marginBottom: '8px', color: 'var(--color-text-muted)' }}>
          <span>Técnico: <strong style={{ color: '#fff' }}>{coach.name || 'N/A'}</strong></span>
          <span><GlossaryTerm termKey="formação">Formação</GlossaryTerm>: <strong style={{ color: '#fff' }}>{formation}</strong></span>
        </div>

        {/* Reservas */}
        <div>
          <h4 style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', fontWeight: '800', marginBottom: '6px', textTransform: 'uppercase' }}>
            Suplentes / Reservas:
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
            {substitutes.map((sub) => (
              <div key={sub.player.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 0' }}>
                <span 
                  style={{ 
                    fontSize: '0.7rem', 
                    fontWeight: '700', 
                    color: 'var(--color-text-muted)', 
                    width: '18px', 
                    textAlign: 'center',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    borderRadius: '4px'
                  }}
                >
                  {sub.player.number}
                </span>
                <span style={{ color: 'rgba(255,255,255,0.85)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {sub.player.name}
                </span>
                <span style={{ fontSize: '0.65rem', color: 'var(--color-text-dark)' }}>
                  ({sub.player.pos})
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PitchLineup;

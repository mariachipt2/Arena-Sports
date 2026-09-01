import React from 'react';
import type { ApiFixture } from '../../types/api';
import { MatchCard } from './MatchCard';
import { AlertCircle } from 'lucide-react';

interface MatchGridProps {
  matches: ApiFixture[];
  onMatchSelect: (match: ApiFixture) => void;
  emptyMessage?: string;
}

interface GroupedMatches {
  [leagueName: string]: {
    logo: string;
    flag: string | null;
    matches: ApiFixture[];
  };
}

export const MatchGrid: React.FC<MatchGridProps> = ({ 
  matches, 
  onMatchSelect, 
  emptyMessage = "Nenhum jogo disponível no momento." 
}) => {
  
  if (matches.length === 0) {
    return (
      <div 
        className="glass-panel" 
        style={{ 
          padding: '40px 20px', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          gap: '12px',
          textAlign: 'center',
          marginTop: '20px'
        }}
      >
        <AlertCircle size={32} style={{ color: 'var(--color-text-dark)' }} />
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', fontWeight: '500' }}>
          {emptyMessage}
        </p>
      </div>
    );
  }

  // Agrupa os jogos por campeonato
  const grouped: GroupedMatches = {};
  
  matches.forEach(match => {
    const key = `${match.league.country} - ${match.league.name}`;
    if (!grouped[key]) {
      grouped[key] = {
        logo: match.league.logo,
        flag: match.league.flag,
        matches: []
      };
    }
    grouped[key].matches.push(match);
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '16px' }}>
      {Object.entries(grouped).map(([leagueKey, group]) => (
        <div key={leagueKey}>
          {/* Cabeçalho da Liga */}
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              paddingBottom: '8px', 
              borderBottom: '1px solid rgba(255,255,255,0.04)',
              marginBottom: '12px'
            }}
          >
            {group.logo && (
              <img 
                src={group.logo} 
                alt={leagueKey} 
                width={20} 
                height={20} 
                style={{ objectFit: 'contain', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '4px', padding: '2px' }} 
              />
            )}
            <h2 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
              {leagueKey}
            </h2>
            {group.flag && (
              <img 
                src={group.flag} 
                alt="" 
                width={14} 
                style={{ marginLeft: '4px', borderRadius: '2px' }} 
              />
            )}
          </div>

          {/* Grid de Cards */}
          <div className="matches-grid">
            {group.matches.map(match => (
              <MatchCard 
                key={match.fixture.id} 
                match={match} 
                onClick={() => onMatchSelect(match)} 
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MatchGrid;

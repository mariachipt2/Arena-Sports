import React from 'react';
import type { MatchStatistics } from '../../types/api';
import { GlossaryTerm } from '../common/GlossaryTerm';

interface StatsComparisonProps {
  statistics: MatchStatistics[];
  homeTeamName: string;
  awayTeamName: string;
}

const getGlossaryKeyForStat = (type: string): string => {
  const dict: { [key: string]: string } = {
    'Ball Possession': 'posse',
    'Total Shots': 'finalizações',
    'Shots on Goal': 'chutes no gol',
    'Corner Kicks': 'escanteio',
    'Fouls': 'faltas',
    'Offsides': 'impedimento',
    'Expected Goals': 'xg'
  };
  return dict[type] || '';
};

export const StatsComparison: React.FC<StatsComparisonProps> = ({
  statistics,
  homeTeamName,
  awayTeamName
}) => {
  if (!statistics || statistics.length < 2) {
    return (
      <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '20px 0', fontSize: '0.85rem' }}>
        Estatísticas indisponíveis para este jogo.
      </div>
    );
  }

  const homeStats = statistics[0].statistics;
  const awayStats = statistics[1].statistics;

  const parseValue = (val: string | number | null): number => {
    if (val === null) return 0;
    if (typeof val === 'number') return val;
    return parseInt(val.replace('%', ''), 10) || 0;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '10px 0' }}>
      
      {/* Legenda do Cabeçalho */}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: '800', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '6px' }}>
        <span style={{ color: 'var(--color-primary)' }}>{homeTeamName.toUpperCase()}</span>
        <span style={{ color: 'var(--color-text-muted)' }}>MÉTRICAS</span>
        <span style={{ color: 'var(--color-success-mint)' }}>{awayTeamName.toUpperCase()}</span>
      </div>

      {homeStats.map((stat, index) => {
        const homeValRaw = stat.value;
        const awayValRaw = awayStats[index]?.value;

        const homeNum = parseValue(homeValRaw);
        const awayNum = parseValue(awayValRaw);
        const total = homeNum + awayNum;

        let homePercent = 50;
        let awayPercent = 50;

        if (total > 0) {
          homePercent = (homeNum / total) * 100;
          awayPercent = (awayNum / total) * 100;
        }

        const glossaryKey = getGlossaryKeyForStat(stat.type);
        const label = translateStatType(stat.type);

        return (
          <div key={stat.type} className="stat-bar-container">
            <div className="stat-header">
              <span className="tabular-nums" style={{ color: '#fff', fontWeight: '700' }}>
                {homeValRaw ?? 0}
              </span>
              
              {glossaryKey ? (
                <GlossaryTerm termKey={glossaryKey}>{label}</GlossaryTerm>
              ) : (
                <span>{label}</span>
              )}
              
              <span className="tabular-nums" style={{ color: '#fff', fontWeight: '700' }}>
                {awayValRaw ?? 0}
              </span>
            </div>
            
            <div className="stat-progress-bar">
              <div 
                className="stat-progress-home" 
                style={{ width: `${homePercent}%` }}
              ></div>
              <div 
                className="stat-progress-away" 
                style={{ width: `${awayPercent}%` }}
              ></div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const translateStatType = (type: string): string => {
  const dict: { [key: string]: string } = {
    'Ball Possession': 'Posse de Bola',
    'Total Shots': 'Finalizações',
    'Shots on Goal': 'Chutes no Gol',
    'Shots off Goal': 'Chutes para Fora',
    'Blocked Shots': 'Chutes Bloqueados',
    'Shots insidebox': 'Chutes da Grande Área',
    'Shots outsidebox': 'Chutes de Fora da Área',
    'Fouls': 'Faltas Cometidas',
    'Corner Kicks': 'Escanteios',
    'Offsides': 'Impedimentos',
    'Yellow Cards': 'Cartões Amarelos',
    'Red Cards': 'Cartões Vermelhos',
    'Goalkeeper Saves': 'Defesas do Goleiro',
    'Total passes': 'Passes Totais',
    'Passes accurate': 'Passes Certos',
    'Passes %': 'Precisão de Passes',
    'Expected Goals': 'Gols Esperados (xG)'
  };
  return dict[type] || type;
};

export default StatsComparison;

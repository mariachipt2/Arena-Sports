import React, { useEffect } from 'react';
import { Trophy } from 'lucide-react';
import { TeamBadge } from '../common/TeamBadge';

interface ToastGoalProps {
  scoringTeam: { name: string; logo: string };
  player: string;
  scoreHome: number;
  scoreAway: number;
  matchDescription: string; // Ex: "Flamengo vs Palmeiras"
  onClose: () => void;
}

export const ToastGoal: React.FC<ToastGoalProps> = ({
  scoringTeam,
  player,
  scoreHome,
  scoreAway,
  matchDescription,
  onClose
}) => {

  useEffect(() => {
    // Auto-fecha após 4 segundos
    const timer = setTimeout(() => {
      onClose();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="goal-toast">
      <div 
        style={{
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          backgroundColor: '#00ff87',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 10px #00ff87'
        }}
      >
        <Trophy size={16} color="#0b0e14" />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <TeamBadge name={scoringTeam.name} logoUrl={scoringTeam.logo} size={24} />
        <div>
          <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.9)' }}>
            GOL DO <span style={{ color: '#00ff87', fontWeight: '800' }}>{scoringTeam.name.toUpperCase()}</span>!
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: '500' }}>
            ⚽ {player} ({matchDescription})
          </div>
        </div>
      </div>

      <div 
        style={{ 
          fontSize: '1.2rem', 
          fontWeight: '900', 
          marginLeft: '8px', 
          borderLeft: '1px solid rgba(255,255,255,0.2)', 
          paddingLeft: '12px',
          color: '#fff'
        }}
        className="tabular-nums"
      >
        {scoreHome} - {scoreAway}
      </div>
    </div>
  );
};

export default ToastGoal;

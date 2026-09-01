import React, { useEffect, useState } from 'react';

interface ScoreBadgeProps {
  score: number | null;
  isLive: boolean;
  isWinner: boolean;
}

export const ScoreBadge: React.FC<ScoreBadgeProps> = ({ score, isLive, isWinner }) => {
  const [flash, setFlash] = useState(false);
  const displayScore = score === null ? '-' : score;

  // Ativa animação de piscar/glow quando o placar aumenta
  useEffect(() => {
    if (score !== null && score > 0) {
      setFlash(true);
      const timer = setTimeout(() => setFlash(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [score]);

  return (
    <span
      className={`tabular-nums team-score ${isWinner ? 'winner' : ''} ${
        flash ? 'animate-goal-flash' : ''
      }`}
      style={{
        display: 'inline-block',
        padding: '2px 8px',
        borderRadius: '6px',
        fontSize: '1.25rem',
        fontWeight: 800,
        backgroundColor: flash 
          ? 'rgba(16, 185, 129, 0.2)' 
          : (isLive ? 'rgba(255, 255, 255, 0.03)' : 'transparent'),
        color: flash 
          ? 'var(--color-success-neon)' 
          : (isWinner ? 'var(--color-success-neon)' : 'var(--color-text-main)'),
        transition: 'all 0.3s ease',
        boxShadow: flash ? '0 0 12px var(--color-success-neon)' : 'none',
        border: flash ? '1px solid var(--color-success-neon)' : '1px solid transparent'
      }}
    >
      {displayScore}
    </span>
  );
};

export default ScoreBadge;

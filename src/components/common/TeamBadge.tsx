import React, { useState } from 'react';

interface TeamBadgeProps {
  name: string;
  logoUrl: string;
  size?: number;
}

export const TeamBadge: React.FC<TeamBadgeProps> = ({ name, logoUrl, size = 32 }) => {
  const [error, setError] = useState(false);

  // Gera uma cor consistente baseada nas letras do nome para o fundo do fallback
  const getBackgroundColor = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colors = [
      '#1e3a8a', '#115e59', '#1e1b4b', '#701a75', 
      '#7c2d12', '#064e3b', '#180026', '#311005'
    ];
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  const getInitials = (str: string) => {
    const words = str.split(' ');
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return str.substring(0, 2).toUpperCase();
  };

  if (error || !logoUrl) {
    const bgColor = getBackgroundColor(name);
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        style={{
          borderRadius: '50%',
          backgroundColor: bgColor,
          boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
          flexShrink: 0
        }}
      >
        <text
          x="50%"
          y="55%"
          dominantBaseline="middle"
          textAnchor="middle"
          fill="#ffffff"
          fontSize="42"
          fontWeight="bold"
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          {getInitials(name)}
        </text>
      </svg>
    );
  }

  return (
    <img
      src={logoUrl}
      alt={name}
      width={size}
      height={size}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        objectFit: 'contain',
        borderRadius: '50%',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        padding: '2px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
        flexShrink: 0
      }}
      onError={() => setError(true)}
    />
  );
};

export default TeamBadge;

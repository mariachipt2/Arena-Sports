import React, { useState, useEffect } from 'react';
import type { ApiFixture } from '../../types/api';
import { MatchCard } from './MatchCard';
import { AlertCircle, Star, EyeOff, RotateCcw } from 'lucide-react';
import { storageService } from '../../services/storage';

interface MatchGridProps {
  matches: ApiFixture[];
  onMatchSelect: (match: ApiFixture) => void;
  emptyMessage?: string;
  onOpenSettings?: () => void;
}

interface LeagueGroup {
  id: number;
  name: string;
  country: string;
  logo: string;
  flag: string | null;
  matches: ApiFixture[];
}

export const MatchGrid: React.FC<MatchGridProps> = ({ 
  matches, 
  onMatchSelect, 
  emptyMessage = "Nenhum jogo disponível no momento.",
  onOpenSettings
}) => {
  const [followedLeagues, setFollowedLeagues] = useState<number[]>(() => storageService.getPreferences().selectedLeagues || []);
  const [hiddenCount, setHiddenCount] = useState<number>(() => storageService.getPreferences().hiddenLeagues?.length || 0);
  const [toastMessage, setToastMessage] = useState<{ text: string; undoLeagueId?: number } | null>(null);

  useEffect(() => {
    const syncPrefs = () => {
      const prefs = storageService.getPreferences();
      setFollowedLeagues(prefs.selectedLeagues || []);
      setHiddenCount(prefs.hiddenLeagues?.length || 0);
    };

    window.addEventListener('preferencesChanged', syncPrefs);
    return () => {
      window.removeEventListener('preferencesChanged', syncPrefs);
    };
  }, []);

  const handleToggleFollow = (e: React.MouseEvent, leagueId: number, leagueName: string) => {
    e.stopPropagation();
    const followed = storageService.toggleFollowLeague(leagueId, leagueName);
    setToastMessage({
      text: followed ? `⭐ Você agora segue a liga ${leagueName}` : `Deixou de seguir ${leagueName}`
    });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleHideLeague = (e: React.MouseEvent, leagueId: number, leagueName: string) => {
    e.stopPropagation();
    storageService.hideLeague(leagueId, leagueName);
    setToastMessage({
      text: `Liga "${leagueName}" ocultada. Você não seguirá mais esta liga.`,
      undoLeagueId: leagueId
    });
    setTimeout(() => setToastMessage(null), 5000);
  };

  const handleUndoHide = (leagueId: number) => {
    storageService.unhideLeague(leagueId);
    setToastMessage({
      text: `Liga reexibida no feed com sucesso!`
    });
    setTimeout(() => setToastMessage(null), 3000);
  };
  
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

        {hiddenCount > 0 && onOpenSettings && (
          <p style={{ fontSize: '0.78rem', color: 'var(--color-text-dark)', marginTop: '8px' }}>
            Você possui <strong>{hiddenCount}</strong> liga(s) que optou por não seguir/ocultar.{' '}
            <button
              onClick={onOpenSettings}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-primary)',
                textDecoration: 'underline',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Verificar nos Ajustes
            </button>
          </p>
        )}
      </div>
    );
  }

  // Agrupa os jogos por campeonato preservando o ID da liga
  const grouped: { [leagueKey: string]: LeagueGroup } = {};
  
  matches.forEach(match => {
    const key = `${match.league.country} - ${match.league.name}`;
    if (!grouped[key]) {
      grouped[key] = {
        id: match.league.id,
        name: match.league.name,
        country: match.league.country,
        logo: match.league.logo,
        flag: match.league.flag,
        matches: []
      };
    }
    grouped[key].matches.push(match);
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '16px' }}>
      
      {/* Toast informativo de Seguir / Não Seguir Liga */}
      {toastMessage && (
        <div 
          style={{
            position: 'fixed',
            top: '72px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(23, 25, 33, 0.95)',
            backdropFilter: 'blur(16px)',
            border: '1px solid var(--border-color-glow)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.4), 0 0 16px var(--border-color-glow)',
            color: '#fff',
            padding: '10px 18px',
            borderRadius: '999px',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '0.8rem',
            fontWeight: '600',
            animation: 'slide-up 0.25s ease-out'
          }}
        >
          <span>{toastMessage.text}</span>
          {toastMessage.undoLeagueId && (
            <button
              onClick={() => handleUndoHide(toastMessage.undoLeagueId!)}
              style={{
                background: 'var(--color-primary)',
                color: '#fff',
                border: 'none',
                borderRadius: '999px',
                padding: '3px 10px',
                fontSize: '0.72rem',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <RotateCcw size={11} />
              <span>Desfazer</span>
            </button>
          )}
        </div>
      )}

      {Object.entries(grouped).map(([leagueKey, group]) => {
        const isFollowed = followedLeagues.includes(group.id);

        return (
          <div key={leagueKey}>
            {/* Cabeçalho da Liga com Opções de Seguir / Não Seguir */}
            <div 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                paddingBottom: '8px', 
                borderBottom: '1px solid rgba(255,255,255,0.04)',
                marginBottom: '12px',
                flexWrap: 'wrap',
                gap: '8px'
              }}
            >
              {/* Identificação da Liga */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '1 1 auto', minWidth: '180px' }}>
                {group.logo && (
                  <img 
                    src={group.logo} 
                    alt={group.name} 
                    width={20} 
                    height={20} 
                    style={{ objectFit: 'contain', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '4px', padding: '2px' }} 
                  />
                )}
                <h2 style={{ fontSize: '0.88rem', fontWeight: '700', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                  {leagueKey}
                </h2>
                {group.flag && (
                  <img 
                    src={group.flag} 
                    alt="" 
                    width={14} 
                    style={{ marginLeft: '2px', borderRadius: '2px' }} 
                  />
                )}
              </div>

              {/* Ações da Liga: Seguir / Não Seguir */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {/* Botão Seguir / Seguindo */}
                <button
                  onClick={(e) => handleToggleFollow(e, group.id, group.name)}
                  style={{
                    background: isFollowed ? 'rgba(157, 124, 252, 0.15)' : 'rgba(255,255,255,0.03)',
                    border: isFollowed ? '1px solid var(--color-primary)' : '1px solid var(--border-color)',
                    color: isFollowed ? '#fff' : 'var(--color-text-muted)',
                    borderRadius: '999px',
                    padding: '3px 10px',
                    fontSize: '0.7rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'all 0.15s'
                  }}
                  title={isFollowed ? "Você está seguindo esta liga (clique para deixar de seguir)" : "Seguir esta liga (adicionar às Minhas Ligas)"}
                >
                  <Star 
                    size={11} 
                    fill={isFollowed ? 'var(--color-warning)' : 'none'} 
                    color={isFollowed ? 'var(--color-warning)' : 'currentColor'} 
                  />
                  <span>{isFollowed ? 'Seguindo' : 'Seguir'}</span>
                </button>

                {/* Botão Não Seguir / Ocultar do Feed */}
                <button
                  onClick={(e) => handleHideLeague(e, group.id, group.name)}
                  style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--color-text-muted)',
                    borderRadius: '999px',
                    padding: '3px 10px',
                    fontSize: '0.7rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'all 0.15s'
                  }}
                  title="Não seguir esta liga (ocultar do feed de jogos ao vivo)"
                >
                  <EyeOff size={11} />
                  <span>Não seguir</span>
                </button>
              </div>
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
        );
      })}

      {/* Rodapé informativo quando há ligas não seguidas/ocultadas */}
      {hiddenCount > 0 && (
        <div 
          style={{
            textAlign: 'center',
            padding: '12px 16px',
            background: 'rgba(255,255,255,0.02)',
            borderRadius: '12px',
            border: '1px dashed var(--border-color)',
            fontSize: '0.75rem',
            color: 'var(--color-text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginTop: '8px',
            flexWrap: 'wrap'
          }}
        >
          <EyeOff size={13} style={{ flexShrink: 0 }} />
          <span>{hiddenCount} liga(s) que você optou por não seguir estão ocultadas.</span>
          {onOpenSettings && (
            <button 
              onClick={onOpenSettings} 
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-primary)',
                cursor: 'pointer',
                fontWeight: '700',
                textDecoration: 'underline',
                fontSize: '0.75rem'
              }}
            >
              Gerenciar nos Ajustes
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default MatchGrid;

import React, { useEffect, useState } from 'react';
import { Settings, Clock, Activity, Calendar, CheckCircle2, Star, Search } from 'lucide-react';
import { useTeamTheme } from '../../hooks/useTeamTheme';
import type { TabType } from '../../types/dashboard';

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onRefresh?: () => void;
  isUpdating?: boolean;
  liveCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  liveCount = 0
}) => {
  const { currentTheme, isCustomThemeActive, resetTheme } = useTeamTheme();
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    // Atualiza relógio local
    const updateClock = () => {
      const d = new Date();
      setTime(d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <header className="header-wrap">
      <div className="header-container">
        
        {/* Lado Esquerdo - Branding */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => setActiveTab('live')}>
          <div 
            style={{ 
              width: '36px', 
              height: '36px', 
              borderRadius: '10px', 
              background: 'linear-gradient(135deg, var(--color-primary), #ff7f66)',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(157, 124, 252, 0.4)'
            }}
          >
            <span style={{ fontWeight: '800', fontSize: '1.2rem', color: '#fff', fontStyle: 'italic' }}>A</span>
          </div>
          <div>
            <h1 style={{ fontSize: '1.1rem', fontWeight: '800', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '4px' }}>
              ARENA <span style={{ color: 'var(--color-primary)' }}>SCORES</span>
            </h1>
            <p style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', fontWeight: '600' }}>FUTEBOL EM TEMPO REAL</p>
          </div>
        </div>

        {/* Centro - Navegação Desktop (Tabs) */}
        <nav className="desktop-nav-tabs">
          <button 
            className={`desktop-nav-item ${activeTab === 'live' ? 'active' : ''}`}
            onClick={() => setActiveTab('live')}
          >
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Activity size={16} />
              <span>Ao Vivo</span>
              {liveCount > 0 && (
                <span className="desktop-nav-badge tabular-nums">
                  {liveCount}
                </span>
              )}
            </div>
          </button>

          <button 
            className={`desktop-nav-item ${activeTab === 'upcoming' ? 'active' : ''}`}
            onClick={() => setActiveTab('upcoming')}
          >
            <Calendar size={16} />
            <span>Próximos</span>
          </button>

          <button 
            className={`desktop-nav-item ${activeTab === 'finished' ? 'active' : ''}`}
            onClick={() => setActiveTab('finished')}
          >
            <CheckCircle2 size={16} />
            <span>Resultados</span>
          </button>

          <button 
            className={`desktop-nav-item ${activeTab === 'favorites' ? 'active' : ''}`}
            onClick={() => setActiveTab('favorites')}
          >
            <Star size={16} />
            <span>Favoritos</span>
          </button>
        </nav>

        {/* Lado Direito - Busca, Status, Relógio e Ações */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          
          {/* Barra de Busca (Desktop) */}
          <div className="search-desktop-only" style={{ position: 'relative', width: '200px' }}>
            <input
              type="text"
              placeholder="Buscar time ou liga..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-color)',
                borderRadius: '999px',
                padding: '7px 14px 7px 32px',
                color: '#fff',
                fontSize: '0.78rem',
                outline: 'none',
                transition: 'all 0.2s ease'
              }}
            />
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5, color: '#fff' }} />
          </div>

          {/* Relógio Local */}
          <div className="clock-badge-header" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', color: 'var(--color-text-muted)', fontWeight: '600' }}>
            <Clock size={13} />
            <span className="tabular-nums">{time}</span>
          </div>


          {/* Indicador de Tema do Time Ativo */}
          {isCustomThemeActive && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 10px',
                borderRadius: '8px',
                background: 'var(--color-primary-glow)',
                border: '1px solid var(--border-color-glow)',
                fontSize: '0.74rem',
                fontWeight: '700',
                color: 'var(--color-primary)',
                boxShadow: '0 0 12px var(--border-color-glow)'
              }}
              title={`Tema ativo: ${currentTheme.name}. Clique no X para restaurar o tema padrão.`}
            >
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: currentTheme.primaryColor,
                  boxShadow: `0 0 8px ${currentTheme.primaryColor}`
                }}
              />
              <span style={{ whiteSpace: 'nowrap' }}>{currentTheme.name}</span>
              <button
                onClick={resetTheme}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-text-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 2px',
                  marginLeft: '2px',
                  fontSize: '0.85rem',
                  fontWeight: 'bold',
                  lineHeight: 1
                }}
                title="Restaurar tema original Arena Scores"
              >
                ×
              </button>
            </div>
          )}

          {/* Botão de Configurações */}
          <button

            onClick={() => setActiveTab('settings')}
            style={{
              background: 'none',
              color: activeTab === 'settings' ? 'var(--color-primary)' : 'var(--color-text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '6px',
              borderRadius: '8px',
              backgroundColor: activeTab === 'settings' ? 'rgba(157,124,252,0.12)' : 'rgba(255,255,255,0.03)',
              border: activeTab === 'settings' ? '1px solid var(--color-primary)' : '1px solid var(--border-color)',
              transition: 'all 0.2s'
            }}
            title="Configurações"
          >
            <Settings size={14} />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
        .desktop-nav-tabs {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-color);
          border-radius: 999px;
          padding: 4px 6px;
        }
        .desktop-nav-item {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: 999px;
          border: none;
          background: transparent;
          color: var(--color-text-muted);
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .desktop-nav-item:hover {
          color: #fff;
          background: rgba(255, 255, 255, 0.05);
        }
        .desktop-nav-item.active {
          color: #fff;
          background: var(--color-primary);
          box-shadow: 0 2px 10px rgba(157, 124, 252, 0.35);
        }
        .desktop-nav-badge {
          background: var(--color-accent);
          color: #fff;
          font-size: 0.65rem;
          font-weight: 800;
          padding: 1px 6px;
          border-radius: 999px;
          box-shadow: 0 0 8px rgba(255, 127, 102, 0.5);
        }
        @media (max-width: 768px) {
          .desktop-nav-tabs, .search-desktop-only, .clock-badge-header {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;


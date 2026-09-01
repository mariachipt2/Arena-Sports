import React from 'react';
import { Activity, Calendar, CheckCircle2, Star, Settings } from 'lucide-react';
import type { TabType } from '../../types/dashboard';

interface BottomNavProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  liveCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab, liveCount }) => {
  return (
    <nav className="bottom-nav bottom-nav-mobile-only">
      
      {/* Tab: Ao Vivo */}
      <button 
        className={`bottom-nav-item ${activeTab === 'live' ? 'active' : ''}`}
        onClick={() => setActiveTab('live')}
        style={{ background: 'none', border: 'none' }}
      >
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Activity size={20} />
          {liveCount > 0 && (
            <span 
              style={{ 
                position: 'absolute', 
                top: '-6px', 
                right: '-8px', 
                background: 'var(--color-danger)', 
                color: '#fff', 
                fontSize: '0.55rem', 
                fontWeight: '800',
                padding: '1px 5px',
                borderRadius: '999px',
                boxShadow: '0 0 5px rgba(239, 68, 68, 0.5)'
              }}
              className="tabular-nums"
            >
              {liveCount}
            </span>
          )}
        </div>
        <span>Ao Vivo</span>
      </button>

      {/* Tab: Próximos */}
      <button 
        className={`bottom-nav-item ${activeTab === 'upcoming' ? 'active' : ''}`}
        onClick={() => setActiveTab('upcoming')}
        style={{ background: 'none', border: 'none' }}
      >
        <Calendar size={20} />
        <span>Próximos</span>
      </button>

      {/* Tab: Resultados */}
      <button 
        className={`bottom-nav-item ${activeTab === 'finished' ? 'active' : ''}`}
        onClick={() => setActiveTab('finished')}
        style={{ background: 'none', border: 'none' }}
      >
        <CheckCircle2 size={20} />
        <span>Resultados</span>
      </button>

      {/* Tab: Favoritos */}
      <button 
        className={`bottom-nav-item ${activeTab === 'favorites' ? 'active' : ''}`}
        onClick={() => setActiveTab('favorites')}
        style={{ background: 'none', border: 'none' }}
      >
        <Star size={20} />
        <span>Favoritos</span>
      </button>

      {/* Tab: Configurações */}
      <button 
        className={`bottom-nav-item ${activeTab === 'settings' ? 'active' : ''}`}
        onClick={() => setActiveTab('settings')}
        style={{ background: 'none', border: 'none' }}
      >
        <Settings size={20} />
        <span>Ajustes</span>
      </button>

      <style>{`
        /* Oculta em Desktop e exibe apenas em telas de celular */
        @media (min-width: 769px) {
          .bottom-nav-mobile-only {
            display: none !important;
          }
        }
      `}</style>
    </nav>
  );
};

export default BottomNav;

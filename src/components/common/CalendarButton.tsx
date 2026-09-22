import React, { useState, useRef, useEffect } from 'react';
import { CalendarPlus, Check, ExternalLink, Download } from 'lucide-react';
import type { ApiFixture } from '../../types/api';
import { calendarUtils } from '../../utils/calendar';

interface CalendarButtonProps {
  match: ApiFixture;
  variant?: 'compact' | 'full';
}

export const CalendarButton: React.FC<CalendarButtonProps> = ({ match, variant = 'full' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleGoogleCalendar = (e: React.MouseEvent) => {
    e.stopPropagation();
    calendarUtils.openGoogleCalendar(match);
    setFeedback('Google');
    setTimeout(() => {
      setFeedback(null);
      setIsOpen(false);
    }, 1500);
  };

  const handleAppleCalendar = (e: React.MouseEvent) => {
    e.stopPropagation();
    calendarUtils.downloadIcsFile(match);
    setFeedback('Apple (.ics)');
    setTimeout(() => {
      setFeedback(null);
      setIsOpen(false);
    }, 1500);
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }} ref={menuRef}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        title="Adicionar jogo ao Calendário Google ou Apple"
        style={{
          background: isOpen ? 'var(--color-primary-glow)' : 'rgba(255,255,255,0.04)',
          border: isOpen ? '1px solid var(--color-primary)' : '1px solid var(--border-color)',
          borderRadius: '8px',
          padding: variant === 'compact' ? '4px 8px' : '5px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '0.72rem',
          fontWeight: '700',
          color: isOpen ? 'var(--color-primary)' : 'var(--color-text-main)',
          cursor: 'pointer',
          transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        className="calendar-btn-trigger"
      >
        <CalendarPlus size={13} style={{ color: 'var(--color-primary)' }} />
        {variant === 'full' && <span>Adicionar à Agenda</span>}
      </button>

      {/* Dropdown Menu com visual Glassmorphism */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(22, 25, 33, 0.95)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.5), 0 0 16px var(--border-color-glow)',
            padding: '6px',
            minWidth: '210px',
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            animation: 'fadeInMenu 0.18s ease-out'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ padding: '6px 8px 4px 8px', fontSize: '0.65rem', fontWeight: '800', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Salvar Partida na Agenda
          </div>

          {/* Opção 1: Google Agenda */}
          <button
            onClick={handleGoogleCalendar}
            style={{
              background: 'transparent',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              color: '#fff',
              fontSize: '0.78rem',
              fontWeight: '600',
              textAlign: 'left',
              transition: 'background 0.15s'
            }}
            className="calendar-dropdown-item"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1rem' }}>🗓️</span>
              <div>
                <div>Google Agenda</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>Abre direto no navegador</div>
              </div>
            </div>
            {feedback === 'Google' ? (
              <Check size={14} style={{ color: 'var(--color-success-mint)' }} />
            ) : (
              <ExternalLink size={13} style={{ color: 'var(--color-text-muted)' }} />
            )}
          </button>

          {/* Opção 2: Apple Calendário / iCal */}
          <button
            onClick={handleAppleCalendar}
            style={{
              background: 'transparent',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              color: '#fff',
              fontSize: '0.78rem',
              fontWeight: '600',
              textAlign: 'left',
              transition: 'background 0.15s'
            }}
            className="calendar-dropdown-item"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1rem' }}>🍏</span>
              <div>
                <div>Apple / iCal (.ics)</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>Com alarme 15 min antes</div>
              </div>
            </div>
            {feedback?.includes('Apple') ? (
              <Check size={14} style={{ color: 'var(--color-success-mint)' }} />
            ) : (
              <Download size={13} style={{ color: 'var(--color-text-muted)' }} />
            )}
          </button>
        </div>
      )}

      <style>{`
        @keyframes fadeInMenu {
          from {
            opacity: 0;
            transform: translate(-50%, -6px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
        .calendar-dropdown-item:hover {
          background: rgba(255, 255, 255, 0.08) !important;
        }
        .calendar-btn-trigger:hover {
          border-color: var(--color-primary) !important;
          color: #fff !important;
        }
      `}</style>
    </div>
  );
};

export default CalendarButton;

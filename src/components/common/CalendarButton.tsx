import React, { useState, useRef, useEffect } from 'react';
import { CalendarPlus, Check, ExternalLink, Download, Bell, BellOff, Smartphone, Sparkles } from 'lucide-react';
import type { ApiFixture } from '../../types/api';
import { calendarUtils } from '../../utils/calendar';
import { notificationService } from '../../services/notificationService';

interface CalendarButtonProps {
  match: ApiFixture;
  variant?: 'compact' | 'full';
}

export const CalendarButton: React.FC<CalendarButtonProps> = ({ match, variant = 'full' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isScheduled, setIsScheduled] = useState<boolean>(() =>
    notificationService.isReminderScheduled(match.fixture.id)
  );
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkScheduled = () => {
      setIsScheduled(notificationService.isReminderScheduled(match.fixture.id));
    };

    window.addEventListener('remindersChanged', checkScheduled);
    return () => {
      window.removeEventListener('remindersChanged', checkScheduled);
    };
  }, [match.fixture.id]);

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

  const handleTogglePhoneNotification = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isScheduled) {
      notificationService.cancelReminder(match.fixture.id);
      setIsScheduled(false);
      setFeedback('Lembrete cancelado');
    } else {
      const success = await notificationService.scheduleReminder(match, 15);
      if (success) {
        setIsScheduled(true);
        setFeedback('Alerta ativado no celular!');
      } else {
        setFeedback('Permissão negada');
      }
    }
    setTimeout(() => {
      setFeedback(null);
    }, 2500);
  };

  const handleGoogleCalendar = (e: React.MouseEvent) => {
    e.stopPropagation();
    calendarUtils.openGoogleCalendar(match);
    setFeedback('Abrindo Google Agenda...');
    setTimeout(() => {
      setFeedback(null);
      setIsOpen(false);
    }, 2000);
  };

  const handleAppleCalendarSync = (e: React.MouseEvent) => {
    e.stopPropagation();
    calendarUtils.openAppleCalendar(match);
    const msg = calendarUtils.isIOS()
      ? 'Arquivo gerado! Toque para adicionar ao Calendário'
      : 'Arquivo .ics baixado com alarmes';
    setFeedback(msg);
    setTimeout(() => {
      setFeedback(null);
      setIsOpen(false);
    }, 2500);
  };

  const handleTestNotification = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const ok = await notificationService.testNotification();
    if (ok) {
      setFeedback('Notificação enviada ao celular!');
    } else {
      setFeedback('Permita notificações no navegador');
    }
    setTimeout(() => {
      setFeedback(null);
    }, 2500);
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }} ref={menuRef}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        title={isScheduled ? "Lembrete ativo no celular para esta partida" : "Adicionar à agenda ou ativar lembrete no celular"}
        style={{
          background: isScheduled
            ? 'rgba(46, 213, 115, 0.15)'
            : isOpen
            ? 'var(--color-primary-glow)'
            : 'rgba(255,255,255,0.04)',
          border: isScheduled
            ? '1px solid var(--color-success-mint)'
            : isOpen
            ? '1px solid var(--color-primary)'
            : '1px solid var(--border-color)',
          borderRadius: '8px',
          padding: variant === 'compact' ? '4px 8px' : '5px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '0.72rem',
          fontWeight: '700',
          color: isScheduled
            ? 'var(--color-success-mint)'
            : isOpen
            ? 'var(--color-primary)'
            : 'var(--color-text-main)',
          cursor: 'pointer',
          transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          boxShadow: isScheduled ? '0 0 10px rgba(46, 213, 115, 0.2)' : 'none'
        }}
        className="calendar-btn-trigger"
      >
        {isScheduled ? (
          <Bell size={13} style={{ color: 'var(--color-success-mint)', animation: 'pulse 1.5s infinite' }} />
        ) : (
          <CalendarPlus size={13} style={{ color: 'var(--color-primary)' }} />
        )}
        {variant === 'full' && (
          <span>{isScheduled ? 'Alerta Ativo' : 'Adicionar à Agenda'}</span>
        )}
      </button>

      {/* Dropdown Menu com visual Glassmorphism */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(18, 21, 28, 0.96)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '14px',
            boxShadow: '0 16px 40px rgba(0, 0, 0, 0.65), 0 0 20px rgba(0, 240, 255, 0.12)',
            padding: '8px',
            minWidth: '270px',
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            animation: 'fadeInMenu 0.18s ease-out'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Cabeçalho do menu */}
          <div style={{ padding: '6px 8px 4px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.65rem', fontWeight: '800', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Agenda & Notificações
            </span>
            {feedback && (
              <span style={{ fontSize: '0.65rem', fontWeight: '700', color: 'var(--color-success-mint)', animation: 'fadeIn 0.2s' }}>
                {feedback}
              </span>
            )}
          </div>

          {/* Destaque Principal: Alerta Push no Celular */}
          <button
            onClick={handleTogglePhoneNotification}
            style={{
              background: isScheduled ? 'rgba(46, 213, 115, 0.15)' : 'rgba(0, 240, 255, 0.08)',
              border: isScheduled ? '1px solid var(--color-success-mint)' : '1px solid rgba(0, 240, 255, 0.3)',
              borderRadius: '10px',
              padding: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              color: '#fff',
              fontSize: '0.78rem',
              fontWeight: '700',
              textAlign: 'left',
              transition: 'all 0.2s ease'
            }}
            className="calendar-dropdown-highlight"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '8px',
                  background: isScheduled ? 'rgba(46, 213, 115, 0.2)' : 'rgba(0, 240, 255, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {isScheduled ? (
                  <BellOff size={16} style={{ color: 'var(--color-success-mint)' }} />
                ) : (
                  <Bell size={16} style={{ color: 'var(--color-primary)' }} />
                )}
              </div>
              <div>
                <div style={{ color: isScheduled ? 'var(--color-success-mint)' : '#fff' }}>
                  {isScheduled ? 'Desativar Alerta no Celular' : '🔔 Notificar no Celular'}
                </div>
                <div style={{ fontSize: '0.66rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                  {isScheduled ? 'Aviso agendado 15 min antes' : 'Som + vibração 15 min antes do jogo'}
                </div>
              </div>
            </div>
            {isScheduled && <Check size={16} style={{ color: 'var(--color-success-mint)' }} />}
          </button>

          {/* Opção 1: Calendário do iPhone / Apple (.ics) */}
          <button
            onClick={handleAppleCalendarSync}
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
            title="Salvar evento no Calendário do iPhone ou exportar .ics"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Smartphone size={16} style={{ color: '#00f0ff' }} />
              <div>
                <div>Calendário do iPhone / Apple (.ics)</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>Com alarmes de 15m e 30m no aparelho</div>
              </div>
            </div>
            <Download size={13} style={{ color: 'var(--color-text-muted)' }} />
          </button>

          {/* Opção 2: Google Agenda */}
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
            title="Sincronizar evento na conta Google"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.05rem' }}>🗓️</span>
              <div>
                <div>Google Agenda</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>Sincroniza direto na conta Google</div>
              </div>
            </div>
            <ExternalLink size={13} style={{ color: 'var(--color-text-muted)' }} />
          </button>

          {/* Divisor */}
          <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', margin: '2px 0' }} />

          {/* Teste de Notificação no Aparelho */}
          <button
            onClick={handleTestNotification}
            style={{
              background: 'transparent',
              border: 'none',
              borderRadius: '6px',
              padding: '6px 8px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              color: 'var(--color-text-muted)',
              fontSize: '0.68rem',
              fontWeight: '600',
              textAlign: 'left',
              transition: 'color 0.15s'
            }}
            className="calendar-test-btn"
          >
            <Sparkles size={12} style={{ color: 'var(--color-primary)' }} />
            <span>Testar notificação agora no meu celular</span>
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
        .calendar-dropdown-highlight:hover {
          filter: brightness(1.1);
        }
        .calendar-test-btn:hover {
          color: #fff !important;
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

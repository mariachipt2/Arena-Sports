import React, { useState, useEffect } from 'react';
import { Save, Check, Sparkles, Database, Info, Palette, RotateCcw, Bell, Smartphone, Trash2, EyeOff } from 'lucide-react';
import { storageService } from '../../services/storage';
import { notificationService, type ScheduledReminder } from '../../services/notificationService';
import { useQuotaMonitor } from '../../hooks/useQuotaMonitor';
import { useTeamTheme } from '../../hooks/useTeamTheme';
import type { Preferences } from '../../types/dashboard';
import { POPULAR_LEAGUES } from '../../types/dashboard';

export const SettingsPanel: React.FC = () => {
  const { quota } = useQuotaMonitor();
  const { currentTheme, isCustomThemeActive, selectTheme, resetTheme, popularThemes } = useTeamTheme();
  const [prefs, setPrefs] = useState<Preferences>(() => storageService.getPreferences());
  const [saved, setSaved] = useState(false);
  const [notifPermission, setNotifPermission] = useState<NotificationPermission | 'unsupported'>(() =>
    notificationService.getPermissionStatus()
  );
  const [reminders, setReminders] = useState<ScheduledReminder[]>(() =>
    notificationService.getReminders()
  );
  const [testStatus, setTestStatus] = useState<string | null>(null);

  useEffect(() => {
    const updateNotifState = () => {
      setNotifPermission(notificationService.getPermissionStatus());
      setReminders(notificationService.getReminders());
    };

    window.addEventListener('notificationPermissionChanged', updateNotifState);
    window.addEventListener('remindersChanged', updateNotifState);

    return () => {
      window.removeEventListener('notificationPermissionChanged', updateNotifState);
      window.removeEventListener('remindersChanged', updateNotifState);
    };
  }, []);

  const handleLeagueToggle = (leagueId: number) => {
    const selected = [...prefs.selectedLeagues];
    const index = selected.indexOf(leagueId);
    if (index === -1) {
      selected.push(leagueId);
    } else {
      selected.splice(index, 1);
    }
    const updated = { ...prefs, selectedLeagues: selected };
    setPrefs(updated);

    // Auto-salva imediatamente no storage e na URL para garantir persistência instantânea no iPhone e PWA
    storageService.savePreferences(updated);
    window.dispatchEvent(new Event('preferencesChanged'));
  };

  const handleUnhideLeague = (leagueId: number) => {
    storageService.unhideLeague(leagueId);
    setPrefs(storageService.getPreferences());
  };

  const handleUnhideAllLeagues = () => {
    const updated = { ...prefs, hiddenLeagues: [] };
    storageService.savePreferences(updated);
    setPrefs(updated);
    window.dispatchEvent(new Event('preferencesChanged'));
  };

  const handleSave = () => {
    storageService.savePreferences(prefs);
    setSaved(true);

    // Dispara eventos customizados para forçar atualização no app
    window.dispatchEvent(new Event('preferencesChanged'));
    
    setTimeout(() => {
      setSaved(false);
    }, 2000);
  };

  const limit = quota?.limit ?? 100;
  const remaining = quota?.remaining ?? 35;
  const used = Math.max(0, limit - remaining);
  const percentUsed = Math.min(100, Math.max(0, Math.round((used / limit) * 100)));
  const quotaColor = percentUsed >= 80 ? '#ff4757' : percentUsed >= 50 ? '#ffa502' : '#2ed573';

  return (
    <div 
      className="glass-panel" 
      style={{ 
        padding: '24px', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '24px',
        maxWidth: '640px',
        margin: '20px auto 0 auto'
      }}
    >
      <div>
        <h2 style={{ fontSize: '1.2rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
          Configurações do Painel
        </h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
          Gerencie ligas prioritárias, temas de equipes e notificações no seu smartphone.
        </p>
      </div>

      {/* Card de Consumo da Cota da API Oficial */}
      <div style={{
        backgroundColor: 'rgba(255,255,255,0.02)',
        border: '1px solid var(--border-color)',
        borderRadius: '12px',
        padding: '14px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
          <span style={{ fontWeight: '700', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Database size={15} style={{ color: quotaColor }} />
            Cota Diária da API Oficial
          </span>
          <span style={{ fontWeight: '700', color: quotaColor }}>
            {percentUsed}% ({used} gastas / {remaining} restantes)
          </span>
        </div>

        {/* Barra de Progresso */}
        <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '999px', overflow: 'hidden' }}>
          <div style={{ width: `${percentUsed}%`, height: '100%', backgroundColor: quotaColor, transition: 'width 0.3s ease' }} />
        </div>

        <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '6px', lineHeight: '1.4' }}>
          <Info size={13} style={{ flexShrink: 0, opacity: 0.7 }} />
          <span>
            Conexão direta com a API oficial em tempo real. A cota é atualizada e reiniciada diariamente às 21:00 BRT.
          </span>
        </div>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.05)' }} />

      {/* Seção - Ligas Favoritas */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#fff' }}>Ligas que Deseja Seguir</h3>
          <span style={{ fontSize: '0.72rem', color: 'var(--color-primary)', fontWeight: '700' }}>
            {prefs.selectedLeagues.length} selecionada(s)
          </span>
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
          Selecione as ligas que deseja acompanhar. Elas serão exibidas na pílula <strong>⭐ Minhas Ligas</strong> e no topo de todos os jogos.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginTop: '6px' }}>
          {POPULAR_LEAGUES.map(league => {
            const isSelected = prefs.selectedLeagues.includes(league.id);
            return (
              <button
                key={league.id}
                onClick={() => handleLeagueToggle(league.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: isSelected ? '1px solid var(--color-primary)' : '1px solid var(--border-color)',
                  background: isSelected ? 'rgba(157, 124, 252, 0.1)' : 'rgba(255,255,255,0.01)',
                  color: isSelected ? '#fff' : 'var(--color-text-muted)',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  textAlign: 'left',
                  transition: 'all 0.15s'
                }}
              >
                <span>{league.name}</span>
                {isSelected ? (
                  <Check size={12} style={{ color: 'var(--color-primary)' }} />
                ) : (
                  <span style={{ width: '12px' }}></span>
                )}
              </button>
            );
          })}
        </div>

        <div style={{
          marginTop: '6px',
          padding: '8px 12px',
          borderRadius: '8px',
          background: 'rgba(157, 124, 252, 0.08)',
          border: '1px solid rgba(157, 124, 252, 0.2)',
          fontSize: '0.72rem',
          color: 'var(--color-text-muted)',
          lineHeight: '1.4'
        }}>
          📱 <strong style={{ color: '#fff' }}>Sincronização com o iPhone:</strong> Ao salvar, suas ligas são embutidas na URL e salvas no sistema. Ao tocar no Safari em <strong>Compartilhar &rarr; Adicionar à Tela de Início</strong>, seu atalho lembrará das suas preferências automaticamente!
        </div>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.05)' }} />

      {/* Seção - Ligas Ocultadas (Não Seguidas) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <EyeOff size={15} style={{ color: 'var(--color-warning)' }} />
            <span>Ligas Ocultadas (Não Seguidas)</span>
          </h3>
          {prefs.hiddenLeagues && prefs.hiddenLeagues.length > 0 && (
            <button
              onClick={handleUnhideAllLeagues}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-primary)',
                fontSize: '0.72rem',
                fontWeight: '700',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Reexibir Todas
            </button>
          )}
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
          Ligas que você optou por não acompanhar na tela do Ao Vivo. Elas ficam ocultadas do seu feed até que você decida reexibi-las.
        </p>

        {(!prefs.hiddenLeagues || prefs.hiddenLeagues.length === 0) ? (
          <div style={{
            padding: '12px 14px',
            borderRadius: '8px',
            backgroundColor: 'rgba(255,255,255,0.01)',
            border: '1px solid var(--border-color)',
            fontSize: '0.75rem',
            color: 'var(--color-text-muted)'
          }}>
            Nenhuma liga ocultada. Todas as partidas disponíveis são exibidas normalmente.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}>
            {prefs.hiddenLeagues.map(id => {
              const leagueName = prefs.hiddenLeagueNames?.[id] || POPULAR_LEAGUES.find(l => l.id === id)?.name || `Liga #${id}`;
              return (
                <div 
                  key={id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid var(--border-color)',
                    fontSize: '0.78rem'
                  }}
                >
                  <span style={{ fontWeight: '600', color: '#fff' }}>{leagueName}</span>
                  <button
                    onClick={() => handleUnhideLeague(id)}
                    style={{
                      background: 'rgba(157, 124, 252, 0.1)',
                      border: '1px solid var(--color-primary)',
                      color: '#fff',
                      borderRadius: '6px',
                      padding: '4px 10px',
                      fontSize: '0.7rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <RotateCcw size={11} />
                    <span>Reexibir / Seguir</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.05)' }} />

      {/* Seção - Tema Dinâmico por Clube */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Palette size={15} style={{ color: 'var(--color-primary)' }} />
              <span>Tema Dinâmico por Equipe</span>
            </h3>
            <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
              Escolha seu clube de coração para pintar todo o app com suas cores oficiais!
            </p>
          </div>

          {isCustomThemeActive && (
            <button
              onClick={resetTheme}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '4px 10px',
                fontSize: '0.7rem',
                fontWeight: '700',
                color: 'var(--color-text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
              title="Restaurar visual padrão do Arena Scores"
            >
              <RotateCcw size={12} />
              <span>Restaurar Padrão</span>
            </button>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '8px', maxHeight: '200px', overflowY: 'auto', paddingRight: '4px' }}>
          {popularThemes.map((team) => {
            const isActive = currentTheme.name === team.name;
            return (
              <button
                key={team.name}
                onClick={() => selectTheme(team)}
                style={{
                  padding: '8px 10px',
                  borderRadius: '10px',
                  border: isActive ? `2px solid ${team.primaryColor}` : '1px solid var(--border-color)',
                  background: isActive ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s'
                }}
              >
                <span
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: team.primaryColor,
                    boxShadow: `0 0 8px ${team.glowColor}`,
                    flexShrink: 0
                  }}
                />
                <span style={{ fontSize: '0.74rem', fontWeight: isActive ? '800' : '600', color: isActive ? '#fff' : 'var(--color-text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {team.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.05)' }} />

      {/* Seção - Notificações no Celular & Google Agenda */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div>
          <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bell size={16} style={{ color: 'var(--color-primary)' }} />
            <span>Notificações no Celular & Google Agenda</span>
          </h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
            Configure alertas sonoros no celular para início de partidas e gols em tempo real.
          </p>
        </div>

        {/* Card de Status da Permissão */}
        <div
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            padding: '14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Smartphone size={18} style={{ color: notifPermission === 'granted' ? 'var(--color-success-mint)' : 'var(--color-text-muted)' }} />
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#fff' }}>
                  Status das Notificações do Aparelho
                </div>
                <div style={{ fontSize: '0.7rem', color: notifPermission === 'granted' ? 'var(--color-success-mint)' : notifPermission === 'denied' ? '#ff4757' : 'var(--color-warning)' }}>
                  {notifPermission === 'granted' && '✅ Ativas e prontas para alertar no celular'}
                  {notifPermission === 'default' && '⏳ Permissão ainda não solicitada'}
                  {notifPermission === 'denied' && '❌ Bloqueadas no navegador (libere nas permissões do site)'}
                  {notifPermission === 'unsupported' && '⚠️ Navegador não suporta notificações nativas'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              {notifPermission !== 'granted' && notifPermission !== 'unsupported' && (
                <button
                  onClick={async () => {
                    await notificationService.requestPermission();
                  }}
                  style={{
                    background: 'var(--color-primary)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '6px 12px',
                    fontSize: '0.72rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                >
                  Ativar no Celular
                </button>
              )}

              <button
                onClick={async () => {
                  setTestStatus('Enviando teste...');
                  const ok = await notificationService.testNotification();
                  if (ok) {
                    setTestStatus('Notificação de teste enviada!');
                  } else {
                    setTestStatus('Falha: ative as notificações acima');
                  }
                  setTimeout(() => setTestStatus(null), 3000);
                }}
                style={{
                  background: 'rgba(0, 240, 255, 0.08)',
                  border: '1px solid rgba(0, 240, 255, 0.3)',
                  color: '#00f0ff',
                  borderRadius: '8px',
                  padding: '6px 12px',
                  fontSize: '0.72rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <Sparkles size={12} />
                <span>{testStatus || 'Testar no Aparelho'}</span>
              </button>
            </div>
          </div>

          {/* Dica de Integração com Google Agenda */}
          <div
            style={{
              padding: '10px',
              borderRadius: '8px',
              background: 'rgba(0, 240, 255, 0.04)',
              border: '1px solid rgba(0, 240, 255, 0.12)',
              fontSize: '0.72rem',
              color: 'var(--color-text-muted)',
              lineHeight: '1.4'
            }}
          >
            💡 <strong style={{ color: '#fff' }}>Google Agenda com Alarme:</strong> Ao clicar no botão de agenda de qualquer jogo, você pode adicionar a partida diretamente ao Google Agenda ou baixar o arquivo com alarmes sonoros automáticos de <strong>15 e 30 minutos antes</strong> do jogo.
          </div>
        </div>

        {/* Lembretes de Jogos Ativos */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#fff' }}>
              Partidas com Alerta Agendado ({reminders.filter(r => !r.notified).length})
            </span>
          </div>

          {reminders.filter(r => !r.notified).length === 0 ? (
            <div
              style={{
                padding: '16px',
                borderRadius: '10px',
                background: 'rgba(255,255,255,0.01)',
                border: '1px dashed var(--border-color)',
                textAlign: 'center',
                color: 'var(--color-text-muted)',
                fontSize: '0.74rem'
              }}
            >
              Nenhum alerta agendado. Clique no botão de agenda de qualquer jogo para receber notificação no celular!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '180px', overflowY: 'auto' }}>
              {reminders
                .filter(r => !r.notified)
                .map((rem) => {
                  const matchDate = new Date(rem.matchTime);
                  const dateStr = matchDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
                  const timeStr = matchDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

                  return (
                    <div
                      key={rem.fixtureId}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '8px',
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid var(--border-color)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#fff' }}>
                          ⚽ {rem.homeTeam} x {rem.awayTeam}
                        </span>
                        <span style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)' }}>
                          {rem.leagueName} • {dateStr} às {timeStr} (Aviso {rem.minutesBefore}m antes)
                        </span>
                      </div>
                      <button
                        onClick={() => notificationService.cancelReminder(rem.fixtureId)}
                        title="Remover alerta"
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--color-text-muted)',
                          cursor: 'pointer',
                          padding: '4px',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.05)' }} />

      {/* Botão Salvar */}
      <button

        onClick={handleSave}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          padding: '12px',
          backgroundColor: 'var(--color-primary)',
          color: '#fff',
          border: 'none',
          borderRadius: '12px',
          fontWeight: '700',
          fontSize: '0.88rem',
          cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(157, 124, 252, 0.3)',
          transition: 'all 0.2s'
        }}
      >
        {saved ? (
          <>
            <Check size={16} />
            <span>Configurações Salvas com Sucesso!</span>
          </>
        ) : (
          <>
            <Save size={16} />
            <span>Salvar Preferências</span>
          </>
        )}
      </button>
    </div>
  );
};

export default SettingsPanel;

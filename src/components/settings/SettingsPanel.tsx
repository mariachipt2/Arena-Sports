import React, { useState, useEffect } from 'react';
import { Save, Check, Sparkles, Database, Key } from 'lucide-react';
import { storageService } from '../../services/storage';
import type { Preferences } from '../../types/dashboard';
import { POPULAR_LEAGUES } from '../../types/dashboard';

export const SettingsPanel: React.FC = () => {
  const [prefs, setPrefs] = useState<Preferences>({
    apiKey: '',
    selectedLeagues: [],
    useSimulation: true
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setPrefs(storageService.getPreferences());
  }, []);

  const handleLeagueToggle = (leagueId: number) => {
    setPrefs(prev => {
      const selected = [...prev.selectedLeagues];
      const index = selected.indexOf(leagueId);
      if (index === -1) {
        selected.push(leagueId);
      } else {
        selected.splice(index, 1);
      }
      return { ...prev, selectedLeagues: selected };
    });
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
          Gerencie a fonte de dados, modo de simulação e ligas prioritárias.
        </p>
      </div>

      {/* Seção - Modo de Funcionamento */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h3 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#fff' }}>Fonte de Dados</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <button
            onClick={() => setPrefs(prev => ({ ...prev, useSimulation: true }))}
            style={{
              padding: '14px',
              borderRadius: '12px',
              border: prefs.useSimulation ? '1px solid var(--color-primary)' : '1px solid var(--border-color)',
              background: prefs.useSimulation ? 'rgba(157, 124, 252, 0.12)' : 'rgba(255,255,255,0.02)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '6px',
              textAlign: 'left'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={16} style={{ color: 'var(--color-success-mint)' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#fff' }}>Simulação Interativa</span>
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', lineHeight: '1.4' }}>
              Jogos ao vivo simulados, notificações de gols em tempo real e jogos agendados garantidos.
            </span>
          </button>

          <button
            onClick={() => setPrefs(prev => ({ ...prev, useSimulation: false }))}
            style={{
              padding: '14px',
              borderRadius: '12px',
              border: !prefs.useSimulation ? '1px solid var(--color-primary)' : '1px solid var(--border-color)',
              background: !prefs.useSimulation ? 'rgba(157, 124, 252, 0.12)' : 'rgba(255,255,255,0.02)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '6px',
              textAlign: 'left'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Database size={16} style={{ color: 'var(--color-primary)' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#fff' }}>API Real (API-Football)</span>
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', lineHeight: '1.4' }}>
              Consome dados reais e estatísticas oficiais da API-Football.
            </span>
          </button>
        </div>

        {/* Chave de API */}
        {!prefs.useSimulation && (
          <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Key size={13} />
              Chave API-Football (v3)
            </label>
            <input
              type="text"
              value={prefs.apiKey}
              onChange={(e) => setPrefs(prev => ({ ...prev, apiKey: e.target.value }))}
              placeholder="Insira sua chave de API..."
              style={{
                width: '100%',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '10px 14px',
                color: '#fff',
                fontSize: '0.82rem',
                outline: 'none'
              }}
            />
          </div>
        )}
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.05)' }} />

      {/* Seção - Ligas Favoritas */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <h3 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#fff' }}>Ligas Prioritárias</h3>
        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
          Selecione quais ligas devem ser exibidas prioritariamente no topo do seu grid.
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

import type { ApiFixture } from '../types/api';

export interface ScheduledReminder {
  fixtureId: number;
  homeTeam: string;
  awayTeam: string;
  leagueName: string;
  matchTime: string; // ISO date string
  notifyAt: number;  // timestamp (ms)
  minutesBefore: number;
  notified: boolean;
}

const STORAGE_KEY = 'arena_scheduled_reminders';

class NotificationService {
  private swRegistration: ServiceWorkerRegistration | null = null;
  private checkIntervalId: number | null = null;
  private audioContext: AudioContext | null = null;

  public init(): void {
    if (typeof window === 'undefined') return;

    // Registra Service Worker se suportado (usando caminho relativo para suportar subpastas como GitHub Pages)
    if ('serviceWorker' in navigator) {
      const swUrl = './sw.js';
      navigator.serviceWorker
        .register(swUrl)
        .then((reg) => {
          this.swRegistration = reg;
          console.log('[NotificationService] Service Worker registrado com sucesso:', reg.scope);
        })
        .catch((err) => {
          console.warn('[NotificationService] Falha ao registrar Service Worker:', err);
        });
    }

    // Inicia verificação contínua de lembretes pendentes a cada 20 segundos
    if (!this.checkIntervalId) {
      this.checkDueReminders();
      this.checkIntervalId = window.setInterval(() => {
        this.checkDueReminders();
      }, 20000);
    }
  }

  // Verifica se o dispositivo/navegador suporta notificações
  public isSupported(): boolean {
    return typeof window !== 'undefined' && 'Notification' in window;
  }

  // Obtém o status da permissão
  public getPermissionStatus(): NotificationPermission | 'unsupported' {
    if (!this.isSupported()) return 'unsupported';
    return Notification.permission;
  }

  // Solicita permissão ao usuário
  public async requestPermission(): Promise<boolean> {
    if (!this.isSupported()) return false;

    try {
      const permission = await Notification.requestPermission();
      window.dispatchEvent(new Event('notificationPermissionChanged'));
      return permission === 'granted';
    } catch (e) {
      console.error('[NotificationService] Erro ao solicitar permissão de notificação:', e);
      return false;
    }
  }

  // Toca um bipe sonoro de alerta no celular/computador
  private playAlertSound(): void {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;

      if (!this.audioContext) {
        this.audioContext = new AudioCtx();
      }

      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }

      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, this.audioContext.currentTime); // D5
      osc.frequency.setValueAtTime(880.00, this.audioContext.currentTime + 0.12); // A5

      gain.gain.setValueAtTime(0.15, this.audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(this.audioContext.destination);

      osc.start();
      osc.stop(this.audioContext.currentTime + 0.35);
    } catch {
      // Ignora restrições de autoplay
    }
  }

  // Exibe notificação nativa no dispositivo
  public async showNotification(title: string, options: NotificationOptions = {}): Promise<void> {
    if (!this.isSupported() || Notification.permission !== 'granted') return;

    // Dispara vibração no celular se suportado
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([200, 100, 200, 100, 300]);
    }

    this.playAlertSound();

    const mergedOptions: NotificationOptions = {
      icon: '/favicon.svg',
      badge: '/favicon.svg',
      ...options
    };

    // Tenta exibir via Service Worker primeiro (melhor para celular/mobile)
    if (this.swRegistration && 'showNotification' in this.swRegistration) {
      try {
        await this.swRegistration.showNotification(title, mergedOptions);
        return;
      } catch (e) {
        console.warn('[NotificationService] Fallback para Notification API direta:', e);
      }
    }

    // Fallback para Notification padrão
    try {
      new Notification(title, mergedOptions);
    } catch (e) {
      console.error('[NotificationService] Erro ao disparar notificação:', e);
    }
  }

  // Retorna a lista de lembretes salvos
  public getReminders(): ScheduledReminder[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  // Salva a lista de lembretes
  private saveReminders(reminders: ScheduledReminder[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders));
      window.dispatchEvent(new Event('remindersChanged'));
    } catch (e) {
      console.error('[NotificationService] Erro ao salvar lembretes:', e);
    }
  }

  // Verifica se uma partida já tem lembrete ativo
  public isReminderScheduled(fixtureId: number): boolean {
    const list = this.getReminders();
    return list.some((r) => r.fixtureId === fixtureId && !r.notified);
  }

  // Agenda um lembrete para uma partida
  public async scheduleReminder(match: ApiFixture, minutesBefore: number = 15): Promise<boolean> {
    let permission = this.getPermissionStatus();

    if (permission === 'default') {
      const granted = await this.requestPermission();
      if (!granted) return false;
      permission = 'granted';
    }

    if (permission !== 'granted') {
      return false;
    }

    const matchDate = new Date(match.fixture.date);
    const notifyAt = matchDate.getTime() - minutesBefore * 60 * 1000;
    const now = Date.now();

    // Se o jogo já passou do horário de aviso, mas ainda não começou
    const effectiveNotifyAt = notifyAt > now ? notifyAt : now + 1000;

    const reminder: ScheduledReminder = {
      fixtureId: match.fixture.id,
      homeTeam: match.teams.home.name,
      awayTeam: match.teams.away.name,
      leagueName: match.league.name,
      matchTime: match.fixture.date,
      notifyAt: effectiveNotifyAt,
      minutesBefore,
      notified: false
    };

    const existing = this.getReminders().filter((r) => r.fixtureId !== match.fixture.id);
    existing.push(reminder);
    this.saveReminders(existing);

    // Dispara confirmação imediata
    await this.showNotification('🔔 Lembrete Ativado no Celular!', {
      body: `Você receberá um alerta ${minutesBefore} minutos antes de ${match.teams.home.name} x ${match.teams.away.name}.`,
      tag: `reminder-confirm-${match.fixture.id}`
    });

    return true;
  }

  // Cancela um lembrete
  public cancelReminder(fixtureId: number): void {
    const existing = this.getReminders().filter((r) => r.fixtureId !== fixtureId);
    this.saveReminders(existing);
  }

  // Verifica lembretes que chegaram ao horário e dispara notificação no celular
  public checkDueReminders(): void {
    const reminders = this.getReminders();
    if (!reminders.length) return;

    const now = Date.now();
    let hasChanges = false;

    for (const item of reminders) {
      if (!item.notified && now >= item.notifyAt) {
        // Dispara a notificação de jogo
        const timeFormatted = new Date(item.matchTime).toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit'
        });

        this.showNotification(`⚽ ${item.homeTeam} x ${item.awayTeam}`, {
          body: `O jogo do(a) ${item.leagueName} começa em ${item.minutesBefore} minutos (${timeFormatted})! Toque para ver ao vivo.`,
          tag: `match-start-${item.fixtureId}`,
          data: { url: `/?match=${item.fixtureId}` }
        });

        item.notified = true;
        hasChanges = true;
      }
    }

    if (hasChanges) {
      // Remove lembretes antigos já notificados há mais de 1 dia
      const oneDayAgo = now - 24 * 60 * 60 * 1000;
      const filtered = reminders.filter((r) => !r.notified || r.notifyAt > oneDayAgo);
      this.saveReminders(filtered);
    }
  }

  // Notifica gol de time favoritado no celular
  public notifyGoal(
    scoringTeamName: string,
    player: string,
    scoreHome: number,
    scoreAway: number,
    match: ApiFixture
  ): void {
    if (!this.isSupported() || Notification.permission !== 'granted') return;

    const title = `⚽ GOOOL do ${scoringTeamName}! (${scoreHome} - ${scoreAway})`;
    const body = `${player ? `${player} marcou! ` : ''}${match.teams.home.name} ${scoreHome} x ${scoreAway} ${match.teams.away.name} • ${match.league.name}`;

    this.showNotification(title, {
      body,
      tag: `goal-${match.fixture.id}-${Date.now()}`,
      data: { url: `/?match=${match.fixture.id}` }
    });
  }

  // Dispara uma notificação de teste no celular
  public async testNotification(): Promise<boolean> {
    let perm = this.getPermissionStatus();
    if (perm !== 'granted') {
      const ok = await this.requestPermission();
      if (!ok) return false;
    }

    await this.showNotification('⚽ Arena Scores | Teste de Notificação', {
      body: 'Perfeito! Seu celular está pronto para receber alertas de início de jogo e gols em tempo real!',
      tag: 'test-notification'
    });

    return true;
  }
}

export const notificationService = new NotificationService();

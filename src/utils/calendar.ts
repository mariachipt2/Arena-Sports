import type { ApiFixture } from '../types/api';

// Converte Date para formato UTC compacto (ex: 20260921T193000Z)
const formatToUTCString = (date: Date): string => {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
};

// Remove caracteres especiais de nomes para arquivos
const sanitizeFilename = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '-');
};

export const calendarUtils = {
  // Detecta se o dispositivo é iOS (iPhone, iPad, iPod)
  isIOS(): boolean {
    if (typeof navigator === 'undefined') return false;
    return (
      /iPhone|iPad|iPod/i.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
    );
  },

  // Detecta se o usuário está acessando por celular/tablet
  isMobile(): boolean {
    if (typeof navigator === 'undefined') return false;
    return /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || this.isIOS();
  },

  // Gera link web oficial para adicionar evento ao Google Agenda com detalhes e instruções de alarme
  generateGoogleCalendarUrl(match: ApiFixture): string {
    const { fixture, league, teams } = match;
    const startDate = new Date(fixture.date);
    // Partida de futebol tem duração estimada de 2 horas (120 minutos)
    const endDate = new Date(startDate.getTime() + 120 * 60 * 1000);

    const startUTC = formatToUTCString(startDate);
    const endUTC = formatToUTCString(endDate);

    const timeFormatted = startDate.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/Sao_Paulo'
    });

    const title = `⚽ ${teams.home.name} x ${teams.away.name} - ${league.name}`;
    
    const details = [
      `🏆 Partida: ${teams.home.name} x ${teams.away.name}`,
      `🏟️ Campeonato: ${league.name}${league.round ? ` • ${league.round}` : ''}`,
      `⏰ Horário de Brasília: ${timeFormatted} (Data: ${startDate.toLocaleDateString('pt-BR')})`,
      fixture.referee ? `👤 Árbitro: ${fixture.referee}` : '',
      '',
      '🔔 LEMBRETE NO CELULAR: Certifique-se de manter o alerta ativado no Google Agenda (15 min antes) para ser avisado no smartphone!',
      '',
      '📲 Acompanhe placar ao vivo, lances, estatísticas e vídeos no Arena Scores!'
    ].filter(Boolean).join('\n');

    const location = `${league.name}, ${league.country}`;

    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: title,
      dates: `${startUTC}/${endUTC}`,
      details: details,
      location: location,
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  },

  // Abre o Google Agenda diretamente (em nova aba ou na mesma tela se popup for bloqueado no PWA)
  openGoogleCalendar(match: ApiFixture): void {
    const url = this.generateGoogleCalendarUrl(match);
    try {
      const newWin = window.open(url, '_blank', 'noopener,noreferrer');
      // Se bloqueado pelo popup blocker do Safari ou PWA standalone
      if (!newWin || newWin.closed || typeof newWin.closed === 'undefined') {
        window.location.href = url;
      }
    } catch {
      window.location.href = url;
    }
  },

  // Gera conteúdo .ics padrão RFC 5545 com múltiplos alarmes (VALARM) de 15m, 30m e início
  buildIcsContent(match: ApiFixture): string {
    const { fixture, league, teams } = match;
    const startDate = new Date(fixture.date);
    const endDate = new Date(startDate.getTime() + 120 * 60 * 1000);
    const nowUTC = formatToUTCString(new Date());

    const startUTC = formatToUTCString(startDate);
    const endUTC = formatToUTCString(endDate);

    const summary = `⚽ ${teams.home.name} x ${teams.away.name} (${league.name})`;
    const description = `Partida: ${teams.home.name} x ${teams.away.name}\\nCampeonato: ${league.name}${league.round ? ` - ${league.round}` : ''}\\n\\nAcompanhe o placar ao vivo e estatísticas no Arena Scores!`;
    const location = `${league.name}\\, ${league.country}`;
    const uid = `arena-match-${fixture.id}-${startDate.getTime()}@arenascores.com`;

    return [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Arena Scores//Futebol em Tempo Real e Notificacoes//PT-BR',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'X-WR-CALNAME:Arena Scores - Futebol ao Vivo',
      'X-WR-TIMEZONE:America/Sao_Paulo',
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${nowUTC}`,
      `DTSTART:${startUTC}`,
      `DTEND:${endUTC}`,
      `SUMMARY:${summary}`,
      `DESCRIPTION:${description}`,
      `LOCATION:${location}`,
      'STATUS:CONFIRMED',
      // Alarme 1: 15 minutos antes do início (com som e notificação no celular)
      'BEGIN:VALARM',
      'TRIGGER:-PT15M',
      'ACTION:DISPLAY',
      `DESCRIPTION:⚽ ${teams.home.name} x ${teams.away.name} vai começar em 15 minutos!`,
      'X-WR-ALARMUID:alarm-15m-start',
      'END:VALARM',
      // Alarme 2: 30 minutos antes do início
      'BEGIN:VALARM',
      'TRIGGER:-PT30M',
      'ACTION:DISPLAY',
      `DESCRIPTION:⚽ Faltam 30 minutos para ${teams.home.name} x ${teams.away.name} (${league.name})`,
      'X-WR-ALARMUID:alarm-30m-start',
      'END:VALARM',
      // Alarme 3: Na hora exata do pontapé inicial
      'BEGIN:VALARM',
      'TRIGGER:PT0S',
      'ACTION:DISPLAY',
      `DESCRIPTION:⚽ BOLA ROLANDO: ${teams.home.name} x ${teams.away.name} acabou de começar!`,
      'X-WR-ALARMUID:alarm-0m-start',
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');
  },

  // Faz o download do arquivo .ics formatado para acionar o calendário do celular (Apple / Google Agenda / Samsung)
  downloadIcsFile(match: ApiFixture): void {
    const icsContent = this.buildIcsContent(match);
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const filename = `jogo-${sanitizeFilename(match.teams.home.name)}-vs-${sanitizeFilename(match.teams.away.name)}.ics`;

    const objectUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = objectUrl;
    link.setAttribute('download', filename);
    link.setAttribute('target', '_blank');
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();

    // CRÍTICO NO SAFARI / IOS: O WebKit não dispara o download de forma síncrona.
    // Revogar imediatamente cancela o download antes de iniciar.
    // Damos 60 segundos de janela antes de limpar a URL do objeto.
    setTimeout(() => {
      try {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(objectUrl);
      } catch {
        // Ignora se já tiver sido removido
      }
    }, 60000);
  },

  // Método específico para Apple Calendário (iPhone / Mac / iPad)
  openAppleCalendar(match: ApiFixture): void {
    this.downloadIcsFile(match);
  },

  // Sincroniza diretamente no celular (Android / iOS / Desktop)
  syncMobileCalendar(match: ApiFixture): void {
    this.downloadIcsFile(match);
  }
};

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
  // Gera link web oficial para adicionar evento ao Google Agenda
  generateGoogleCalendarUrl(match: ApiFixture): string {
    const { fixture, league, teams } = match;
    const startDate = new Date(fixture.date);
    // Partida de futebol tem duração estimada de 2 horas (120 minutos)
    const endDate = new Date(startDate.getTime() + 120 * 60 * 1000);

    const startUTC = formatToUTCString(startDate);
    const endUTC = formatToUTCString(endDate);

    const title = `⚽ ${teams.home.name} x ${teams.away.name} - ${league.name}`;
    
    const details = [
      `Partida: ${teams.home.name} x ${teams.away.name}`,
      `Competição: ${league.name}${league.round ? ` • ${league.round}` : ''}`,
      `Temporada: ${league.season}`,
      `País: ${league.country}`,
      fixture.referee ? `Árbitro: ${fixture.referee}` : '',
      '',
      'Acompanhe placar ao vivo, lances e estatísticas em tempo real no Arena Scores!'
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

  // Abre diretamente o Google Agenda em nova aba
  openGoogleCalendar(match: ApiFixture): void {
    const url = this.generateGoogleCalendarUrl(match);
    window.open(url, '_blank', 'noopener,noreferrer');
  },

  // Gera e faz o download de um arquivo .ics (padrão iCalendar para Apple Calendar, Outlook e outros)
  downloadIcsFile(match: ApiFixture): void {
    const { fixture, league, teams } = match;
    const startDate = new Date(fixture.date);
    const endDate = new Date(startDate.getTime() + 120 * 60 * 1000);
    const nowUTC = formatToUTCString(new Date());

    const startUTC = formatToUTCString(startDate);
    const endUTC = formatToUTCString(endDate);

    const summary = `⚽ ${teams.home.name} x ${teams.away.name} (${league.name})`;
    const description = `Partida: ${teams.home.name} x ${teams.away.name}\\nCampeonato: ${league.name}${league.round ? ` - ${league.round}` : ''}\\nAcompanhe em tempo real pelo Arena Scores!`;
    const location = `${league.name}\\, ${league.country}`;
    const uid = `arena-fixture-${fixture.id}-${startDate.getTime()}@arenascores.com`;

    // Conteúdo em formato padrão RFC 5545 com alarme de 15 minutos antes do jogo
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Arena Scores//Futebol em Tempo Real//PT-BR',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${nowUTC}`,
      `DTSTART:${startUTC}`,
      `DTEND:${endUTC}`,
      `SUMMARY:${summary}`,
      `DESCRIPTION:${description}`,
      `LOCATION:${location}`,
      'STATUS:CONFIRMED',
      'BEGIN:VALARM',
      'TRIGGER:-PT15M',
      'ACTION:DISPLAY',
      `DESCRIPTION:O jogo ${teams.home.name} x ${teams.away.name} vai começar em 15 minutos!`,
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const filename = `jogo-${sanitizeFilename(teams.home.name)}-vs-${sanitizeFilename(teams.away.name)}.ics`;

    // Dispara download via âncora temporária
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(link.href);
  }
};

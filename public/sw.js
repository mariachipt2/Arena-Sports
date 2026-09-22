// Service Worker - Arena Scores (Arena Esportes)
// Gerenciador de Notificações no Celular e Segundo Plano

const CACHE_NAME = 'arena-scores-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Manipula cliques na notificação exibida no celular
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Se houver uma aba aberta do Arena Scores, foca nela
      for (const client of clientList) {
        if ('focus' in client) {
          if (client.url.includes(self.registration.scope) || client.url.includes('localhost') || client.url.includes('arena')) {
            client.navigate(urlToOpen);
            return client.focus();
          }
        }
      }
      // Se não houver, abre uma nova janela/aba
      if (self.clients.openWindow) {
        return self.clients.openWindow(urlToOpen);
      }
    })
  );
});

// Recebe mensagens da aplicação para disparar notificações com suporte a vibração
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    const { title, options } = event.data;
    self.registration.showNotification(title, {
      icon: '/favicon.svg',
      badge: '/favicon.svg',
      vibrate: [200, 100, 200, 100, 300],
      ...options
    });
  }
});

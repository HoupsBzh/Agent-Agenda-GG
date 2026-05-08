self.addEventListener('fetch', function(event) {});

self.addEventListener('install', function() {
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(self.clients.claim());
});

function notifTagFromPayload(data) {
  if (!data || !data.type) return 'kern-generic';
  return 'kern-' + data.type;
}

function buildNotificationOptions(data) {
  var options = {
    body: data.body || '',
    icon: 'icons/icon-192.png',
    badge: 'icons/badge-monochrome.png',
    tag: notifTagFromPayload(data),
    renotify: false,
    requireInteraction: false,
    data: {
      url: data.url || './',
      tab: data.tab || 'dash',
      date: data.date || null,
      type: data.type || 'generic',
      blocks: data.blocks || []
    },
    actions: []
  };

  if (data.type === 'daily_summary') {
    options.actions = [{ action: 'open_detail', title: 'Voir le détail' }];
    if (Array.isArray(data.blocks) && data.blocks.length > 0) {
      // Affichage étendu Android (liste des blocs)
      options.body = data.body + '\n' + data.blocks
        .slice(0, 6)
        .map(function(b) { return (b.time || '--:--') + '  ' + (b.title || 'Bloc'); })
        .join('\n');
    }
  }

  if (data.type === 'evening_reminder') {
    options.actions = [
      { action: 'open_week', title: 'Noter maintenant' },
      { action: 'remind_30', title: 'Rappeler 30 min' }
    ];
    if (Array.isArray(data.pendingBlocks) && data.pendingBlocks.length > 0) {
      options.body = data.body + '\n' + data.pendingBlocks
        .slice(0, 5)
        .map(function(b) { return (b.time || '--:--') + '  ' + (b.title || 'Bloc'); })
        .join('\n');
    }
  }

  return options;
}

self.addEventListener('push', function(event) {
  var payload = {};
  try {
    payload = event.data ? event.data.json() : {};
  } catch (e) {
    payload = { title: 'KERN', body: 'Nouvelle notification.' };
  }

  var title = payload.title || 'KERN';
  var options = buildNotificationOptions(payload);

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  var data = (event.notification && event.notification.data) || {};
  var baseUrl = data.url || './';
  var target = baseUrl;

  if (event.action === 'open_detail' || event.action === 'open_week') {
    target = baseUrl + '#semaine';
  } else if (event.action === 'remind_30') {
    // MVP: on ouvre quand même la semaine (le "rappeler 30 min" sera piloté côté GAS plus tard)
    target = baseUrl + '#semaine';
  } else if (data.tab === 'semaine') {
    target = baseUrl + '#semaine';
  }

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      for (var i = 0; i < clientList.length; i++) {
        var c = clientList[i];
        if ('focus' in c) {
          c.navigate(target);
          return c.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(target);
    })
  );
});

self.addEventListener('fetch', function() {});

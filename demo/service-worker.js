console.log("Service worker loaded!");
self.addEventListener('notificationclick', function (e) {
    e.notification.close();
    e.waitUntil(
        clients.matchAll({ includeUncontrolled: true, type: 'window' }).then(windowClients => {
            // Check if there is already a window/tab open with the target URL
            for (var i = 0; i < windowClients.length; i++) {
                var client = windowClients[i];
                // If so, just focus it.
                if ('focus' in client) {
                    return client.focus();
                }
            }

            // If not, then open the target URL in a new window/tab.
            if (clients.openWindow) {
                return clients.openWindow(e.notification.data.url);
            }
        })
    );
});
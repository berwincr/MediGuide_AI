self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("message", (event) => {
  const data = event.data;

  if (!data || data.type !== "SHOW_REMINDER") {
    return;
  }

  self.registration.showNotification("Medicine Reminder 💊", {
    body: `Time to take ${data.medicine_name} (${data.dosage})`,
    icon: "/vite.svg",
    badge: "/vite.svg",
    tag: `medicine-${data.id}`,
    requireInteraction: true,
  });
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  event.waitUntil(
    self.clients.matchAll({
      type: "window",
      includeUncontrolled: true,
    }).then((clients) => {
      if (clients.length > 0) {
        return clients[0].focus();
      }

      return self.clients.openWindow("/reminders");
    })
  );
});

self.addEventListener("push", (event) => {
  if (!event.data) {
    return;
  }

  const data = event.data.json();

  event.waitUntil(
    self.registration.showNotification(
      data.title || "Medicine Reminder 💊",
      {
        body: data.body || "It's time to take your medicine.",
        icon: "/vite.svg",
        badge: "/vite.svg",
        tag: data.data?.reminder_id || "medicine-reminder",
        requireInteraction: true,
      }
    )
  );
});
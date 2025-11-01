# Ключові сутності Book&Study

| Сутність | Атрибути | Методи |
|-----------|-----------|---------|
| **User** | id, name, role | canManageSlots() |
| **Slot** | id, startTime, endTime, status | isAvailable(), markAsBooked() |
| **Booking** | id, user, slot, createdAt | cancel() |
| **Notification** | user, message, sentAt | send() |

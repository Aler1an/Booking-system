# Вибираємо Node.js 20 (міні-образ з fetch підтримкою)
FROM node:20-slim

# Створюємо робочу папку
WORKDIR /app

# Копіюємо package.json (якщо потрібні додаткові пакети)
# COPY package*.json ./

# Копіюємо скрипт генератора
COPY load-generator.js .

# Встановлювати пакети (якщо потрібні)
# RUN npm install

# Експортуємо змінні середовища за замовчуванням
ENV API_BASE_URL=http://backend:8000
ENV REQUEST_INTERVAL_MS=800
ENV MAX_PARALLEL=3

# Команда запуску
CMD ["node", "load-generator.js"]

FROM node:20-alpine

WORKDIR /app

# Копіюємо package.json
COPY package*.json ./

RUN npm install --omit=dev

# Копіюємо весь код
COPY . .

EXPOSE 3000

CMD ["node", "server.js"]

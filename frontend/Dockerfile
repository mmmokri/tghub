# Стадия сборки
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# === ПРОДАКШЕН СТАДИЯ ===
# Используем Nginx для раздачи статических файлов
FROM nginx:alpine

# Копируем собранный frontend в Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Nginx сам слушает порт 80
EXPOSE 80

# Запускаем Nginx
CMD ["nginx", "-g", "daemon off;"]
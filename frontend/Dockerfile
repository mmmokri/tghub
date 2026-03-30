# Стадия сборки
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Устанавливаем права на выполнение для tsc
RUN chmod +x ./node_modules/.bin/tsc
RUN ./node_modules/.bin/tsc && vite build

# === ПРОДАКШЕН СТАДИЯ ===
# Используем Nginx для раздачи статических файлов
FROM nginx:alpine

# Копируем собранный frontend в Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Nginx сам слушает порт 80
EXPOSE 80

# Запускаем Nginx
CMD ["nginx", "-g", "daemon off;"]
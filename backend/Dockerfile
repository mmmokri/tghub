# Используем официальный образ Node.js
FROM node:20-alpine AS builder

# Рабочая директория внутри контейнера
WORKDIR /app

# Копируем файлы package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci

# Копируем весь исходный код
COPY . .

# Собираем проект (выполняет npm run build)
RUN npm run build

# === ВТОРАЯ СТАДИЯ (production) ===
FROM node:20-alpine

WORKDIR /app

# Копируем только package.json для production зависимостей
COPY package*.json ./

# Устанавливаем ТОЛЬКО production зависимости
RUN npm ci --only=production

# Копируем собраный код из первой стадии
COPY --from=builder /app/dist ./dist

# Открываем порт 3000
EXPOSE 3000

# Команда для запуска
CMD ["node", "dist/index.js"]
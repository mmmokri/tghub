# 🚀 Инструкция по деплою Telegram Mini App (VJ Track)

Эта папка `hub` содержит всё необходимое для запуска вашего приложения в Docker на удаленном сервере.

## 📦 Структура проекта
- `frontend/`: React-приложение (Vite + TS), собирается в Nginx.
- `backend/`: Node.js API (Express + Postgres), обрабатывает данные пользователей.
- `postgres`: База данных PostgreSQL 16 для хранения профилей.

## 🛠 Предварительные требования
1. Установленный **Docker** и **Docker Compose** на сервере.
2. Зарегистрированный бот в [@BotFather](https://t.me/BotFather) (вам нужен `BOT_TOKEN`).

## 🚀 Быстрый запуск

1. **Настройте переменные окружения**:
   Отредактируйте файл `.env` в корне папки `hub`:
   ```env
   DB_PASSWORD=ваш_надежный_пароль
   TELEGRAM_BOT_TOKEN=токен_вашего_бота
   ```

2. **Запустите проект**:
   Выполните команду в терминале:
   ```bash
   docker compose up -d --build
   ```

3. **Проверьте статус**:
   ```bash
   docker compose ps
   ```

## 🔐 Важные моменты (Telegram Integration)

### 1. Безопасность (initData)
В `backend/src/index.ts` реализована функция `validateInitData`. Она проверяет подпись Telegram, чтобы никто не мог подделать данные пользователя. 
> **Важно**: В коде сейчас закомментирован вызов валидации для удобства разработки. Перед финальным деплоем раскомментируйте строки 73-77 в `backend/src/index.ts`.

### 2. Доступ к данным из БД
В `backend/src/index.ts` уже создана таблица `users`, которая хранит:
- `id` (Telegram ID)
- `username`
- `first_name`, `last_name`
- `photo_url`
- `role` (student/admin)

### 3. Настройка бота
В BotFather установите **Menu Button** -> **Configure** -> Вставьте URL вашего сервера (например, `http://ваш-ip/` или `https://ваш-домен/`).

## ⚠️ Предупреждения
- **HTTPS**: Telegram Mini Apps работают корректно только через **HTTPS**. Для этого рекомендуется поставить перед Docker контейнером **Nginx Proxy Manager** или использовать **Cloudflare**.
- **Порты**: Убедитесь, что порты 80 (frontend) и 3000 (backend) открыты в брандмауэре вашего сервера.

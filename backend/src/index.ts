import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import postgres from 'postgres';

const app = express();
const port = process.env.PORT || 3000;

// Настройка подключения к PostgreSQL
const sql = postgres({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'telegram_app',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'secure_password_123',
});

app.use(cors());
app.use(express.json());

// === ВАЛИДАЦИЯ TELEGRAM INITDATA ===
// Это критически важно для безопасности TMA. Мы проверяем, что данные пришли именно от Telegram.
const validateInitData = (initData: string, botToken: string): boolean => {
  const params = new URLSearchParams(initData);
  const hash = params.get('hash');
  params.delete('hash');

  const dataCheckString = Array.from(params.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

  const secretKey = crypto.createHmac('sha256', 'WebAppData').update(botToken).digest();
  const calculatedHash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

  return calculatedHash === hash;
};

// === ИНИЦИАЛИЗАЦИЯ ТАБЛИЦ ===
const initDb = async () => {
  try {
    // Таблица пользователей
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id BIGINT PRIMARY KEY,
        username TEXT,
        first_name TEXT,
        last_name TEXT,
        photo_url TEXT,
        role TEXT DEFAULT 'student',
        stack TEXT[],
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Таблица задач
    await sql`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        created_by BIGINT REFERENCES users(id),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Таблица оценок
    await sql`
      CREATE TABLE IF NOT EXISTS grades (
        id SERIAL PRIMARY KEY,
        task_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
        user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
        grade TEXT NOT NULL,
        comment TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('✅ Database tables initialized');
  } catch (err) {
    console.error('❌ Error initializing database:', err);
  }
};

initDb();

// === ЭНДПОИНТЫ API ===

// 1. Авторизация/Регистрация пользователя
app.post('/api/auth', async (req, res) => {
  console.log('Received /api/auth request body:', req.body); // Добавлено логирование
  const { initData, userData } = req.body;

  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    console.error('TELEGRAM_BOT_TOKEN is not set!'); // Добавлено логирование
    return res.status(500).json({ error: 'Server configuration error' });
  }

  // --- Telegram Web App Data Validation ---
  console.log('Attempting to validate Telegram initData...'); // Добавлено логирование
  if (!validateInitData(initData, token)) { // Использована существующая функция validateInitData
    console.error('Telegram Web App data validation failed for initData:', initData); // Добавлено логирование
    return res.status(401).json({ error: 'Unauthorized: Invalid Telegram Web App data' });
  }
  console.log('Telegram initData validated successfully.'); // Добавлено логирование

  // После валидации initData, продолжаем с данными пользователя из req.body
  try {
    const { id, username, first_name, last_name, photo_url } = userData;
    console.log('Attempting to insert/update user:', { id, username, first_name, last_name, photo_url }); // Добавлено логирование
    // Сохраняем или обновляем пользователя в БД
    const [user] = await sql`
      INSERT INTO users (id, username, first_name, last_name, photo_url)
      VALUES (${id}, ${username}, ${first_name}, ${last_name}, ${photo_url})
      ON CONFLICT (id) DO UPDATE SET
        username = EXCLUDED.username,
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name,
        photo_url = EXCLUDED.photo_url
      RETURNING *
    `;
    console.log('User inserted/updated successfully:', user); // Добавлено логирование
    res.json({ success: true, user });
  } catch (err) {
    console.error('Auth database error:', err); // Изменено логирование для ясности
    res.status(500).json({ error: 'Database error' });
  }
});

// 2. Получение профиля
app.get('/api/profile/:id', async (req, res) => {
  try {
    const [user] = await sql`SELECT * FROM users WHERE id = ${req.params.id}`;
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// 3. Работа с задачами
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await sql`SELECT * FROM tasks ORDER BY created_at DESC`;
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/tasks', async (req, res) => {
  const { title, description, adminId } = req.body;
  try {
    const [task] = await sql`
      INSERT INTO tasks (title, description, created_by)
      VALUES (${title}, ${description}, ${adminId})
      RETURNING *
    `;
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// 4. Работа с оценками
app.get('/api/grades/:userId', async (req, res) => {
  try {
    const grades = await sql`
      SELECT g.*, t.title as task_title 
      FROM grades g
      JOIN tasks t ON g.task_id = t.id
      WHERE g.user_id = ${req.params.userId}
    `;
    res.json(grades);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});

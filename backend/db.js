// db.js
import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

export const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'db',   // 'db' = імʼя сервісу в docker-compose
  database: process.env.DB_NAME || 'booking',
  password: process.env.DB_PASSWORD || 'password123',
  port: Number(process.env.DB_PORT) || 5432,
});

// Створення таблиці при запуску сервера
export async function initDB() {
  try {
    const client = await pool.connect();
    console.log("✅ PostgreSQL connected");

    await client.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        date DATE NOT NULL
      );
    `);

    console.log("📦 Table 'bookings' ensured");

    client.release();
  } catch (err) {
    console.error("❌ DB init error:", err);
  }
}

// --- OPERATIONS ---

export async function getAllBookings(db = pool) {
  const result = await db.query("SELECT * FROM bookings ORDER BY id DESC");
  return result.rows;
}

export async function createBooking(db = pool, { name, date }) {
  const result = await db.query(
    "INSERT INTO bookings (name, date) VALUES ($1, $2) RETURNING *",
    [name, date]
  );
  return result.rows[0];
}

import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Ініціалізація бази даних
export async function initDB() {
  const db = await open({
    filename: './bookings.db',
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      date TEXT NOT NULL
    );
  `);

  // Тестові дані
  const count = await db.get('SELECT COUNT(*) AS c FROM bookings');
  if (count.c === 0) {
    await db.run(`INSERT INTO bookings (name, date)
      VALUES 
      ('Meeting Room 1', '2025-10-08'),
      ('Conference Hall', '2025-10-09'),
      ('Private Office', '2025-10-10')
    `);
  }

  return db;
}

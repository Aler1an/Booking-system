// service/bookingService.js
import sqlite3 from "sqlite3";
import { open } from "sqlite";

// Підключення до бази
const dbPromise = open({
    filename: "./bookings.db",
    driver: sqlite3.Database,
});

// Отримати всі бронювання
export async function getAllBookings() {
    const db = await dbPromise;
    return db.all("SELECT * FROM bookings");
}

// Отримати бронювання за ID
export async function getBookingById(id) {
    const db = await dbPromise;
    return db.get("SELECT * FROM bookings WHERE id = ?", [id]);
}

// Створити нове бронювання
export async function createBooking(db, { name, date }) {
    if (!name || !date) {
        throw new Error("Missing required fields: name or date");
    }
    
    const result = await db.run(
        "INSERT INTO bookings (name, date) VALUES (?, ?)",
        [name, date]
    );
    
    return { id: result.lastID, name, date };
    }

// Оновити бронювання
export async function updateBooking(id, bookingData) {
    const { name, date} = bookingData;
    const db = await dbPromise;
    await db.run(
    "UPDATE bookings SET name = ?, date = ?, serviceType = ? WHERE id = ?",
    [name, date, id]
    );
    return getBookingById(id);
}

// Видалити бронювання
export async function deleteBooking(id) {
    const db = await dbPromise;
    await db.run("DELETE FROM bookings WHERE id = ?", [id]);
    return true;
}

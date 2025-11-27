export async function getAllBookings(db) {
    const result = await db.query("SELECT * FROM bookings ORDER BY id DESC");
    return result.rows;
    }

    export async function createBooking(db, { name, date }) {
    const result = await db.query(
      "INSERT INTO bookings (name, date) VALUES ($1, $2) RETURNING *",
        [name, date]
    );
    
    return result.rows[0];
    }

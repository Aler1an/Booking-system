import express from 'express';
import cors from 'cors';
import { initDB } from './db.js';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const db = await initDB();


app.get('/bookings', async (req, res) => {
  try {
    const bookings = await db.all('SELECT * FROM bookings');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/bookings', async (req, res) => {
  try {
    const { name, date } = req.body;
    if (!name || !date) {
      return res.status(400).json({ error: 'Name and date are required' });
    }
    await db.run('INSERT INTO bookings (name, date) VALUES (?, ?)', [name, date]);
    res.json({ message: 'Booking added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => console.log(`✅ Server running at http://localhost:${port}`));

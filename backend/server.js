import express from 'express';
import cors from 'cors';
import { initDB } from './db.js';
import healthRouter from './api/health.js';
import bookingRouter from './api/bookingController.js';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// ініціалізація бази
const db = await initDB();
app.locals.db = db;

// маршрути
app.use('/', healthRouter);
app.use('/bookings', bookingRouter);

// запуск сервера
app.listen(port, () => console.log(`✅ Server running at http://localhost:${port}`));

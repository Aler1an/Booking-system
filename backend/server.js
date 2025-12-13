import './otel.js'
import express from 'express';
import cors from 'cors';
import { initDB, pool } from './db.js';

// middlewares
import requestId from './middlewares/requestId.js';
import rateLimit from './middlewares/rateLimit.js';
import faultInjection from './middlewares/faultInjection.js';

// routes
import healthRouter from './api/health.js';
import bookingRouter from './api/bookingController.js';

// error formatter
import { formatError } from './errorFormat.js';

const app = express();
const port = 3000;

// core middlewares
app.use(cors());
app.use(express.json());
app.use(requestId);
app.use(rateLimit);
app.use(faultInjection);

// Чекаємо, поки база не стане доступною
async function waitForDB(retries = 10, delay = 2000) {
    for (let i = 0; i < retries; i++) {
    try {
        await initDB();
        return;
    } catch (err) {
        console.log(`Waiting for DB... retry ${i + 1}`);
        await new Promise(res => setTimeout(res, delay));
    }
    }
    console.error('❌ DB not available after retries');
    process.exit(1);
}

await waitForDB();

// Зберігаємо пул для роутерів
app.locals.db = pool;

// routes
app.use('/', healthRouter);
app.use('/bookings', bookingRouter);

// Global error handler
app.use((err, req, res, next) => {
    console.error('SERVER ERROR:', err);
    res.status(500).json(formatError("unexpected_error", req.rid));
});

// Start server
app.listen(port, () =>
    console.log(`🚀 Server running at http://localhost:${port}`)
);



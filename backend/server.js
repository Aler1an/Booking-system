import express from 'express';
import cors from 'cors';
import { initDB } from './db.js';

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

// X-Request-Id
app.use(requestId);

// rate-limit + Retry-After
app.use(rateLimit);

// random delays + faults
app.use(faultInjection);

// DB init
const db = await initDB();
app.locals.db = db;

// routes
app.use('/', healthRouter);
app.use('/bookings', bookingRouter);

// Global error handler (єдиний формат помилки)
app.use((err, req, res, next) => {
    console.error('SERVER ERROR:', err);
    res.status(500).json(formatError("unexpected_error", req.rid));
});

// Start server
app.listen(port, () =>
    console.log(`🚀 Server running at http://localhost:${port}`)
);

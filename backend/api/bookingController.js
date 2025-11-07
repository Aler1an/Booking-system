import express from 'express';
import {
    getAllBookings,
    createBooking,
} from '../service/bookingService.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
    const bookings = await getAllBookings(req.app.locals.db);
    res.json(bookings);
    } catch (error) {
    res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
    const { name, date } = req.body;
    if (!name || !date) {
        return res.status(400).json({ error: 'Name and date are required' });
    }
    const result = await createBooking(req.app.locals.db, { name, date });
    res.status(201).json(result);
    } catch (error) {
    res.status(500).json({ error: error.message });
    }
});

export default router;

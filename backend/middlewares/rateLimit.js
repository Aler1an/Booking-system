const WINDOW_MS = 10_000;
const MAX_REQ = 8;
const rate = new Map(); // ip -> {count, ts}

export default function rateLimit(req, res, next) {
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "local";

    const now = Date.now();
    const record = rate.get(ip) ?? { count: 0, ts: now };
    const withinWindow = now - record.ts < WINDOW_MS;
    const state = withinWindow
        ? { count: record.count + 1, ts: record.ts }
        : { count: 1, ts: now };

    rate.set(ip, state);

    if (state.count > MAX_REQ) {
        res.setHeader("Retry-After", "2");
        return res.status(429).json({
            error: "too_many_requests",
            requestId: req.rid
        });
    }

    next();
}

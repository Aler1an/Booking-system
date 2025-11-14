export default async function faultInjection(req, res, next) {
    const r = Math.random();

    // 15% — штучна затримка
    if (r < 0.15)
        await new Promise(r => setTimeout(r, 1200 + Math.random() * 800));

    // 20% — штучний збій
    if (r > 0.80) {
        const err = Math.random() < 0.5 ? "unavailable" : "unexpected";
        const code = err === "unavailable" ? 503 : 500;

        return res.status(code).json({ error: err, requestId: req.rid });
    }

    next();
}

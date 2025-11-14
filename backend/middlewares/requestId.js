import { randomUUID } from "crypto";

export default function requestId(req, res, next) {
    const rid = req.get("X-Request-Id") || randomUUID();
    req.rid = rid;
    res.setHeader("X-Request-Id", rid);
    next();
}

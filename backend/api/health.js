import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ status: "ok", service: "booking-api" });
});

router.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

export default router;

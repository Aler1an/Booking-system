import express from "express";
import { BookingService } from "../service/bookingService.js";

const router = express.Router();
const service = new BookingService();

router.get("/", (req, res) => res.json(service.getAll()));
router.post("/", (req, res) => res.status(201).json(service.create(req.body)));
router.get("/:id", (req, res) => res.json(service.getById(req.params.id)));
router.put("/:id", (req, res) => res.json(service.update(req.params.id, req.body)));
router.delete("/:id", (req, res) => res.status(204).json(service.delete(req.params.id)));

export default router;

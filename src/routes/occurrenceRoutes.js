import { Router } from "express";
import {
  createOccurrence,
  getOccurrences,
  getOccurrenceById,
  updateOccurrence,
  deleteOccurrence,
  toggleLike,
} from "../controllers/occurrenceController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();


router.post("/", authMiddleware, createOccurrence);
router.get("/", getOccurrences);
router.patch("/:id/like", authMiddleware, toggleLike);
router.get("/:id", getOccurrenceById);
router.put("/:id", authMiddleware, updateOccurrence);
router.delete("/:id", authMiddleware, deleteOccurrence);

export default router;

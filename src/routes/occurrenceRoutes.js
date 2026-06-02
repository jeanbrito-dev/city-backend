import { Router } from "express";
import { upload } from "../middlewares/upload.js";
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


router.post("/", authMiddleware, upload.single("imagem"), createOccurrence);
router.get("/", getOccurrences);
router.patch("/:id/like", authMiddleware, toggleLike);
router.get("/:id", getOccurrenceById);
router.put("/:id", authMiddleware, updateOccurrence);
router.delete("/:id", authMiddleware, deleteOccurrence);

export default router;

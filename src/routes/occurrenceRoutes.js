import { Router } from "express";
import {
  createOccurrence,
  getOccurrences,
  getOccurrenceById,
  updateOccurrence,
  deleteOccurrence,
} from "../controllers/occurrenceController.js";

const router = Router();

router.post("/", createOccurrence);
router.get("/", getOccurrences);
router.get("/:id", getOccurrenceById);
router.put("/:id", updateOccurrence);
router.delete("/:id", deleteOccurrence);

export default router;
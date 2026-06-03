import { Router } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
import { requireAdmin } from "../../middlewares/requireAdmin.js";
import {
  getAllOccurrences,
  updateOccurrenceStatus,
  deleteOccurrence,
} from "../../controllers/admin/occurrences.controller.js";

const router = Router();

router.get("/", authMiddleware, requireAdmin, getAllOccurrences);

router.patch("/:id/status", authMiddleware, requireAdmin, updateOccurrenceStatus);

router.delete("/:id", authMiddleware, requireAdmin, deleteOccurrence);

export default router;

import { Router } from "express";
import {
  getComments,
  addComment,
  addReply,
} from "../controllers/commentController.js";

const router = Router();

// GET /comments/:occurrenceId — lista comentários da ocorrência
router.get("/:occurrenceId", getComments);

// POST /comments/:occurrenceId — novo comentário
router.post("/:occurrenceId", addComment);

// POST /comments/:occurrenceId/:commentId/reply — resposta a comentário
router.post("/:occurrenceId/:commentId/reply", addReply);

export default router;

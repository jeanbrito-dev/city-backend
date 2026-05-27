import { Router } from "express";
import {
  getComments,
  addComment,
  addReply,
  updateComment,
  deleteComment,
  updateReply,
  deleteReply,
} from "../controllers/commentController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/:occurrenceId", getComments);

router.post("/:occurrenceId", authMiddleware, addComment);

router.post("/:occurrenceId/:commentId/reply", authMiddleware, addReply);

router.put("/:occurrenceId/:commentId", authMiddleware, updateComment);

router.delete("/:occurrenceId/:commentId", authMiddleware, deleteComment);

router.put("/:occurrenceId/:commentId/reply/:replyId", authMiddleware, updateReply);

router.delete("/:occurrenceId/:commentId/reply/:replyId", authMiddleware, deleteReply);

export default router;

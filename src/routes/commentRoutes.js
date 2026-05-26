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

const router = Router();

router.get("/:occurrenceId", getComments);

router.post("/:occurrenceId", addComment);

router.post("/:occurrenceId/:commentId/reply", addReply);

router.put("/:occurrenceId/:commentId", updateComment);

router.delete("/:occurrenceId/:commentId", deleteComment);

router.put("/:occurrenceId/:commentId/reply/:replyId", updateReply);

router.delete("/:occurrenceId/:commentId/reply/:replyId", deleteReply);

export default router;

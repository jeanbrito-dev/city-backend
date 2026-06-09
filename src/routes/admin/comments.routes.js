import { Router } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
import { requireAdmin } from "../../middlewares/requireAdmin.js";
import {
  deleteCommentAdmin,
  deleteReplyAdmin,
} from "../../controllers/admin/comments.controller.js";

const router = Router();

router.use(authMiddleware, requireAdmin);

router.delete("/:id", deleteCommentAdmin);
router.delete("/replies/:id", deleteReplyAdmin);

export default router;
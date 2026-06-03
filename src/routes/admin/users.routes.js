import { Router } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
import { requireAdmin } from "../../middlewares/requireAdmin.js";
import {
  getAllUsers,
  deleteUser,
} from "../../controllers/admin/users.controller.js";

const router = Router();

router.get("/", authMiddleware, requireAdmin, getAllUsers);

router.delete("/:id", authMiddleware, requireAdmin, deleteUser);

export default router;

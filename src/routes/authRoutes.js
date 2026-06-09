import { Router } from "express";

import {
  login,
  register,
  getUser,
  updateUser,
  deleteUser,
} from "../controllers/authController.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";
import { requireAdmin } from "../middlewares/requireAdmin.js";

import adminUsersRoutes from "./admin/users.routes.js";
import adminOccurrencesRoutes from "./admin/occurrences.routes.js";
import adminCommentsRoutes from "./admin/comments.routes.js";

const router = Router();

// Auth
router.post("/login", login);
router.post("/register", register);

// Users
router.get("/users/:id", authMiddleware, getUser);
router.put("/users/:id", authMiddleware, updateUser);
router.delete("/users/:id", authMiddleware, deleteUser);

// Admin
router.use(
  "/admin/users",
  authMiddleware,
  requireAdmin,
  adminUsersRoutes,
);

router.use(
  "/admin/occurrences",
  authMiddleware,
  requireAdmin,
  adminOccurrencesRoutes,
);

router.use(
  "/admin/comments",
  authMiddleware,
  requireAdmin,
  adminCommentsRoutes,
);

export default router;
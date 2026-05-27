import { Router } from "express";
import {
  login,
  register,
  getUser,
  updateUser,
  deleteUser,
} from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/login", login);
router.post("/register", register);
router.get("/users/:id", authMiddleware, getUser);
router.put("/users/:id", authMiddleware, updateUser);
router.delete("/users/:id", authMiddleware, deleteUser);

export default router;
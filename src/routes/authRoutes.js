import { Router } from "express";
import {
  login,
  register,
  getUser,
  updateUser,
  deleteUser,
} from "../controllers/authController.js";

const router = Router();

router.post("/login", login);
router.post("/register", register);
router.get("/users/:id", getUser);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

export default router;
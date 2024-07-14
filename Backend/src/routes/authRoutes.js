import express from "express";
import { login, logout, register } from "../controllers/authController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/logout", authenticateToken, logout);

export default router;

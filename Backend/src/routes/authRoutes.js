import express from "express";
import { login, logout, register } from "../controllers/authController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import generateAccessTokenFromRefreshToken from "../controllers/RefreshTokenController.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/logout", authenticateToken, logout);
router.post(
  "/refreshtoken",
  authenticateToken,
  generateAccessTokenFromRefreshToken
);

export default router;

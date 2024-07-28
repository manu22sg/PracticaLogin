import express from "express";
import { listGiros } from "../controllers/giroController.js";
import { authenticateToken, checkRole } from "../middlewares/authMiddleware.js";
const router = express.Router();
router.get(
  "/giros",
  authenticateToken,
  checkRole("Administrador Interno", "Personal Contable"),
  listGiros
);

export default router;

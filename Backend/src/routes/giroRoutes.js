import express from "express";
import { listGiros } from "../controllers/giroController.js";
import { authenticateToken, checkRole } from "../middlewares/authMiddleware.js";
const router = express.Router();
router.get( /// Definimos la ruta para obtener los giros
  "/giros",
  authenticateToken,
  checkRole("Administrador Interno", "Personal Contable"), /// Definimos los roles que pueden acceder a la ruta
  listGiros
);

export default router;

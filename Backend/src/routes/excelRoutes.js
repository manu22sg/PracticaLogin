import express from "express";

import excelCompanies from "../controllers/ExcelController.js";
import { authenticateToken, checkRole } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get( // Definimos la ruta para exportar las empresas a un archivo excel
  "/excelCompanies",
  authenticateToken,
  checkRole("Administrador Interno", "Personal Contable"), /// Definimos los roles que pueden acceder a la ruta
  excelCompanies
);

export default router;

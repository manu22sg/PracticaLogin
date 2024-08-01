import express from "express";

import {excelCompanies, excelUsers} from "../controllers/excelController.js";
import { authenticateToken, checkRole } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get( // Definimos la ruta para exportar las empresas a un archivo excel
  "/excelCompanies",
  authenticateToken,
  checkRole("Administrador Interno", "Personal Contable"), /// Definimos los roles que pueden acceder a la ruta
  excelCompanies
);

router.get("/excelUsers",authenticateToken,checkRole("Administrador Interno", "Personal Contable"), excelUsers) // definimos la ruta para exportar los usuarios a un archivo excel

export default router;

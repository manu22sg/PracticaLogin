import express from "express";

import excelCompanies from "../controllers/ExcelController.js";
import { authenticateToken, checkRole } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get(
  "/excelCompanies",
  authenticateToken,
  checkRole("Administrador Interno", "Personal Contable"),
  excelCompanies
);

export default router;

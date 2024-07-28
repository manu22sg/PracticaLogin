import express from "express";
import {
  listCompanies,
  updateCompany,
  deleteCompany,
  listCompany,
  createCompany,
} from "../controllers/companyController.js";
import { authenticateToken, checkRole } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post(
  "/",
  authenticateToken,
  checkRole("Administrador Interno", "Personal Contable"),
  createCompany
);

router.get(
  "/",
  authenticateToken,
  checkRole("Administrador Interno", "Personal Contable"),
  listCompanies
);

router.get(
  "/:rut",
  authenticateToken,
  checkRole("Administrador Interno", "Personal Contable"),
  listCompany
);

router.patch(
  "/:rut",
  authenticateToken,
  checkRole("Administrador Interno", "Personal Contable"),
  updateCompany
);

router.delete(
  "/:rut",
  authenticateToken,
  checkRole("Administrador Interno", "Personal Contable"),
  deleteCompany
);

export default router;

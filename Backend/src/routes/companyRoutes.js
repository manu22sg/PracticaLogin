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
  checkRole("Administrador Interno"),
  createCompany
);

router.get(
  "/",
  authenticateToken,
  checkRole("Administrador Interno"),
  listCompanies
);

router.get(
  "/:rut",
  authenticateToken,
  checkRole("Administrador Interno"),
  listCompany
);

router.patch(
  "/:rut",
  authenticateToken,
  checkRole("Administrador Interno"),
  updateCompany
);

router.delete(
  "/:rut",
  authenticateToken,
  checkRole("Administrador Interno"),
  deleteCompany
);

export default router;

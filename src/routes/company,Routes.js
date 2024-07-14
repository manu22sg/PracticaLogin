import express from "express";
import {
  listCompanies,
  updateCompany,
  deleteCompany,
  listCompany,
} from "../controllers/companyController.js";
import { authenticateToken, checkRole } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.get(
  "/",
  authenticateToken,
  checkRole("Administrador Interno"),
  listCompanies
);
router.get(
  "/:email",
  authenticateToken,
  checkRole("Administrador Interno"),
  listCompany
);
router.patch(
  "/:email",
  authenticateToken,
  checkRole("Administrador Interno"),
  updateCompany
);
router.delete(
  "/:email",
  authenticateToken,
  checkRole("Administrador Interno"),
  deleteCompany
);

export default router;

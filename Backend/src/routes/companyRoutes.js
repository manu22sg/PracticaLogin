import express from "express";
import {
  listCompanies,
  updateCompany,
  deleteCompany,
  listCompany,
  createCompany,
} from "../controllers/companyController.js"; // Importamos las funciones de controlador de empresas
import { authenticateToken, checkRole } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post( // Definimos la ruta para registrar una empresa
  "/",
  authenticateToken,
  checkRole("Administrador Interno"), /// Definimos los roles que pueden acceder a la ruta
  createCompany /// Definimos la función de controlador para registrar una empresa
);

router.get(
  "/",
  authenticateToken,
  checkRole("Administrador Interno", "Personal Contable"), /// Definimos los roles que pueden acceder a la ruta
  listCompanies /// Definimos la función de controlador para listar las empresas
);

router.get(
  "/:rut",
  authenticateToken, /// Definimos el middleware de autenticación
  checkRole("Administrador Interno", "Personal Contable"), /// Definimos los roles que pueden acceder a la ruta
  listCompany /// Definimos la función de controlador para listar una empresa
);

router.patch(
  "/:rut",
  authenticateToken, /// Definimos el middleware de autenticación
  checkRole("Administrador Interno", "Personal Contable"), /// Definimos los roles que pueden acceder a la ruta
  updateCompany /// Definimos la función de controlador para actualizar una empresa
);

router.delete(
  "/:rut",
  authenticateToken, /// Definimos el middleware de autenticación
  checkRole("Administrador Interno", "Personal Contable"), /// Definimos los roles que pueden acceder a la ruta
  deleteCompany /// Definimos la función de controlador para eliminar una empresa
);

export default router;

import express from "express";
import {
  listUsers,
  updateUser,
  deleteUser,
  listUser,
  resetPassword,
  requestResetPassword,
} from "../controllers/userController.js";
import { authenticateToken, checkRole } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get(
  // Ruta para obtener todos los usuarios
  "/",
  authenticateToken,
  checkRole("Administrador Interno", "Personal Contable"),
  listUsers
);
router.get(
  // Ruta para obtener un usuario en específico
  "/:rut",
  authenticateToken,
  checkRole("Administrador Interno", "Personal Contable"),
  listUser
);
router.patch(
  // Ruta para actualizar un usuario en específico
  "/:rut",
  authenticateToken,
  checkRole("Administrador Interno", "Personal Contable"),
  updateUser
);
router.delete(
  // Ruta para eliminar un usuario en específico
  "/:rut",
  authenticateToken,
  checkRole("Administrador Interno", "Personal Contable"),
  deleteUser
);

router.post('/request-reset-password', requestResetPassword);

// Ruta para restablecer la contraseña
router.post('/reset-password', resetPassword);

export default router;

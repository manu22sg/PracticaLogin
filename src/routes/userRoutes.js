import express from "express";
import {
  listUsers,
  updateUser,
  deleteUser,
  listUser,
} from "../controllers/userController.js";
import { authenticateToken, checkRole } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get(
  // Ruta para obtener todos los usuarios
  "/",
  authenticateToken,
  checkRole("Administrador Interno"),
  listUsers
);
router.get(
  // Ruta para obtener un usuario en específico
  "/:rut",
  authenticateToken,
  checkRole("Administrador Interno"),
  listUser
);
router.patch(
  // Ruta para actualizar un usuario en específico
  "/:rut",
  authenticateToken,
  checkRole("Administrador Interno"),
  updateUser
);
router.delete(
  // Ruta para eliminar un usuario en específico
  "/:rut",
  authenticateToken,
  checkRole("Administrador Interno"),
  deleteUser
);

export default router;

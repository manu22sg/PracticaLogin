import express from "express";
import { login, logout, register } from "../controllers/authController.js"; // Importamos las funciones de autenticación
import { authenticateToken } from "../middlewares/authMiddleware.js"; // Importamos el middleware de autenticación


const router = express.Router();

router.post("/login",login);  // Definimos la ruta para iniciar sesión
router.post("/register", register); // Definimos la ruta para registrar un usuario
router.post("/logout",authenticateToken, logout); // Definimos la ruta para cerrar sesión


export default router;

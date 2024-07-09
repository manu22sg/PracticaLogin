import {
  login,
  register,
  auth,
  storeUser,
  logout,
} from "../controllers/loginControllers.js";
import { Router } from "express";
const router = Router();
router.get("/login", login); // Ruta para la página de login
router.post("/login", auth); // Ruta para autenticar al usuario
router.get("/register", register); // Ruta para la página de registro
router.post("/register", storeUser); // Ruta para registrar al usuario
router.get("/logout", logout); // Ruta para cerrar sesión

export default router;

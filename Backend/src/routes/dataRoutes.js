import express from 'express';


import { authenticateToken, checkRole } from '../middlewares/authMiddleware.js';
import { regiones,provincias,comunas } from '../controllers/dataController.js';

const router = express.Router();


router.get('/regiones',authenticateToken,checkRole("Administrador Interno", "Personal Contable"),regiones);
router.get('/provincias',authenticateToken,checkRole("Administrador Interno", "Personal Contable"),provincias);
router.get('/comunas/',authenticateToken,checkRole("Administrador Interno", "Personal Contable"),comunas);

export default router;
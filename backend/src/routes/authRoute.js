import { Router } from "express";
import * as authController from "../controllers/authController.js";

// Rota de autenticação para login de usuários
const router = Router();

router.post("/login", authController.login);

export default router;
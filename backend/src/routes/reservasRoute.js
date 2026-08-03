import { Router } from "express";
import * as reservasController from "../controllers/reservasController.js";
import { validate } from "../middlewares/validate.js";
import { createReservaSchema } from "../schemas/reservasSchema.js";
import { autenticar } from "../middlewares/authMiddleware.js";

// Rota de reservas, responsável por gerenciar as operações relacionadas às reservas de salas.
const router = Router();

// Criar uma nova reserva
router.post("/", autenticar, validate(createReservaSchema), reservasController.create);

// Buscar todas as reservas do usuário autenticado
router.get("/", autenticar, reservasController.getAll);

// Buscar uma reserva específica pelo ID
router.get("/:id", autenticar, reservasController.getById);

//Deletar uma reserva específica pelo ID
router.delete("/:id", autenticar, reservasController.remove);

export default router;
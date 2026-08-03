import { Router } from "express";
import * as salasController from "../controllers/salasController.js";
import { validate } from "../middlewares/validate.js";
import { createSalaSchema, updateSalaSchema } from "../schemas/salasSchema.js";
import { autenticar, exigirAdmin } from "../middlewares/authMiddleware.js";

// Rota de salas, responsável por gerenciar as operações relacionadas às salas de coworking.
const router = Router();

// Criar uma nova sala (somente admin)
router.post("/", autenticar, exigirAdmin, validate(createSalaSchema), salasController.create);

// Buscar todas as salas disponíveis (qualquer usuário autenticado)
router.get("/", autenticar, salasController.getAll);

// Buscar detalhes de uma sala específica pelo ID (qualquer usuário autenticado)
router.get("/:id", autenticar, salasController.getById);

// Atualizar uma sala existente pelo ID (somente admin)
router.put("/:id", autenticar, exigirAdmin, validate(updateSalaSchema), salasController.update);

// Deletar uma sala específica pelo ID (somente admin)
router.delete("/:id", autenticar, exigirAdmin, salasController.remove);

export default router;
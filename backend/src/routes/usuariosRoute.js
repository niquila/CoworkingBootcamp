import { Router } from "express";
import * as usuariosController from "../controllers/usuariosController.js";
import { validate } from "../middlewares/validate.js";
import { createUsuarioSchema, updateUsuarioSchema } from "../schemas/usuariosSchema.js";
import { autenticar } from "../middlewares/authMiddleware.js";

// Rota de usuários, responsável por gerenciar as operações relacionadas aos usuários do sistema.
const router = Router();

// Criar um novo usuário (registro)
router.post("/", validate(createUsuarioSchema), usuariosController.create);

// Buscar todos os usuários cadastrados (exige autenticação)
router.get("/", autenticar, usuariosController.getAll);

// Buscar detalhes de um usuário específico pelo ID (exige autenticação)
router.get("/:id", autenticar, usuariosController.getById);

// Atualizar os dados de um usuário específico pelo ID (exige autenticação)
router.put("/:id", autenticar, validate(updateUsuarioSchema), usuariosController.update);

// Deletar um usuário específico pelo ID (exige autenticação)
router.delete("/:id", autenticar, usuariosController.remove);

export default router;
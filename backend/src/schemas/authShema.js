import { z } from "zod";

// Validação do corpo da requisição para login de usuário
export const loginSchema = z.object({
  email: z
    .string({ required_error: "E-mail e senha são obrigatórios." })
    .email("E-mail ou senha inválidos."),

  senha: z
    .string({ required_error: "E-mail e senha são obrigatórios." })
    .min(1, "E-mail e senha são obrigatórios."),
});
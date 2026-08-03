import { z } from "zod";

// Validação do corpo da requisição para criação e atualização de usuários

export const createUsuarioSchema = z.object({
  nome: z
    .string({ required_error: "O campo nome é obrigatório." })
    .min(2, "O nome deve ter pelo menos 2 caracteres."),

  email: z
    .string({ required_error: "O campo email é obrigatório." })
    .email("E-mail com formato inválido."),

  senha: z
    .string({ required_error: "O campo senha é obrigatório." })
    .min(1, "O campo senha é obrigatório."),

  telefone: z
    .string({ required_error: "O campo telefone é obrigatório." })
    .min(1, "O campo telefone é obrigatório."),

  cpf: z
    .string({ required_error: "O campo cpf é obrigatório." })
    .min(1, "O campo cpf é obrigatório."),
});

export const updateUsuarioSchema = createUsuarioSchema.partial();
import { z } from "zod";

// Validação do corpo da requisição para criação e atualização de salas
export const createSalaSchema = z.object({
  nome: z
    .string({ required_error: "O campo nome é obrigatório." })
    .min(2, "O nome deve ter pelo menos 2 caracteres."),

  capacidade: z.coerce
    .number({ required_error: "O campo capacidade é obrigatório." })
    .int("A capacidade deve ser um número inteiro.")
    .positive("A capacidade deve ser maior que zero."),

  descricao: z.string().optional().nullable(),

  precoLocacao: z.coerce
    .number({ required_error: "O campo preço de locação é obrigatório." })
    .min(0, "O preço de locação deve ser maior ou igual a zero."),
});

export const updateSalaSchema = createSalaSchema.partial();
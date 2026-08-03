import { z } from "zod";

// Validação do corpo da requisição para criação e atualização de reservas
export const createReservaSchema = z.object({

  turno: z
  
    .enum(["MANHA", "TARDE", "NOITE"], 
        {errorMap: () => ({ message: "O turno deve ser MANHA, TARDE ou NOITE." }),
    }),
    
  idUsuario: z.coerce
    .number({ required_error: "O campo ID do usuário é obrigatório." })
    .int("O ID do usuário deve ser um número inteiro.")
    .positive("O ID do usuário deve ser um número positivo."),

  idSala: z.coerce
    .number({ required_error: "O campo ID da sala é obrigatório." })
    .int("O ID da sala deve ser um número inteiro.")
    .positive("O ID da sala deve ser um número positivo."),

  dia: z
    .string({ required_error: "O campo dia é obrigatório." })
    .regex(/^\d{4}-\d{2}-\d{2}$/, "A data informada no campo 'dia' é inválida.")
    .refine((val) => {
      const [ano, mes, dia] = val.split("-").map(Number);
      const data = new Date(ano, mes - 1, dia);
      return data.getFullYear() === ano && data.getMonth() + 1 === mes && data.getDate() === dia;
    }, {
      message: "A data informada no campo 'dia' é inválida.",
    }),

});

// Para atualização parcial, todos os campos tornam-se opcionais
export const updateReservaSchema = createReservaSchema.partial();
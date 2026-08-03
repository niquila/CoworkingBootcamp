import prisma from "../config/prisma.js";

/**
 * @param {Object} params
 * @param {number} params.idSala - ID da sala
 * @param {string|Date} params.dia - Dia da reserva
 * @param {string} params.turno - Turno da reserva
 * @param {number} [params.idIgnorar] - ID da reserva a ignorar na checagem (usado no update)
 * @throws {Error} Erro HTTP 409 Conflict se já existir uma reserva conflitante
 */

// Função auxiliar para verificar se já existe uma reserva para a mesma sala, dia e turno
async function verificarDisponibilidade({ idSala, dia, turno, idIgnorar }) {
  const conflito = await prisma.reserva.findFirst({
    where: {
      idSala,
      dia: new Date(dia),
      turno,
      ...(idIgnorar && { id: { not: idIgnorar } }),
    },
  });

  if (conflito) {
    const error = new Error("Esta sala já está reservada para o dia e turno selecionados.");
    error.status = 409;
    error.code = "RESERVATION_CONFLICT";
    throw error;
  }
}

//Cria uma nova reserva no banco de dados, após verificar disponibilidade
export async function createReserva(data) {
  const { dia, turno, idUsuario, idSala } = data;

  await verificarDisponibilidade({ idSala, dia, turno });

  return await prisma.reserva.create({
    data: { dia: new Date(dia), turno, idUsuario, idSala },
  });
}

// Retorna a lista de todas as reservas no banco de dados.
export async function getAllReservas() {
  return await prisma.reserva.findMany();
}

//Retorna uma única reserva pelo ID.
export async function getReservaById(id) {
  const reserva = await prisma.reserva.findUnique({
    where: { id },
  });

  if (!reserva) {
    const error = new Error("reserva não encontrada.");
    error.status = 404;
    error.code = "RESERVATION_NOT_FOUND";
    throw error;
  }

  return reserva;
}

//Remove uma reserva existente no banco de dados, após verificar se ela existe.
export async function deleteReserva(id) {
  const reserva = await prisma.reserva.findUnique({
    where: { id },
  });

  if (!reserva) {
    const error = new Error("reserva não encontrada.");
    error.status = 404;
    error.code = "RESERVATION_NOT_FOUND";
    throw error;
  }

  await prisma.reserva.delete({
    where: { id },
  });

  return { success: true, message: "reserva deletada com sucesso." };
}
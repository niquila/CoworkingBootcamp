import prisma from "../config/prisma.js";

/**
 * @param {Object} data - Dados do sala a ser cadastrado
 * @param {string} data.nome - Nome da sala
 * @param {number} data.capacidade - Capacidade da sala
 * @param {string} data.descricao - Descrição da sala
 * @param {number} data.precoLocacao - Preço de locação da sala 
 * @returns {Promise<Object>} Objeto do sala criado no banco de dados
 */

// Cria uma nova sala no banco de dados
export async function createSala(data) {
  const { nome, capacidade, descricao, precoLocacao } = data;

  // Criar sala 
  return await prisma.sala.create({
    data: { nome, capacidade, descricao, precoLocacao },
  });
}

// Retorna a lista de todas as salas no banco de dados.
export async function getAllSalas() {
  return await prisma.sala.findMany();
}

// Retorna uma única sala pelo ID.
export async function getSalaById(id) {
  const sala = await prisma.sala.findUnique({
    where: { id },
  });

  if (!sala) {
    const error = new Error("sala não encontrada.");
    error.status = 404; // HTTP 404: Not Found
    error.code = "ROOM_NOT_FOUND";
    throw error;
  }

  return sala;
}

// Atualiza os dados de uma sala existente no banco de dados, após verificar se ela existe.
export async function updateSala(id, data) {
  const { nome, capacidade, descricao, precoLocacao } = data;

  const sala = await prisma.sala.findUnique({
    where: { id },
  });
  if (!sala) {
    const error = new Error("sala não encontrada.");
    error.status = 404; // HTTP 404: Not Found
    error.code = "ROOM_NOT_FOUND";
    throw error;
  }

  return await prisma.sala.update({
    where: { id },
    data: { nome, capacidade, descricao, precoLocacao },
  });
}

// Deleta uma sala existente no banco de dados, após verificar se ela existe.
export async function deleteSala(id) {
  const sala = await prisma.sala.findUnique({
    where: { id },
  });

  if (!sala) {
    const error = new Error("sala não encontrada.");
    error.status = 404; 
    error.code = "ROOM_NOT_FOUND";
    throw error;
  }

  await prisma.sala.delete({
    where: { id },
  });

  return { success: true, message: "sala deletada com sucesso." };
}
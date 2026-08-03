import bcrypt from "bcrypt";
import prisma from "../config/prisma.js";

/**
 * @param {Object} data - Dados do usuário a ser cadastrado
 * @param {string} data.nome - Nome completo
 * @param {string} data.email - E-mail único
 * @param {string} data.senha - Senha de acesso (em texto puro, será convertida em hash)
 * @param {string} data.telefone - Telefone de contato
 * @param {string} data.cpf - CPF único
 * @returns {Promise<Object>} Objeto do usuário criado no banco de dados
 * @throws {Error} Erro HTTP 409 Conflict se e-mail ou CPF já estiverem cadastrados
 */

// Cria um novo usuário no banco de dados, após validar unicidade de e-mail e CPF
export async function createUsuario(data) {
  const { nome, email, senha, telefone, cpf } = data;

  const emailExistente = await prisma.usuario.findUnique({
    where: { email },
  });
  if (emailExistente) {
    const error = new Error("E-mail já cadastrado.");
    error.status = 409; 
    error.code = "EMAIL_ALREADY_EXISTS";
    throw error;
  }

  const cpfExistente = await prisma.usuario.findUnique({
    where: { cpf },
  });
  if (cpfExistente) {
    const error = new Error("CPF já cadastrado.");
    error.status = 409; // HTTP 409: Conflict
    error.code = "CPF_ALREADY_EXISTS";
    throw error;
  }

  //Gerar o hash da senha antes de salvar (nunca salvar senha em texto puro)
  const senhaHash = await bcrypt.hash(senha, 10);

  return await prisma.usuario.create({
    data: { nome, email, senha: senhaHash, telefone, cpf },
  });
}

// Retorna a lista de todos os usuários cadastrados no banco de dados.
export async function getAllUsuarios() {
  return await prisma.usuario.findMany();
}

// Retorna os dados de um usuário existente pelo seu ID.
export async function getUsuarioById(id) {
  const usuario = await prisma.usuario.findUnique({
    where: { id },
  });

  if (!usuario) {
    const error = new Error("Usuário não encontrado.");
    error.status = 404; // HTTP 404: Not Found
    error.code = "USER_NOT_FOUND";
    throw error;
  }

  return usuario;
}

// Atualiza os dados de um usuário.
export async function updateUsuario(id, data) {
  const { nome, email, senha, telefone, cpf } = data;

  //Verificar se o usuário existe
  const usuario = await prisma.usuario.findUnique({
    where: { id },
  });
  if (!usuario) {
    const error = new Error("Usuário não encontrado.");
    error.status = 404; 
    error.code = "USER_NOT_FOUND";
    throw error;
  }

  // Se for atualizar email e ele for diferente do e-mail atual do usuário, verificar se já existe outro usuário com o mesmo e-mail
  if (email && email !== usuario.email) {
    const emailExistente = await prisma.usuario.findUnique({
      where: { email },
    });
    if (emailExistente) {
      const error = new Error("E-mail já em uso por outro usuário.");
      error.status = 409; // HTTP 409: Conflict
      error.code = "EMAIL_ALREADY_EXISTS";
      throw error;
    }
  }

  //Se for atualizar CPF e ele for diferente do CPF atual do usuário, verificar se já existe outro usuário com o mesmo CPF
  if (cpf && cpf !== usuario.cpf) {
    const cpfExistente = await prisma.usuario.findUnique({
      where: { cpf },
    });
    if (cpfExistente) {
      const error = new Error("CPF já em uso por outro usuário.");
      error.status = 409; // HTTP 409: Conflict
      error.code = "CPF_ALREADY_EXISTS";
      throw error;
    }
  }

  const dataToUpdate = { nome, email, telefone, cpf };
  if (senha) {
    dataToUpdate.senha = await bcrypt.hash(senha, 10);
  }

  return await prisma.usuario.update({
    where: { id },
    data: dataToUpdate,
  });
}

//Remove um usuário existente do banco de dados.
export async function deleteUsuario(id) {

  const usuario = await prisma.usuario.findUnique({
    where: { id },
  });

  if (!usuario) {
    const error = new Error("Usuário não encontrado.");
    error.status = 404; // HTTP 404: Not Found
    error.code = "USER_NOT_FOUND";
    throw error;
  }

  //Deletar usuário do banco
  await prisma.usuario.delete({
    where: { id },
  });

  return { success: true, message: "Usuário deletado com sucesso." };
}
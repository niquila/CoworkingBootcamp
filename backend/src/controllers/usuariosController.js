import * as usuariosService from "../services/usuariosService.js";

/**
 * Cria um novo usuário no sistema.
 * @param {import("express").Request} req - Objeto de requisição do Express contendo os dados do usuário em `req.body`
 * @param {import("express").Response} res - Resposta HTTP 201 Created com o usuário cadastrado
 * @param {import("express").NextFunction} next - Passa o erro para o manipulador central do Express
 * @returns {Promise<Response>} Retorna a resposta HTTP 201 Created com os dados do usuário
 */
export async function create(req, res, next) {
  try {
    const novoUsuario = await usuariosService.createUsuario(req.body);
    return res.status(201).json(novoUsuario);
  } catch (err) {
    next(err);
  }
}

// Retorna todos os usuários cadastrados no sistema.
export async function getAll(req, res, next) {
  try {
    const usuarios = await usuariosService.getAllUsuarios();
    return res.json(usuarios);
  } catch (err) {
    next(err);
  }
}

// Busca um usuário pelo seu ID.
export async function getById(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      const error = new Error("O parâmetro ID deve ser um número inteiro válido.");
      error.status = 400;
      throw error;
    }
    const usuario = await usuariosService.getUsuarioById(id);
    return res.json(usuario);
  } catch (err) {
    next(err);
  }
}

// Atualiza os dados de um usuário existente pelo seu ID.
export async function update(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      const error = new Error("O parâmetro ID deve ser um número inteiro válido.");
      error.status = 400;
      throw error;
    }
    const usuarioAtualizado = await usuariosService.updateUsuario(id, req.body);
    return res.json(usuarioAtualizado);
  } catch (err) {
    next(err);
  }
}

// Exclui um usuário do sistema pelo seu ID.
export async function remove(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      const error = new Error("O parâmetro ID deve ser um número inteiro válido.");
      error.status = 400;
      throw error;
    }
    const result = await usuariosService.deleteUsuario(id);
    return res.json(result);
  } catch (err) {
    next(err);
  }
}
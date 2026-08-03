import * as salasService from "../services/salasService.js";
/**
 * Cria uma nova sala no sistema.
 * 
 * @param {import("express").Request} req - Objeto de requisição do Express contendo os dados da sala em `req.body`
 * @param {import("express").Response} res - Resposta HTTP 201 Created com a sala cadastrada
 * @param {import("express").NextFunction} next - Passa o erro para o manipulador central do Express
 * @returns {Promise<Response>} Retorna a resposta HTTP 201 Created com os dados da sala
 */
export async function create(req, res, next) {
  try {
    const novaSala = await salasService.createSala(req.body);
    return res.status(201).json(novaSala);
  } catch (err) {
    next(err);
  }
}

// Retorna todas as salas cadastradas no sistema.
export async function getAll(req, res, next) {
  try {
    const salas = await salasService.getAllSalas();
    return res.json(salas);
  } catch (err) {
    next(err);
  }
}

// Busca uma sala pelo seu ID.
export async function getById(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      const error = new Error("O parâmetro ID deve ser um número inteiro válido.");
      error.status = 400;
      throw error;
    }
    const sala = await salasService.getSalaById(id);
    return res.json(sala);
  } catch (err) {
    next(err);
  }
}

// Atualiza os dados de uma sala existente pelo seu ID.
export async function update(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      const error = new Error("O parâmetro ID deve ser um número inteiro válido.");
      error.status = 400;
      throw error;
    }
    const salaAtualizada = await salasService.updateSala(id, req.body);
    return res.json(salaAtualizada);
  } catch (err) {
    next(err);
  }
}

// Exclui uma sala do sistema pelo seu ID.
export async function remove(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      const error = new Error("O parâmetro ID deve ser um número inteiro válido.");
      error.status = 400;
      throw error;
    }
    const result = await salasService.deleteSala(id);
    return res.json(result);
  } catch (err) {
    next(err);
  }
}
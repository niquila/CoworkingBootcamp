import * as reservasService from "../services/reservasService.js";


/**
 * Cria uma nova reserva no sistema.
 * @param {import("express").Request} req - Objeto de requisição do Express contendo os dados da reserva em `req.body`
 * @param {import("express").Response} res - Resposta HTTP 201 Created com a reserva cadastrada
 * @param {import("express").NextFunction} next - Passa o erro para o manipulador central do Express
 * @returns {Promise<Response>} Retorna a resposta HTTP 201 Created com os dados da reserva
 */
export async function create(req, res, next) {
  try {
    const novaReserva = await reservasService.createReserva(req.body);
    return res.status(201).json(novaReserva);
  } catch (err) {
    next(err);
  }
}

// Retorna todas as reservas cadastradas no sistema.
export async function getAll(req, res, next) {
  try {
    const reservas = await reservasService.getAllReservas();
    return res.json(reservas);
  } catch (err) {
    next(err);
  }
}

// Busca uma reserva pelo seu ID.

export async function getById(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      const error = new Error("O parâmetro ID deve ser um número inteiro válido.");
      error.status = 400;
      throw error;
    }
    const reserva = await reservasService.getReservaById(id);
    return res.json(reserva);
  } catch (err) {
    next(err);
  }
}



 //Exclui uma reserva do sistema pelo seu ID. 

export async function remove(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      const error = new Error("O parâmetro ID deve ser um número inteiro válido.");
      error.status = 400;
      throw error;
    }
    const result = await reservasService.deleteReserva(id);
    return res.json(result);
  } catch (err) {
    next(err);
  }
}
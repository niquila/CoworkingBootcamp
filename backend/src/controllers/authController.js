import * as authService from "../services/authService.js";

/**
 * Controller de Autenticação (authController)
 * @param {import("express").Request} req - Objeto de requisição contendo email e senha em `req.body`
 * @param {import("express").Response} res - Resposta HTTP 200 OK com mensagem e dados do usuário
 * @param {import("express").NextFunction} next - Passa o erro para o manipulador central do Express
 * @returns {Promise<Response>} Retorna a resposta HTTP 200 OK com os dados de login
 */

export async function login(req, res, next) {
  try {
    const resultado = await authService.loginUsuario(req.body);
    return res.json(resultado);
  } catch (err) {
    next(err);
  }
}
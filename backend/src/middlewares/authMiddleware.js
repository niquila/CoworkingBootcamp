import jwt from "jsonwebtoken";

// Middleware de autenticação para proteger rotas que requerem um token JWT válido.
export function autenticar(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    const error = new Error("Token de autenticação não fornecido.");
    error.status = 401;
    return next(error);
  }

  const token = authHeader.split(" ")[1]; 

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = payload; // disponibiliza { id, email, eAdmin } para o resto da requisição
    next();
  } catch (err) {
    const error = new Error("Token inválido ou expirado.");
    error.status = 401;
    next(error);
  }
}

// Middleware para verificar se o usuário autenticado é um administrador.
export function exigirAdmin(req, res, next) {
  if (!req.usuario?.eAdmin) {
    const error = new Error("Acesso restrito a administradores.");
    error.status = 403; 
    return next(error);
  }
  next();
}
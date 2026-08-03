import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma.js";

/**
 * @param {Object} credentials - Objeto contendo as credenciais de acesso
 * @param {string} credentials.email - E-mail do usuário
 * @param {string} credentials.senha - Senha em texto puro do usuário
 * @returns {Promise<{message: string, token: string, usuario: Object}>} Mensagem, token JWT e dados do usuário (sem a senha)
 * @throws {Error} Lança um erro HTTP 401 (Unauthorized) se as credenciais forem inválidas
 */


export async function loginUsuario({ email, senha }) {
  // 1. Buscar usuário cadastrado pelo e-mail no banco
  const usuario = await prisma.usuario.findUnique({
    where: { email },
  });

  // 2. Verificar se o usuário existe e se a senha confere (comparação segura via hash)
  const senhaValida = usuario && (await bcrypt.compare(senha, usuario.senha));

  if (!usuario || !senhaValida) {
    const error = new Error("E-mail ou senha inválidos.");
    error.status = 401; // HTTP 401: Unauthorized (Não autorizado)
    throw error;
  }

  // 3. Gerar o token JWT, contendo apenas as informações necessárias para identificar o usuário
  const token = jwt.sign(
    { id: usuario.id, email: usuario.email, eAdmin: usuario.eAdmin },
    process.env.JWT_SECRET,
    { expiresIn: "8h" } // token expira em 8 horas, exigindo novo login depois disso
  );

  // 4. Criar uma cópia do usuário e remover a senha por motivos de segurança
  const usuarioSemSenha = { ...usuario };
  delete usuarioSemSenha.senha;

  return {
    message: "Login realizado com sucesso.",
    token,
    usuario: usuarioSemSenha,
  };
}
import { getToken, logout } from "../utils/auth";

const API_URL = "http://localhost:3000/api";

// Função genérica para fazer requisições à API, incluindo o token de autenticação no cabeçalho e tratamento de erros.
async function request(endpoint, options = {}) {
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Token ausente/inválido/expirado: desloga e manda de volta pro login
  if (res.status === 401) {
    logout();
    window.location.href = "/";
    throw new Error("Sessão expirada. Faça login novamente.");
  }

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Erro na requisição.");
  }

  return data;
}

// Autenticação: login do usuário, recebendo e-mail e senha, retornando dados do usuário e token JWT.
export function login(email, senha) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, senha }),
  });
}
export function cadastrarUsuario(dados) {
  return request("/usuarios", {
    method: "POST",
    body: JSON.stringify(dados),
  });
}

export function getUsuario(id) {
  return request(`/usuarios/${id}`);
}

export function getUsuarios() {
  return request("/usuarios");
}

export function atualizarUsuario(id, dados) {
  return request(`/usuarios/${id}`, {
    method: "PUT",
    body: JSON.stringify(dados),
  });
}

export function excluirUsuario(id) {
  return request(`/usuarios/${id}`, {
    method: "DELETE",
  });
}

// Salas:criar, atualizar, excluir e listar salas, incluindo tratamento de erros e envio de token JWT para autenticação.
export function getSalas() {
  return request("/salas");
}

export function criarSala(dados) {
  return request("/salas", {
    method: "POST",
    body: JSON.stringify(dados),
  });
}

export function atualizarSala(id, dados) {
  return request(`/salas/${id}`, {
    method: "PUT",
    body: JSON.stringify(dados),
  });
}

export function excluirSala(id) {
  return request(`/salas/${id}`, {
    method: "DELETE",
  });
}

// Reservas: criar, excluir e listar reservas, incluindo tratamento de erros e envio de token JWT para autenticação.
export function getReservas() {
  return request("/reservas");
}

export function criarReserva(dados) {
  return request("/reservas", {
    method: "POST",
    body: JSON.stringify(dados),
  });
}

export function excluirReserva(id) {
  return request(`/reservas/${id}`, {
    method: "DELETE",
  });
}
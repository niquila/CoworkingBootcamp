// Funções de autenticação e gerenciamento de sessão do usuário.
export function salvarUsuarioLogado(usuario) {
  localStorage.setItem("usuario", JSON.stringify(usuario));
}

export function getUsuarioLogado() {
  const usuario = localStorage.getItem("usuario");
  return usuario ? JSON.parse(usuario) : null;
}

export function salvarToken(token) {
  localStorage.setItem("token", token);
}

export function getToken() {
  return localStorage.getItem("token");
}

export function logout() {
  localStorage.removeItem("usuario");
  localStorage.removeItem("token");
}

export function estaLogado() {
  return getUsuarioLogado() !== null && getToken() !== null;
}

export function ehAdmin() {
  const usuario = getUsuarioLogado();
  return usuario?.eAdmin === true;
}

export function salvarSessao(usuario, token) {
  salvarUsuarioLogado(usuario);
  salvarToken(token);
}
import { NavLink, useNavigate } from "react-router-dom";
import { getUsuarioLogado, logout, ehAdmin } from "../utils/auth";

// Componente Navbar: barra de navegação que exibe links para diferentes seções do aplicativo.
function Navbar() {
  const usuario = getUsuarioLogado();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  if (!usuario) return null;

  // Renderiza a barra de navegação com links para Salas, Minhas Reservas, Meu Perfil e, se o usuário for admin, Gerenciar Salas. Também inclui um botão de logout.
  return (
    <>
      <nav>
        <NavLink to="/salas" className={({ isActive }) => (isActive ? "ativo active" : "")}>
          Salas
        </NavLink>

        <NavLink to="/reservas" className={({ isActive }) => (isActive ? "ativo active" : "")}>
          Minhas Reservas
        </NavLink>

        <NavLink to="/perfil" className={({ isActive }) => (isActive ? "ativo active" : "")}>
          Meu Perfil
        </NavLink>

        {ehAdmin() && (
          <NavLink to="/admin" className={({ isActive }) => (isActive ? "ativo active" : "")}>
            Gerenciar Salas
          </NavLink>
        )}

        <button onClick={handleLogout}>Sair</button>
      </nav>
      <div className="header-global-titulo">
        <span>Coworking — Aluguel de salas</span>
      </div>
    </>
  );
}

export default Navbar;
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getReservas, excluirReserva } from "../services/api";
import { getUsuarioLogado, ehAdmin } from "../utils/auth";
import Navbar from "../components/navbar";

// Componente Reservas: página que exibe as reservas do usuário logado, permitindo visualizar e cancelar reservas existentes.
function Reservas() {
  const navigate = useNavigate();
  const [reservas, setReservas] = useState([]);
  const usuario = getUsuarioLogado();

  useEffect(() => {
    // Administradores não usam esta tela: são direcionados para o painel de gerenciamento
    if (ehAdmin()) {
      navigate("/admin");
      return;
    }
    carregarReservas();
  }, []);

  // Função para carregar as reservas do usuário logado
  async function carregarReservas() {
    const todas = await getReservas();
    const minhas = todas.filter((r) => r.idUsuario === usuario.id);
    setReservas(minhas);
  }

  async function handleCancelar(id) {
    if (!confirm("Deseja cancelar essa reserva?")) return;
    await excluirReserva(id);
    carregarReservas();
  }

  return (
    <div>
      <Navbar />
      <div className="pagina-salas">
        <h1>Minhas Reservas</h1>

        <div className="grid-salas">
          {reservas.length === 0 ? (
            <p className="descricao">Você ainda não possui nenhuma reserva.</p>
          ) : (
            reservas.map((r) => (
              <div key={r.id} className="card-sala">
                <h3 className="nome">Sala {r.idSala}</h3>
                <p className="descricao">Dia: {r.dia}</p>
                <p className="descricao">Turno: {r.turno}</p>
                <button
                  className="botao-reservar"
                  onClick={() => handleCancelar(r.id)}
                >
                  Cancelar
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Reservas;
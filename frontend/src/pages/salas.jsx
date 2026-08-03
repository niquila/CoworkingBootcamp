import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSalas, getReservas, criarReserva } from "../services/api";
import { getUsuarioLogado, ehAdmin } from "../utils/auth";
import Navbar from "../components/navbar";

// Componente Salas: página que exibe as salas disponíveis para reserva, permitindo ao usuário selecionar uma sala, escolher um dia e turno, e confirmar a reserva.
const TODOS_TURNOS = [
  { value: "MANHA", label: "Manhã" },
  { value: "TARDE", label: "Tarde" },
  { value: "NOITE", label: "Noite" },
];

// Função para criar uma reserva no backend.
function Salas() {
  const navigate = useNavigate();
  const [salas, setSalas] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [erro, setErro] = useState("");
  const [salaSelecionada, setSalaSelecionada] = useState(null);
  const [dia, setDia] = useState("");
  const [turno, setTurno] = useState("MANHA");
  const usuario = getUsuarioLogado();

  // useEffect para verificar se o usuário é admin e carregar as salas e reservas ao montar o componente
  useEffect(() => {
    if (ehAdmin()) {
      navigate("/admin");
      return;
    }
    carregarSalas();
    carregarReservas();
  }, []);

  // Função para carregar as salas do backend e atualizar o estado local
  async function carregarSalas() {
    try {
      const dados = await getSalas();
      setSalas(dados);
    } catch (err) {
      setErro(err.message);
    }
  }

  // Função para carregar as reservas do backend e atualizar o estado local
  async function carregarReservas() {
    try {
      const dados = await getReservas();
      setReservas(dados);
    } catch (err) {
      console.error("Não foi possível carregar as reservas existentes:", err);
    }
  }

  // Função para obter os turnos ocupados para uma sala específica em um dia específico
  function getTurnosOcupados(idSala, diaEscolhido) {
    if (!diaEscolhido) return [];
    return reservas
      .filter((r) => r.idSala === idSala && r.dia.slice(0, 10) === diaEscolhido)
      .map((r) => r.turno);
  }

  // Função para abrir ou fechar o formulário de reserva para uma sala específica
  function handleAbrirFormulario(idSala) {
    setSalaSelecionada(salaSelecionada === idSala ? null : idSala);
    setDia("");
    setTurno("MANHA");
  }

  // Função para lidar com a mudança de dia no formulário de reserva, atualizando os turnos disponíveis
  function handleMudarDia(novoDia) {
    setDia(novoDia);
    const ocupados = getTurnosOcupados(salaSelecionada, novoDia);
    if (ocupados.includes(turno)) {
      const disponivel = TODOS_TURNOS.find((t) => !ocupados.includes(t.value));
      setTurno(disponivel ? disponivel.value : "");
    }
  }

  // Função para confirmar a reserva, enviando os dados para o backend e atualizando a lista de reservas
  async function handleConfirmarReserva(e) {
    e.preventDefault();
    try {
      await criarReserva({
        idSala: salaSelecionada,
        idUsuario: usuario.id,
        dia,
        turno,
      });
      alert("Reserva criada com sucesso!");
      setSalaSelecionada(null);
      setDia("");
      setTurno("MANHA");
      carregarReservas();
    } catch (err) {
      if (err.message.toLowerCase().includes("data")) {
        alert("Formato de data inválido.");
      } else {
        alert(err.message);
      }
    }
  }

  return (
    <div>
      <Navbar />
      <div className="pagina-salas">
        <h1>Salas disponíveis</h1>
        {erro && <p style={{ color: "red", textAlign: "center" }}>{erro}</p>}

        <div className="grid-salas">
          {salas.map((sala) => {
            const ocupados = getTurnosOcupados(sala.id, dia);
            const todosOcupados =
              salaSelecionada === sala.id && dia && ocupados.length === TODOS_TURNOS.length;

            return (
              <div key={sala.id} className="card-sala">
                <p className="nome">{sala.nome}</p>
                <p className="descricao">
                  Capacidade: {sala.capacidade} pessoas
                  <br />
                  R$ {sala.precoLocacao} / turno
                  {sala.descricao && (
                    <>
                      <br />
                      {sala.descricao}
                    </>
                  )}
                </p>

                <button className="botao-reservar" onClick={() => handleAbrirFormulario(sala.id)}>
                  {salaSelecionada === sala.id ? "Fechar" : "Reservar"}
                </button>

                {salaSelecionada === sala.id && (
                  <form onSubmit={handleConfirmarReserva} className="form-reserva">
                    <label>
                      Dia:
                      <input
                        type="date"
                        value={dia}
                        onChange={(e) => handleMudarDia(e.target.value)}
                        required
                      />
                    </label>

                    <label>
                      Turno:
                      <select value={turno} onChange={(e) => setTurno(e.target.value)}>
                        {TODOS_TURNOS.map((t) => (
                          <option key={t.value} value={t.value} disabled={ocupados.includes(t.value)}>
                            {t.label}
                            {ocupados.includes(t.value) ? " (indisponível)" : ""}
                          </option>
                        ))}
                      </select>
                    </label>

                    {todosOcupados && (
                      <p style={{ color: "orange", fontSize: "0.85rem" }}>
                        Todos os turnos já estão ocupados nesse dia.
                      </p>
                    )}

                    <button type="submit" className="botao-reservar" disabled={todosOcupados}>
                      Confirmar
                    </button>
                  </form>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Salas;
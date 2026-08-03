import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSalas, criarSala, atualizarSala, excluirSala } from "../services/api";
import { ehAdmin, logout } from "../utils/auth";

// Componente AdminSalas: página de administração para gerenciar salas de coworking, permitindo criar, editar e excluir salas.
function AdminSalas() {
  const navigate = useNavigate();
  const [salas, setSalas] = useState([]);
  const [form, setForm] = useState({ nome: "", capacidade: "", descricao: "", precoLocacao: "" });
  const [editandoId, setEditandoId] = useState(null);

  // useEffect para verificar se o usuário é admin e carregar as salas ao montar o componente
  useEffect(() => {
    if (!ehAdmin()) {
      alert("Acesso restrito a administradores.");
      navigate("/salas");
      return;
    }
    carregarSalas();
  }, []);

  // Função para carregar as salas do backend e atualizar o estado local
  async function carregarSalas() {
    setSalas(await getSalas());
  }
  function handleLogout() {
    logout();
    navigate("/");
  }

  // Função para salvar uma sala.
  async function handleSalvar(e) {
    e.preventDefault();
    const dados = {
      ...form,
      capacidade: Number(form.capacidade),
      precoLocacao: Number(form.precoLocacao),
    };

    if (editandoId) {
      await atualizarSala(editandoId, dados);
    } else {
      await criarSala(dados);
    }

    setForm({ nome: "", capacidade: "", descricao: "", precoLocacao: "" });
    setEditandoId(null);
    carregarSalas();
  }

  // Função para iniciar a edição de uma sala.
  function handleEditar(sala) {
    setForm({
      nome: sala.nome,
      capacidade: sala.capacidade,
      descricao: sala.descricao || "",
      precoLocacao: sala.precoLocacao,
    });
    setEditandoId(sala.id);
  }

  // Função para excluir uma sala.
  async function handleExcluir(id) {
    if (!confirm("Excluir esta sala?")) return;
    await excluirSala(id);
    carregarSalas();
  }

  // Função para cancelar a edição de uma sala.
  function handleCancelarEdicao() {
    setForm({ nome: "", capacidade: "", descricao: "", precoLocacao: "" });
    setEditandoId(null);
  }

  return (
    <div>
      <nav style={{ justifyContent: "flex-end" }}>
        <button onClick={handleLogout}>Sair</button>
      </nav>
      <div className="header-global-titulo">
        <span>Coworking — Aluguel de salas</span>
      </div>

      <div className="pagina-salas">
        <h1>Gerenciar Salas</h1>
        <p className="subtitulo-pagina">Painel de controle para criação e edição de espaços.</p>
        <div className="container-admin-form">
          <h2>{editandoId ? "Editar Sala" : "Criar Nova Sala"}</h2>
          <form className="form-login" onSubmit={handleSalvar}>
            <div className="campo-grupo">
              <label>Nome da Sala:</label>
              <input
                placeholder="Ex: Sala Reuniões B"
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                required
              />
            </div>

            <div className="campo-grupo">
              <label>Capacidade (pessoas):</label>
              <input
                type="number"
                placeholder="Ex: 10"
                value={form.capacidade}
                onChange={(e) => setForm({ ...form, capacidade: e.target.value })}
                required
              />
            </div>

            <div className="campo-grupo">
              <label>Descrição:</label>
              <input
                placeholder="Ex: Sala com TV 55 pol e ar condicionado"
                value={form.descricao}
                onChange={(e) => setForm({ ...form, descricao: e.target.value })}
              />
            </div>

            <div className="campo-grupo">
              <label>Preço por Turno (R$):</label>
              <input
                type="number"
                step="0.01"
                placeholder="Ex: 80"
                value={form.precoLocacao}
                onChange={(e) => setForm({ ...form, precoLocacao: e.target.value })}
                required
              />
            </div>

            <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", marginTop: "0.5rem" }}>
              <button type="submit">
                {editandoId ? "Atualizar Sala" : "Criar Sala"}
              </button>
              {editandoId && (
                <button
                  type="button"
                  className="botao-secundario"
                  onClick={handleCancelarEdicao}
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>
        <div className="grid-salas">
          {salas.map((sala) => (
            <div key={sala.id} className="card-sala">
              <h3 className="nome">{sala.nome}</h3>
              
              <div className="tags-container">
                <span className="badge">Capacidade: {sala.capacidade} p.</span>
                <span className="badge destaque">R$ {sala.precoLocacao} / turno</span>
              </div>

              {sala.descricao && <p className="descricao">{sala.descricao}</p>}

              <div style={{ display: "flex", gap: "0.5rem", marginTop: "auto", paddingTop: "0.5rem" }}>
                <button
                  className="botao-reservar"
                  onClick={() => handleEditar(sala)}
                >
                  Editar
                </button>
                <button
                  className="botao-secundario"
                  onClick={() => handleExcluir(sala.id)}
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminSalas;
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUsuario, atualizarUsuario } from "../services/api";
import { getUsuarioLogado, salvarUsuarioLogado, ehAdmin } from "../utils/auth";
import Navbar from "../components/navbar";

// Componente Perfil: página de perfil do usuário, permitindo visualizar e atualizar informações pessoais.
function Perfil() {
  const navigate = useNavigate();
  const usuarioLogado = getUsuarioLogado();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  // useEffect para carregar os dados do usuário logado ao montar o componente
  useEffect(() => {
    if (ehAdmin()) {
      navigate("/admin");
      return;
    }

    async function carregar() {
      const dados = await getUsuario(usuarioLogado.id);
      setNome(dados.nome);
      setEmail(dados.email);
      setTelefone(dados.telefone);
    }
    carregar();
  }, []);

  async function handleSalvar(e) {
    e.preventDefault();
    setMensagem("");
    setErro("");
// Validação para garantir que a nova senha e a confirmação de senha coincidam
    if (novaSenha && novaSenha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    try {
      const dadosParaAtualizar = { nome, email, telefone };
      if (novaSenha) {
        dadosParaAtualizar.senha = novaSenha;
      }

      // Chamada à função de serviço para atualizar os dados do usuário
      const atualizado = await atualizarUsuario(usuarioLogado.id, dadosParaAtualizar);
      salvarUsuarioLogado(atualizado);
      setMensagem("Perfil atualizado com sucesso!");
      setNovaSenha("");
      setConfirmarSenha("");
    } catch (err) {
      setErro(err.message);
    }
  }
  return (
    <div>
      <Navbar />
      <h1 style={{ textAlign: "center" }}>Meu Perfil</h1>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          maxWidth: "320px",
          margin: "0 auto",
        }}
      >
        {mensagem && <p style={{ color: "green" }}>{mensagem}</p>}
        {erro && <p style={{ color: "red" }}>{erro}</p>}

        <form
          onSubmit={handleSalvar}
          style={{ display: "flex", flexDirection: "column", width: "100%" }}
        >
          <label style={{ marginBottom: "1rem", textAlign: "center" }}>
            Nome:
            <input
              style={{ display: "block", width: "100%", marginTop: "0.25rem" }}
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </label>

          <label style={{ marginBottom: "1rem", textAlign: "center" }}>
            E-mail:
            <input
              style={{ display: "block", width: "100%", marginTop: "0.25rem" }}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label style={{ marginBottom: "1.5rem", textAlign: "center" }}>
            Telefone:
            <input
              style={{ display: "block", width: "100%", marginTop: "0.25rem" }}
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              required
            />
          </label>

          <label style={{ marginBottom: "1rem", textAlign: "center" }}>
            Nova senha:
            <input
              style={{ display: "block", width: "100%", marginTop: "0.25rem" }}
              type="password"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              placeholder="Nova senha"
            />
          </label>

          <label style={{ marginBottom: "1.5rem", textAlign: "center" }}>
            Confirmar nova senha:
            <input
              style={{ display: "block", width: "100%", marginTop: "0.25rem" }}
              type="password"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              placeholder="Confirme a nova senha"
            />
          </label>

          <button type="submit" style={{ alignSelf: "center" }}>
            Salvar
          </button>
        </form>
      </div>
    </div>
  );
}

export default Perfil;
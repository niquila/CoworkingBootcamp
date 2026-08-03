import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, cadastrarUsuario } from "../services/api";
import { salvarUsuarioLogado, salvarToken } from "../utils/auth";

// Componente Login: página de login e cadastro de usuários, permitindo autenticação e criação de novas contas.
function Login() {
  const navigate = useNavigate();
  const [modoCadastro, setModoCadastro] = useState(false);
  const [form, setForm] = useState({ nome: "", email: "", senha: "", telefone: "", cpf: "" });
  const [erro, setErro] = useState("");

  // Função para lidar com o envio do formulário de login ou cadastro.
  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");

    try {
      if (modoCadastro) {
        await cadastrarUsuario({
          nome: form.nome,
          email: form.email,
          senha: form.senha,
          telefone: form.telefone,
          cpf: form.cpf,
        });
        alert("Conta criada com sucesso! Faça login.");
        setModoCadastro(false);
        setForm({ nome: "", email: "", senha: "", telefone: "", cpf: "" });
      } else {
        const dados = await login(form.email, form.senha);

        // Salva os dados usando as funções exportadas pelo auth.js
        salvarUsuarioLogado(dados.usuario);
        salvarToken(dados.token);

        if (dados.usuario.eAdmin) {
          navigate("/admin");
        } else {
          navigate("/salas");
        }
      }
    } catch (err) {
      setErro(err.message || "Ocorreu um erro. Tente novamente.");
    }
  }

  return (
    <div>
      <div className="header-global-titulo">
        <span>Coworking — Aluguel de salas</span>
      </div>

      <div className="container-form">
        <h1>{modoCadastro ? "Criar conta" : "Login"}</h1>

        {erro && <p style={{ color: "var(--cor-erro)", fontSize: "0.9rem" }}>{erro}</p>}

        <form className="form-login" onSubmit={handleSubmit}>
          {modoCadastro && (
            <>
              <div className="campo-grupo">
                <label>Nome:</label>
                <input
                  type="text"
                  placeholder="Seu nome completo"
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  required
                />
              </div>

              <div className="campo-grupo">
                <label>Telefone:</label>
                <input
                  type="text"
                  placeholder="11999999999"
                  value={form.telefone}
                  onChange={(e) => setForm({ ...form, telefone: e.target.value })}
                  required
                />
              </div>

              <div className="campo-grupo">
                <label>CPF:</label>
                <input
                  type="text"
                  placeholder="Somente números"
                  value={form.cpf}
                  onChange={(e) => setForm({ ...form, cpf: e.target.value })}
                  required
                />
              </div>
            </>
          )}

          <div className="campo-grupo">
            <label>E-mail:</label>
            <input
              type="email"
              placeholder="seuemail@exemplo.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div className="campo-grupo">
            <label>Senha:</label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.senha}
              onChange={(e) => setForm({ ...form, senha: e.target.value })}
              required
            />
          </div>

          <button type="submit">
            {modoCadastro ? "Cadastrar" : "Entrar"}
          </button>
        </form>

        <p style={{ marginTop: "1.5rem", fontSize: "0.9rem" }}>
          {modoCadastro ? "Já tem uma conta?" : "Ainda não tem conta?"}{" "}
          <button
            type="button"
            className="botao-secundario"
            style={{ padding: "0.3rem 0.8rem", fontSize: "0.85rem", marginLeft: "0.3rem" }}
            onClick={() => {
              setModoCadastro(!modoCadastro);
              setErro("");
            }}
          >
            {modoCadastro ? "Fazer Login" : "Criar Conta"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;
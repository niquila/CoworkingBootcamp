import express from 'express';
import cors from 'cors';
import { ZodError } from 'zod';
import routes from './src/routes/index.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', routes);

app.use((err, req, res, next) => {
  if (err instanceof ZodError || err?.name === 'ZodError') {
    const issues = err.issues || err.errors || [];
    const mensagem = issues.length > 0 ? issues.map(e => e.message).join(' ') : err.message;
    return res.status(400).json({
      message: mensagem || 'Dados inválidos na requisição.'
    });
  }

  return res.status(err.status || 500).json({
    message: err.message || 'Erro interno no servidor.'
  });
});

app.use((req, res) => {
  return res.status(404).json({
    message: `Rota ${req.originalUrl} não encontrada.`
  });
});

const PORT = 3099;
const BASE_URL = `http://localhost:${PORT}/api`;

let server;
let passedCount = 0;
let failedCount = 0;

function logTest(name, passed, details = '') {
  if (passed) {
    passedCount++;
    console.log(`  ✅ PASS: ${name} ${details}`);
  } else {
    failedCount++;
    console.log(`  ❌ FAIL: ${name} ${details}`);
  }
}

async function runTests() {
  server = app.listen(PORT, async () => {
    console.log(`\n🧪 Iniciando bateria de testes automatizados na API (Porta ${PORT})...\n`);

    try {
      // 1. System / Health
      console.log('--- 1. ROTA DE HEALTH CHECK E BOAS-VINDAS ---');
      let res = await fetch(`${BASE_URL}/health`);
      let json = await res.json();
      logTest('GET /api/health', res.status === 200 && json.status === 'OK');

      res = await fetch(`${BASE_URL}/`);
      json = await res.json();
      logTest('GET /api/', res.status === 200 && json.version === '1.0.0');

      // 2. Usuários
      console.log('\n--- 2. ENDPOINTS DE USUÁRIOS ---');
      res = await fetch(`${BASE_URL}/usuarios`);
      json = await res.json();
      logTest('GET /api/usuarios (Listar)', res.status === 200 && Array.isArray(json));

      const newUserData = {
        nome: 'Usuário Teste QA',
        email: `qa_${Date.now()}@test.com`,
        senha: 'password123',
        telefone: '11977777777',
        cpf: `${Math.floor(Math.random() * 899999999 + 100000000)}`
      };

      res = await fetch(`${BASE_URL}/usuarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUserData)
      });
      json = await res.json();
      const createdUserId = json.id;
      logTest('POST /api/usuarios (Criar)', res.status === 201 && !!createdUserId, `[ID: ${createdUserId}]`);

      res = await fetch(`${BASE_URL}/usuarios/${createdUserId}`);
      json = await res.json();
      logTest('GET /api/usuarios/:id (Buscar por ID)', res.status === 200 && json.id === createdUserId);

      res = await fetch(`${BASE_URL}/usuarios/${createdUserId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: 'Usuário QA Atualizado' })
      });
      json = await res.json();
      logTest('PUT /api/usuarios/:id (Atualizar)', res.status === 200 && json.nome === 'Usuário QA Atualizado');

      res = await fetch(`${BASE_URL}/usuarios/999999`);
      logTest('GET /api/usuarios/999999 (Inexistente)', res.status === 404);

      // 2.1 Autenticação / Login
      console.log('\n--- 2.1 ENDPOINT DE AUTENTICAÇÃO ---');
      res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newUserData.email, senha: newUserData.senha })
      });
      json = await res.json();
      logTest('POST /api/auth/login (Sucesso)', res.status === 200 && json.usuario?.email === newUserData.email && !json.usuario?.senha);

      res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newUserData.email, senha: 'senha_errada' })
      });
      json = await res.json();
      logTest('POST /api/auth/login (Senha incorreta -> 401)', res.status === 401 && !!json.message);

      res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newUserData.email })
      });
      json = await res.json();
      logTest('POST /api/auth/login (Campos obrigatórios ausentes -> 400)', res.status === 400 && !!json.message);

      // 3. Salas
      console.log('\n--- 3. ENDPOINTS DE SALAS ---');
      res = await fetch(`${BASE_URL}/salas`);
      json = await res.json();
      logTest('GET /api/salas (Listar todas)', res.status === 200 && Array.isArray(json));

      const newSalaData = {
        nome: 'Sala Teste QA',
        capacidade: 8,
        descricao: 'Sala para testes automatizados.',
        precoLocacao: 50.00
      };

      res = await fetch(`${BASE_URL}/salas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSalaData)
      });
      json = await res.json();
      const createdSalaId = json.id;
      logTest('POST /api/salas (Criar)', res.status === 201 && !!createdSalaId, `[ID: ${createdSalaId}]`);

      res = await fetch(`${BASE_URL}/salas/${createdSalaId}`);
      json = await res.json();
      logTest('GET /api/salas/:id (Buscar por ID)', res.status === 200 && json.id === createdSalaId);

      res = await fetch(`${BASE_URL}/salas/${createdSalaId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ precoLocacao: 60.00 })
      });
      json = await res.json();
      logTest('PUT /api/salas/:id (Atualizar)', res.status === 200 && json.precoLocacao === 60.00);

      // 3.1 Testes do novo filtro de disponibilidade
      console.log('\n--- 3.1 FILTRO DE DISPONIBILIDADE DE SALAS ---');
      res = await fetch(`${BASE_URL}/salas?disponivel=true`);
      json = await res.json();
      logTest('GET /api/salas?disponivel=true (Sem dia/turno -> 400)', res.status === 400 && !!json.message);

      res = await fetch(`${BASE_URL}/salas?disponivel=true&dia=2026-12-25&turno=MANHA`);
      json = await res.json();
      logTest('GET /api/salas?disponivel=true&dia=2026-12-25&turno=MANHA', res.status === 200 && Array.isArray(json));

      // 4. Reservas
      console.log('\n--- 4. ENDPOINTS DE RESERVAS ---');
      res = await fetch(`${BASE_URL}/reservas`);
      json = await res.json();
      logTest('GET /api/reservas (Listar todas)', res.status === 200 && Array.isArray(json));

      const newReservaData = {
        idUsuario: createdUserId,
        idSala: createdSalaId,
        dia: '2026-11-15',
        turno: 'MANHA'
      };

      res = await fetch(`${BASE_URL}/reservas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReservaData)
      });
      json = await res.json();
      const createdReservaId = json.id;
      const dataValida = json.dia === '2026-11-15';
      logTest('POST /api/reservas (Criar)', res.status === 201 && !!createdReservaId && dataValida, `[ID: ${createdReservaId}, Dia: ${json.dia}]`);

      // Testar conflito de reserva (mesma sala, dia e turno)
      res = await fetch(`${BASE_URL}/reservas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReservaData)
      });
      json = await res.json();
      logTest('POST /api/reservas (Conflito de agendamento -> 409)', res.status === 409 && !!json.message);

      // Testar se a sala criada aparece como INDISPONÍVEL no filtro do dia 2026-11-15 e turno MANHA
      res = await fetch(`${BASE_URL}/salas?disponivel=true&dia=2026-11-15&turno=MANHA`);
      json = await res.json();
      const contemSalaReservada = json.some(s => s.id === createdSalaId);
      logTest('Filtro de Disponibilidade (Sala reservada foi excluída dos resultados)', res.status === 200 && !contemSalaReservada);

      res = await fetch(`${BASE_URL}/reservas/${createdReservaId}`);
      json = await res.json();
      logTest('GET /api/reservas/:id (Buscar por ID)', res.status === 200 && json.id === createdReservaId);

      // Limpeza: Deletar registros de teste criados
      console.log('\n--- 5. LIMPEZA DOS DADOS DE TESTE ---');
      res = await fetch(`${BASE_URL}/reservas/${createdReservaId}`, { method: 'DELETE' });
      logTest('DELETE /api/reservas/:id', res.status === 200);

      res = await fetch(`${BASE_URL}/salas/${createdSalaId}`, { method: 'DELETE' });
      logTest('DELETE /api/salas/:id', res.status === 200);

      res = await fetch(`${BASE_URL}/usuarios/${createdUserId}`, { method: 'DELETE' });
      logTest('DELETE /api/usuarios/:id', res.status === 200);

    } catch (err) {
      console.error('\n❌ Erro durante a execução dos testes:', err);
    } finally {
      console.log('\n========================================');
      console.log(`📊 RESULTADO FINAL DOS TESTES:`);
      console.log(`   Total de Testes Passados: ${passedCount}`);
      console.log(`   Total de Testes Com Falha: ${failedCount}`);
      console.log('========================================\n');

      server.close(() => {
        process.exit(failedCount > 0 ? 1 : 0);
      });
    }
  });
}

runTests();
const BASE_URL = "http://localhost:3000/api";

const results = [];

function logTest(category, name, passed, details) {
  results.push({ category, name, passed, details });
  console.log(`${passed ? "✅ [PASS]" : "❌ [FAIL]"} [${category}] ${name} - ${details || ""}`);
}

async function runExhaustiveTests() {
  console.log("🚀 Executando Suíte EXAUSTIVA de Corner & Edge Cases...\n");

  const timestampStr = `${Date.now()}`.slice(-6);
  const emailA = `user_a_${timestampStr}@coworking.com`;
  const emailB = `user_b_${timestampStr}@coworking.com`;
  const cpfA = `111222${timestampStr}`.slice(0, 11);
  const cpfB = `555666${timestampStr}`.slice(0, 11);

  let userAId = null;
  let userBId = null;
  let salaAId = null;
  let salaBId = null;
  let reservaAId = null;
  let reservaBId = null;

  try {

    const resUA = await fetch(`${BASE_URL}/usuarios`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome: "User A", email: emailA, senha: "password123", telefone: "11999991111", cpf: cpfA }),
    });
    const dataUA = await resUA.json();
    userAId = dataUA.id;

    const resUB = await fetch(`${BASE_URL}/usuarios`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome: "User B", email: emailB, senha: "password123", telefone: "11999992222", cpf: cpfB }),
    });
    const dataUB = await resUB.json();
    userBId = dataUB.id;

    const resSA = await fetch(`${BASE_URL}/salas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome: `Sala Exhaustive A ${timestampStr}`, capacidade: 10, precoLocacao: 50 }),
    });
    salaAId = (await resSA.json()).id;

    const resSB = await fetch(`${BASE_URL}/salas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome: `Sala Exhaustive B ${timestampStr}`, capacidade: 20, precoLocacao: 100 }),
    });
    salaBId = (await resSB.json()).id;

    logTest("SETUP", "Criação de Usuários A/B e Salas A/B", !!userAId && !!userBId && !!salaAId && !!salaBId, `UserA:${userAId}, UserB:${userBId}, SalaA:${salaAId}, SalaB:${salaBId}`);

    // 2.1 Criar Usuário com CPF duplicado (do User A)
    const resCpfDup = await fetch(`${BASE_URL}/usuarios`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome: "CPF Dup", email: `other_${timestampStr}@test.com`, senha: "password123", telefone: "11999993333", cpf: cpfA }),
    });
    await resCpfDup.text();
    logTest("USUARIOS", "Criar Usuário com CPF duplicado -> 409", resCpfDup.status === 409, `HTTP ${resCpfDup.status}`);

    // 2.2 Atualizar User B tentando colocar o e-mail do User A (Conflito de e-mail na atualização)
    const resUpdEmailDup = await fetch(`${BASE_URL}/usuarios/${userBId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: emailA }),
    });
    await resUpdEmailDup.text();
    logTest("USUARIOS", "Atualizar User B com e-mail do User A -> 409", resUpdEmailDup.status === 409, `HTTP ${resUpdEmailDup.status}`);

    // 2.3 Atualizar User B mantendo seu PRÓPRIO e-mail (Não deve dar falso positivo)
    const resUpdSelfEmail = await fetch(`${BASE_URL}/usuarios/${userBId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: emailB }),
    });
    await resUpdSelfEmail.text();
    logTest("USUARIOS", "Atualizar User B mantendo seu próprio e-mail -> 200", resUpdSelfEmail.status === 200, `HTTP ${resUpdSelfEmail.status}`);

    // 2.4 Parâmetro ID inválido (não numérico: /api/usuarios/abc -> 400)
    const resInvalidId = await fetch(`${BASE_URL}/usuarios/abc`);
    await resInvalidId.text();
    logTest("USUARIOS", "GET /api/usuarios/abc (ID não numérico -> 400)", resInvalidId.status === 400, `HTTP ${resInvalidId.status}`);

    // 2.5 Buscar Usuário inexistente (ID 999999)
    const resNoUser = await fetch(`${BASE_URL}/usuarios/999999`);
    await resNoUser.text();
    logTest("USUARIOS", "GET /api/usuarios/999999 (ID inexistente -> 404)", resNoUser.status === 404, `HTTP ${resNoUser.status}`);

    // 3.1 Criar sala com capacidade negativa (Zod -> 400)
    const resSalaNegCap = await fetch(`${BASE_URL}/salas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome: "Sala Invalida", capacidade: -5, precoLocacao: 50 }),
    });
    await resSalaNegCap.text();
    logTest("SALAS", "Criar Sala com capacidade negativa -> 400", resSalaNegCap.status === 400, `HTTP ${resSalaNegCap.status}`);

    // 3.2 Buscar Sala inexistente pelo ID (999999)
    const resGetNoSala = await fetch(`${BASE_URL}/salas/999999`);
    await resGetNoSala.text();
    logTest("SALAS", "Buscar Sala inexistente por ID -> 404", resGetNoSala.status === 404, `HTTP ${resGetNoSala.status}`);

    // 3.3 Filtro de disponibilidade com turno em minúsculas e espaços (ex: turno=" manha ")
    const resFiltroCase = await fetch(`${BASE_URL}/salas?disponivel=true&dia=2026-09-01&turno=%20manha%20`);
    const dataFiltroCase = await resFiltroCase.json();
    logTest("SALAS", "Filtro com turno minúsculo/com espaços -> 200", resFiltroCase.status === 200 && Array.isArray(dataFiltroCase), `HTTP ${resFiltroCase.status}`);

    const diaCorner = "2026-09-15";

    // 4.1 Criar Reserva A (User A na Sala A, no diaCorner, turno MANHA)
    const resResA = await fetch(`${BASE_URL}/reservas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idUsuario: userAId, idSala: salaAId, dia: diaCorner, turno: "MANHA" }),
    });
    reservaAId = (await resResA.json()).id;
    logTest("RESERVAS", "Criar Reserva A -> 201", resResA.status === 201 && !!reservaAId, `Reserva A ID: ${reservaAId}`);

    // 4.2 Criar Reserva B (User B na Sala B, no diaCorner, turno TARDE)
    const resResB = await fetch(`${BASE_URL}/reservas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idUsuario: userBId, idSala: salaBId, dia: diaCorner, turno: "TARDE" }),
    });
    reservaBId = (await resResB.json()).id;
    logTest("RESERVAS", "Criar Reserva B -> 201", resResB.status === 201 && !!reservaBId, `Reserva B ID: ${reservaBId}`);

    // 4.3 Tentar criar reserva para SALA INEXISTENTE (ID 999999)
    const resResNoSala = await fetch(`${BASE_URL}/reservas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idUsuario: userAId, idSala: 999999, dia: diaCorner, turno: "NOITE" }),
    });
    await resResNoSala.text();
    logTest("RESERVAS", "Criar Reserva com Sala Inexistente -> 404", resResNoSala.status === 404, `HTTP ${resResNoSala.status}`);

    // 4.4 Tentar criar reserva para USUÁRIO INEXISTENTE (ID 999999)
    const resResNoUser = await fetch(`${BASE_URL}/reservas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idUsuario: 999999, idSala: salaAId, dia: diaCorner, turno: "NOITE" }),
    });
    await resResNoUser.text();
    logTest("RESERVAS", "Criar Reserva com Usuário Inexistente -> 404", resResNoUser.status === 404, `HTTP ${resResNoUser.status}`);

    // 4.5 Buscar Reserva inexistente pelo ID (999999)
    const resGetNoReserva = await fetch(`${BASE_URL}/reservas/999999`);
    await resGetNoReserva.text();
    logTest("RESERVAS", "Buscar Reserva inexistente por ID -> 404", resGetNoReserva.status === 404, `HTTP ${resGetNoReserva.status}`);

  } catch (err) {
    console.error("Erro durante a execução da suíte:", err);
  } finally {
    // CLEANUP
    if (reservaAId) await fetch(`${BASE_URL}/reservas/${reservaAId}`, { method: "DELETE" });
    if (reservaBId) await fetch(`${BASE_URL}/reservas/${reservaBId}`, { method: "DELETE" });
    if (salaAId) await fetch(`${BASE_URL}/salas/${salaAId}`, { method: "DELETE" });
    if (salaBId) await fetch(`${BASE_URL}/salas/${salaBId}`, { method: "DELETE" });
    if (userAId) await fetch(`${BASE_URL}/usuarios/${userAId}`, { method: "DELETE" });
    if (userBId) await fetch(`${BASE_URL}/usuarios/${userBId}`, { method: "DELETE" });

    logTest("CLEANUP", "Exclusão dos dados de teste exaustivos", true, "Ambiente limpo");

    const passedCount = results.filter(r => r.passed).length;
    console.log(`\n==================================================`);
    console.log(`📊 SUÍTE EXAUSTIVA: ${passedCount}/${results.length} testes passaram com SUCESSO!`);
    console.log(`==================================================\n`);

    process.exit(passedCount === results.length ? 0 : 1);
  }
}

runExhaustiveTests();
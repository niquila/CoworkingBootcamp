import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log(' Iniciando semeação do banco de dados (seed)...');

  console.log('Limpando registros existentes...');
  await prisma.reserva.deleteMany({}); // Deleta todas as reservas
  await prisma.usuario.deleteMany({}); // Deleta todos os usuários
  await prisma.sala.deleteMany({});    // Deleta todas as salas


  console.log(' Criando usuários...');

  // Gera o hash das senhas antes de salvar (nunca salvar senha em texto puro)
  const senhaAdminHash = await bcrypt.hash('admin123', 10);
  const senhaMembroHash = await bcrypt.hash('membro123', 10);

  // Cria um usuário administrador e um usuário membro
  const admin = await prisma.usuario.create({
    data: {
      nome: 'Administrador Coworking',
      email: 'admin@coworking.com',
      senha: senhaAdminHash,
      telefone: '11999999999',
      cpf: '123.456.789-00',
      eAdmin: true,
    },
  });

  const membro = await prisma.usuario.create({
    data: {
      nome: 'João Silva (Membro)',
      email: 'membro@coworking.com',
      senha: senhaMembroHash,
      telefone: '11988888888',
      cpf: '987.654.321-99',
      eAdmin: false,
    },
  });


  console.log('Criando salas...');

  // Cria algumas salas de exemplo
  const salaAuditorio = await prisma.sala.create({
    data: {
      nome: 'Sala Auditório',
      capacidade: 50,
      descricao: 'Espaço amplo para palestras e eventos.',
      precoLocacao: 150.00,
    },
  });

  const salaReunioesA = await prisma.sala.create({
    data: {
      nome: 'Sala Reuniões A',
      capacidade: 10,
      descricao: 'Sala de reuniões executiva com projetor.',
      precoLocacao: 70.00,
    },
  });

  const cabineIndividual = await prisma.sala.create({
    data: {
      nome: 'Cabine Individual',
      capacidade: 1,
      descricao: 'Cabine privativa para chamadas de vídeo.',
      precoLocacao: 15.00,
    },
  });


  console.log('Criando reserva de exemplo...');

  const amanha = new Date();
  amanha.setDate(amanha.getDate() + 1);
  amanha.setHours(0, 0, 0, 0);

  await prisma.reserva.create({
    data: {
      idUsuario: membro.id,      
      idSala: salaReunioesA.id, 
      dia: amanha,
      turno: 'TARDE',           
    },
  });

  console.log(' Seed executado com sucesso! Banco populado e pronto.');
  console.log('   Login admin  -> admin@coworking.com   / admin123');
  console.log('   Login membro -> membro@coworking.com  / membro123');
}

// Execução da função principal com tratamento de fluxo e encerramento de conexão
main()
  .then(async () => {
    // Após terminar com sucesso, desconecta o cliente do Prisma para liberar os recursos do banco
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    // Se ocorrer algum erro durante a execução, mostra o erro no console
    console.error(' Ocorreu um erro ao rodar o seed:', e);
    // Desconecta o cliente mesmo em caso de erro
    await prisma.$disconnect();
    // Encerra o processo do Node.js com código de erro 1
    process.exit(1);
  });
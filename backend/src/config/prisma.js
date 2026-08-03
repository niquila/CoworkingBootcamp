import { PrismaClient } from '@prisma/client';

// Configura o Prisma Client para logar queries, informações, avisos e erros no ambiente de desenvolvimento

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
});

export default prisma;
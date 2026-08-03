import 'dotenv/config'; // Carrega as variáveis de ambiente do arquivo .env (ex: DATABASE_URL, PORT) na memória
import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { ZodError } from 'zod';
import routes from './routes/index.js';
import { swaggerDocument } from './config/swagger.js';

// Inicializa a aplicação Express, ponto de entrada do servidor.
const app = express();

// Define a porta do servidor: usa a porta configurada no .env ou assume 3000 como valor padrão
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Configuração do Swagger UI para documentação da API
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api', routes);

// Middleware global de tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro detectado na aplicação:', err);

  // Tratamento especial para erros de validação do Zod
  if (err instanceof ZodError || err?.name === 'ZodError') {
    const issues = err.issues || err.errors || [];
    const mensagemFormata = issues.length > 0 ? issues.map(e => e.message).join(' ') : err.message;
    return res.status(400).json({
      message: mensagemFormata || 'Dados inválidos na requisição.'
    });
  }

  // Formato padrão de resposta de erro. Retorna o status de erro específico do objeto ou 500 (Erro Interno).
  return res.status(err.status || 500).json({
    message: err.message || 'Erro interno no servidor.'
  });
});

app.use((req, res) => {
  return res.status(404).json({
    message: `Rota ${req.originalUrl} não encontrada.`
  });
});

// Inicialização do servidor HTTP na porta especificada
app.listen(PORT, () => {
  console.log(` Servidor rodando com sucesso em http://localhost:${PORT}`);
  console.log(` Documentação Swagger disponível em: http://localhost:${PORT}/docs`);
  console.log(` Health check disponível em: http://localhost:${PORT}/api/health`);
});
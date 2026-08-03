// Configuração do Swagger para documentação da API

export const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "API de Gestão e Reserva de Coworking",
    version: "1.0.0",
    description:
      "Documentação interativa da API do Sistema de Gestão de Coworking. Permite testar endpoints de usuários, salas, reservas e autenticação diretamente pelo navegador.",
    contact: {
      name: "Equipe de Desenvolvimento",
    },
  },
  servers: [
    {
      url: "http://localhost:3000/api",
      description: "Servidor Local de Desenvolvimento",
    },
  ],
  tags: [
    { name: "Health", description: "Verificação de saúde do sistema" },
    { name: "Autenticação", description: "Endpoints de login e credenciais" },
    { name: "Usuários", description: "Gestão completa de usuários (CRUD)" },
    { name: "Salas", description: "Gestão e consulta de disponibilidade de salas" },
    { name: "Reservas", description: "Agendamento e cancelamento de reservas" },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Cole aqui o token JWT recebido no login (POST /auth/login).",
      },
    },
  },
  paths: {
    "/health": {
      get: {
        tags: ["Health"],
        summary: "Verifica a saúde da API",
        description: "Retorna o status da aplicação, tempo online (uptime) e horário do servidor.",
        responses: {
          200: {
            description: "Servidor rodando e saudável",
            content: {
              "application/json": {
                example: {
                  status: "OK",
                  uptime: 120.45,
                  timestamp: "2026-07-24T02:00:00.000Z",
                },
              },
            },
          },
        },
      },
    },
    "/auth/login": {
      post: {
        tags: ["Autenticação"],
        summary: "Realiza login do usuário",
        description: "Autentica um usuário cadastrado comparando email e senha, e retorna um token JWT para ser usado nas rotas protegidas.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "senha"],
                properties: {
                  email: { type: "string", example: "admin@coworking.com" },
                  senha: { type: "string", example: "admin123" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Login realizado com sucesso",
            content: {
              "application/json": {
                example: {
                  message: "Login realizado com sucesso.",
                  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                  usuario: {
                    id: 1,
                    nome: "Administrador Coworking",
                    email: "admin@coworking.com",
                    telefone: "11999999999",
                  },
                },
              },
            },
          },
          401: {
            description: "Credenciais inválidas",
            content: {
              "application/json": {
                example: { message: "E-mail ou senha inválidos." },
              },
            },
          },
        },
      },
    },
    "/usuarios": {
      get: {
        tags: ["Usuários"],
        summary: "Lista todos os usuários",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Lista de usuários cadastrados",
            content: {
              "application/json": {
                example: [
                  {
                    id: 1,
                    nome: "João Silva",
                    email: "joao@email.com",
                    telefone: "11988888888",
                    cpf: "123.456.789-00",
                    eAdmin: false,
                  },
                ],
              },
            },
          },
          401: { description: "Token ausente, inválido ou expirado" },
        },
      },
      post: {
        tags: ["Usuários"],
        summary: "Cadastra um novo usuário (rota pública, não exige login)",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["nome", "email", "senha", "telefone", "cpf"],
                properties: {
                  nome: { type: "string", example: "Maria Souza" },
                  email: { type: "string", example: "maria@email.com" },
                  senha: { type: "string", example: "senha123" },
                  telefone: { type: "string", example: "11977777777" },
                  cpf: { type: "string", example: "98765432100" },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Usuário cadastrado com sucesso" },
          409: { description: "E-mail ou CPF já cadastrado" },
        },
      },
    },
    "/usuarios/{id}": {
      get: {
        tags: ["Usuários"],
        summary: "Busca um usuário pelo ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } },
        ],
        responses: {
          200: { description: "Dados do usuário encontrado" },
          401: { description: "Token ausente, inválido ou expirado" },
          404: { description: "Usuário não encontrado" },
        },
      },
      put: {
        tags: ["Usuários"],
        summary: "Atualiza um usuário pelo ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  nome: { type: "string", example: "Maria Souza Atualizado" },
                  telefone: { type: "string", example: "11988887777" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Usuário atualizado com sucesso" },
          401: { description: "Token ausente, inválido ou expirado" },
          404: { description: "Usuário não encontrado" },
          409: { description: "E-mail ou CPF em uso por outro usuário" },
        },
      },
      delete: {
        tags: ["Usuários"],
        summary: "Exclui um usuário pelo ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } },
        ],
        responses: {
          200: { description: "Usuário excluído com sucesso" },
          401: { description: "Token ausente, inválido ou expirado" },
          404: { description: "Usuário não encontrado" },
        },
      },
    },
    "/salas": {
      get: {
        tags: ["Salas"],
        summary: "Lista todas as salas (com suporte a filtro de disponibilidade)",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "disponivel", in: "query", schema: { type: "boolean" }, description: "Filtrar apenas salas disponíveis (ex: true)" },
          { name: "dia", in: "query", schema: { type: "string" }, description: "Data no formato YYYY-MM-DD (obrigatório se disponivel=true)" },
          { name: "turno", in: "query", schema: { type: "string", enum: ["MANHA", "TARDE", "NOITE"] }, description: "Turno desejado (obrigatório se disponivel=true)" },
        ],
        responses: {
          200: { description: "Lista de salas encontradas" },
          400: { description: "Parâmetros 'dia' e 'turno' ausentes ao filtrar por disponibilidade" },
          401: { description: "Token ausente, inválido ou expirado" },
        },
      },
      post: {
        tags: ["Salas"],
        summary: "Cadastra uma nova sala (somente administradores)",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["nome", "capacidade", "precoLocacao"],
                properties: {
                  nome: { type: "string", example: "Sala Reuniões B" },
                  capacidade: { type: "integer", example: 12 },
                  descricao: { type: "string", example: "Sala com TV 55 pol e ar condicionado" },
                  precoLocacao: { type: "number", example: 80.0 },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Sala criada com sucesso" },
          401: { description: "Token ausente, inválido ou expirado" },
          403: { description: "Acesso restrito a administradores" },
        },
      },
    },
    "/salas/{id}": {
      get: {
        tags: ["Salas"],
        summary: "Busca detalhes de uma sala pelo ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } },
        ],
        responses: {
          200: { description: "Dados da sala encontrados" },
          401: { description: "Token ausente, inválido ou expirado" },
          404: { description: "Sala não encontrada" },
        },
      },
      put: {
        tags: ["Salas"],
        summary: "Atualiza uma sala pelo ID (somente administradores)",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } },
        ],
        responses: {
          200: { description: "Sala atualizada com sucesso" },
          401: { description: "Token ausente, inválido ou expirado" },
          403: { description: "Acesso restrito a administradores" },
          404: { description: "Sala não encontrada" },
        },
      },
      delete: {
        tags: ["Salas"],
        summary: "Exclui uma sala pelo ID (somente administradores)",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } },
        ],
        responses: {
          200: { description: "Sala excluída com sucesso" },
          401: { description: "Token ausente, inválido ou expirado" },
          403: { description: "Acesso restrito a administradores" },
          404: { description: "Sala não encontrada" },
        },
      },
    },
    "/reservas": {
      get: {
        tags: ["Reservas"],
        summary: "Lista todas as reservas",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "Lista de reservas com relacionamentos (usuário e sala)" },
          401: { description: "Token ausente, inválido ou expirado" },
        },
      },
      post: {
        tags: ["Reservas"],
        summary: "Cadastra uma nova reserva de sala",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["idUsuario", "idSala", "dia", "turno"],
                properties: {
                  idUsuario: { type: "integer", example: 5 },
                  idSala: { type: "integer", example: 4 },
                  dia: { type: "string", example: "2026-08-15" },
                  turno: { type: "string", enum: ["MANHA", "TARDE", "NOITE"], example: "MANHA" },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Reserva criada com sucesso" },
          401: { description: "Token ausente, inválido ou expirado" },
          404: { description: "Usuário ou Sala informada não foi encontrada" },
          409: { description: "Esta sala já possui uma reserva para o dia e turno informados" },
        },
      },
    },
    "/reservas/{id}": {
      get: {
        tags: ["Reservas"],
        summary: "Busca detalhes de uma reserva pelo ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } },
        ],
        responses: {
          200: { description: "Dados da reserva" },
          401: { description: "Token ausente, inválido ou expirado" },
          404: { description: "Reserva não encontrada" },
        },
      },
      delete: {
        tags: ["Reservas"],
        summary: "Cancela/Exclui uma reserva pelo ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } },
        ],
        responses: {
          200: { description: "Reserva excluída com sucesso" },
          401: { description: "Token ausente, inválido ou expirado" },
          404: { description: "Reserva não encontrada" },
        },
      },
    },
  },
};
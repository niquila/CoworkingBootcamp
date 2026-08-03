import { Router } from "express";
import usuariosRoute from "./usuariosRoute.js";
import salasRoute from "./salasRoute.js";
import reservasRoute from "./reservasRoute.js";
import authRoute from "./authRoute.js";

// Rota de saúde (health check) para verificar se o servidor está funcionando corretamente.
const router = Router();

router.get("/health", (req, res) => {
  return res.json({
    status: "OK",
    uptime: process.uptime(), // Retorna há quantos segundos o servidor Node.js está rodando
    timestamp: new Date().toISOString(), // Data e hora atual no formato ISO
  });
});

// Rota raiz da API, fornecendo informações básicas sobre a aplicação.
router.get("/", (req, res) => {
  return res.json({
    message: "Bem-vindo à API do Sistema de Gestão e Reserva de Coworking!",
    version: "1.0.0",
  });
});

router.use("/auth", authRoute);
router.use("/usuarios", usuariosRoute);
router.use("/salas", salasRoute);
router.use("/reservas", reservasRoute);

export default router;
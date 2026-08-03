/**
 * @param {string} dia - Data enviada pelo cliente no formato "YYYY-MM-DD"
 * @returns {Date} Objeto Date configurado para a meia-noite no fuso local
 */

// Função para normalizar a data recebida do cliente, garantindo que seja interpretada corretamente como meia-noite no fuso local
export function normalizarData(dia) {
  return new Date(`${dia}T00:00:00`);
}

/**
 * @param {Object} reserva - Objeto de reserva retornado do banco
 * @returns {Object} Objeto de reserva com o campo `dia` formatado
 */

// Função para formatar a data de uma reserva para o formato "YYYY-MM-DD"
export function formatarReserva(reserva) {
  const diaStr = reserva.dia.toISOString().split("T")[0];
  return { ...reserva, dia: diaStr };
}
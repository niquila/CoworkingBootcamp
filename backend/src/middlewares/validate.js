/**
 * @param {import("zod").ZodSchema} schema - O schema do Zod com as regras dos campos esperados
 * @returns {import("express").RequestHandler} Função de middleware pronta para uso no Express
 */
export function validate(schema) {
  return (req, res, next) => {
    try {
      req.body = schema.parse(req.body || {});
      next();
    } catch (error) {
      if (!error.status) error.status = 400;
      next(error);
    }
  };
}
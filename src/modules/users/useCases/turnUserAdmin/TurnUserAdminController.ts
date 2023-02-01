import { Request, Response } from "express";
import { container } from "tsyringe";
import { z } from "zod";

import { ValidationSchemaError } from "../../../../shared/errors/valitation-schema.error";
import { validatorSchema } from "../../../../shared/validator/zod";
import { TurnUserAdminUseCase } from "./TurnUserAdminUseCase";

class TurnUserAdminController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { body } = request;

    const adminSchema = z.object({
      id: z.string().uuid(),
    });

    try {
      validatorSchema(adminSchema, body);

      const turnUserAdminUseCase = container.resolve(TurnUserAdminUseCase);

      const userAdmin = await turnUserAdminUseCase.execute(body.id);

      return response.status(200).json(userAdmin);
    } catch (err: any) {
      if (err instanceof ValidationSchemaError) {
        return response.status(err.statusCode).json(err.errors);
      }
      return response.status(err.statusCode).json(err.message);
    }
  }
}

export { TurnUserAdminController };

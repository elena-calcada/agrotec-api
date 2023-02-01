import { Request, Response } from "express";
import { container } from "tsyringe";
import { z } from "zod";

import { ValidationSchemaError } from "../../../../shared/errors/valitation-schema.error";
import { validatorSchema } from "../../../../shared/validator/zod";
import { TurnUserExecutorUseCase } from "./TurnUserExecutorUseCase";

class TurnUserExecutorController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.body;

    const executorSchema = z.object({
      id: z.string().uuid(),
    });

    try {
      validatorSchema(executorSchema, { id });

      const turnUserExecutorUseCase = container.resolve(
        TurnUserExecutorUseCase
      );

      const userExecutor = await turnUserExecutorUseCase.execute(id);

      return response.status(200).json(userExecutor);
    } catch (err: any) {
      if (err instanceof ValidationSchemaError) {
        return response.status(err.statusCode).json(err.errors);
      }
      return response.status(err.statusCode).json(err.message);
    }
  }
}

export { TurnUserExecutorController };

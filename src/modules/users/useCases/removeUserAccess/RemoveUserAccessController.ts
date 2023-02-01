import { Request, Response } from "express";
import { container } from "tsyringe";
import { z } from "zod";

import { ValidationSchemaError } from "../../../../shared/errors/valitation-schema.error";
import { validatorSchema } from "../../../../shared/validator/zod";
import { RemoveUserAccessUseCase } from "./RemoveUserAccessUseCase";

class RemoveUserAccessController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.body;

    const noAccessSchema = z.object({
      id: z.string().uuid(),
    });

    try {
      validatorSchema(noAccessSchema, { id });

      const removeUserAccessUseCase = container.resolve(
        RemoveUserAccessUseCase
      );

      const user = await removeUserAccessUseCase.execute(id);

      return response.status(200).json(user);
    } catch (err: any) {
      if (err instanceof ValidationSchemaError) {
        return response.status(err.statusCode).json(err.errors);
      }
      return response.status(err.statusCode).json(err.message);
    }
  }
}

export { RemoveUserAccessController };

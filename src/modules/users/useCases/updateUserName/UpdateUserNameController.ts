import { Request, Response } from "express";
import { container } from "tsyringe";
import { z } from "zod";

import { ValidationSchemaError } from "../../../../shared/errors/valitation-schema.error";
import { validatorSchema } from "../../../../shared/validator/zod";
import { UpdateUserNameUseCase } from "./UpdateUserNameUseCase";

class UpdateUserNameController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const { name } = request.body;

    const nameSchema = z.object({
      name: z.string(),
    });

    try {
      validatorSchema(nameSchema, { name });

      const updateUserNameUseCase = container.resolve(UpdateUserNameUseCase);

      const user = await updateUserNameUseCase.execute({
        id,
        name,
      });

      return response.json(user);
    } catch (err: any) {
      if (err instanceof ValidationSchemaError) {
        return response.status(err.statusCode).json(err.errors);
      }
      return response.status(err.statusCode).json(err.message);
    }
  }
}

export { UpdateUserNameController };

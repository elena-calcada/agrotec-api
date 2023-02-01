import { Request, Response } from "express";
import { container } from "tsyringe";
import { z } from "zod";

import { ValidationSchemaError } from "../../../../shared/errors/valitation-schema.error";
import { validatorSchema } from "../../../../shared/validator/zod";
import { DeleteUserUseCase } from "./DeleteUserUseCase";

class DeleteUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.query;

    const deleteSchema = z.object({
      id: z.string().uuid({
        message: "Invalid id",
      }),
    });

    try {
      validatorSchema(deleteSchema, { id });

      const deleteUserUseCase = container.resolve(DeleteUserUseCase);

      await deleteUserUseCase.execute(id as string);

      return response.status(200).send();
    } catch (err: any) {
      if (err instanceof ValidationSchemaError) {
        return response.status(err.statusCode).json(err.errors);
      }
      return response.status(err.statusCode).json(err.message);
    }
  }
}

export { DeleteUserController };

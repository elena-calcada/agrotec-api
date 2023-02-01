import { Request, Response } from "express";
import { container } from "tsyringe";
import { z } from "zod";

import { ValidationSchemaError } from "../../../../shared/errors/valitation-schema.error";
import { validatorSchema } from "../../../../shared/validator/zod";
import { ListUserByIdUseCase } from "./ListUserByIdUseCase";

class ListUserByIdController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.query;

    const listUserByIdSchema = z.object({
      id: z.string().uuid({
        message: "Invalid id",
      }),
    });

    try {
      validatorSchema(listUserByIdSchema, { id });

      const listUserByIdUseCase = container.resolve(ListUserByIdUseCase);

      const user = await listUserByIdUseCase.execute(id as string);

      return response.json(user);
    } catch (err: any) {
      if (err instanceof ValidationSchemaError) {
        return response.status(err.statusCode).json(err.errors);
      }
      return response.status(err.statusCode).json(err.message);
    }
  }
}

export { ListUserByIdController };

import { Request, Response } from "express";
import { container } from "tsyringe";
import { z } from "zod";

import { ValidationSchemaError } from "../../../../shared/errors/valitation-schema.error";
import { validatorSchema } from "../../../../shared/validator/zod";
import { CreateCategoryGroupUseCase } from "./CreateCategoryGroupUseCase";

class CreateCategoryGroupContrller {
  async handle(request: Request, response: Response): Promise<Response> {
    const { body } = request;

    const groupSchema = z.object({
      name: z.string(),
      description: z.string().max(200),
    });

    try {
      validatorSchema(groupSchema, body);

      const createCategoryGroupUseCase = container.resolve(
        CreateCategoryGroupUseCase
      );

      const group = await createCategoryGroupUseCase.execute(body);

      return response.status(201).json(group);
    } catch (err: any) {
      if (err instanceof ValidationSchemaError) {
        return response.status(err.statusCode).json(err.errors);
      }
      return response.status(err.statusCode).json(err.message);
    }
  }
}

export { CreateCategoryGroupContrller };

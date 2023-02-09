import { Request, Response } from "express";
import { container } from "tsyringe";
import { z } from "zod";

import { ValidationSchemaError } from "../../../../shared/errors/valitation-schema.error";
import { validatorSchema } from "../../../../shared/validator/zod";
import { CreateCategorysUseCase } from "./CreateCategoryUseCase";

class CreateCategoryController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { body } = request;

    const categorySchema = z.object({
      name: z.string(),
      description: z.string().max(200),
      group_id: z.string().uuid(),
    });

    try {
      validatorSchema(categorySchema, body);

      const createCategoryUseCase = container.resolve(CreateCategorysUseCase);

      const category = await createCategoryUseCase.execute(body);

      return response.status(201).json(category);
    } catch (err: any) {
      if (err instanceof ValidationSchemaError) {
        return response.status(err.statusCode).json(err.errors);
      }
      return response.status(err.statusCode).json(err.message);
    }
  }
}

export { CreateCategoryController };

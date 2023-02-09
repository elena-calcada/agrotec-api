import { Request, Response } from "express";
import { container } from "tsyringe";
import { z } from "zod";

import { ValidationSchemaError } from "../../../../shared/errors/valitation-schema.error";
import { validatorSchema } from "../../../../shared/validator/zod";
import { UpdateCategoryUseCase } from "./updateCategoryUseCase";

class UpdateCategoryController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { body } = request;

    const updateSchema = z.object({
      name: z.string(),
      description: z.string().max(200),
      group_id: z.string().uuid(),
    });

    try {
      validatorSchema(updateSchema, body);

      const updateCategoryUseCase = container.resolve(UpdateCategoryUseCase);

      const category = await updateCategoryUseCase.execute(body);

      return response.status(200).json(category);
    } catch (err: any) {
      if (err instanceof ValidationSchemaError) {
        return response.status(err.statusCode).json(err.errors);
      }
      return response.status(err.statusCode).json(err.message);
    }
  }
}

export { UpdateCategoryController };

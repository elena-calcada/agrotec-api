import { Request, Response } from "express";
import { container } from "tsyringe";
import { z } from "zod";

import { ValidationSchemaError } from "../../../../shared/errors/valitation-schema.error";
import { validatorSchema } from "../../../../shared/validator/zod";
import { UpdateCategoryGroupUseCase } from "./UpdateCategoryGroupUseCase";

class UpdateCategoryGroupController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { body } = request;

    const updateSchema = z.object({
      id: z.string().uuid({
        message: "Invalid uuid",
      }),
      name: z.string(),
      description: z.string().max(200),
    });

    try {
      validatorSchema(updateSchema, body);

      const updateCategoryGroupUseCase = container.resolve(
        UpdateCategoryGroupUseCase
      );

      const group = await updateCategoryGroupUseCase.execute(body);

      return response.status(200).json(group);
    } catch (err: any) {
      if (err instanceof ValidationSchemaError) {
        return response.status(err.statusCode).json(err.errors);
      }
      return response.status(err.statusCode).json(err.message);
    }
  }
}

export { UpdateCategoryGroupController };

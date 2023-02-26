import { Request, Response } from "express";
import { container } from "tsyringe";
import { z } from "zod";

import { ValidationSchemaError } from "../../../../shared/errors/valitation-schema.error";
import { validatorSchema } from "../../../../shared/validator/zod";
import { DetailCategoryUseCase } from "./DetailCategoryUseCase";

class DetailCategoryController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const detailSchema = z.object({
      id: z.string().uuid({
        message: "Invalid id",
      }),
    });

    try {
      validatorSchema(detailSchema, { id });

      const detailCategoryUseCase = container.resolve(DetailCategoryUseCase);

      const category = await detailCategoryUseCase.execute(id);

      return response.json(category);
    } catch (err: any) {
      if (err instanceof ValidationSchemaError) {
        return response.status(err.statusCode).json(err.errors);
      }
      return response.status(err.statusCode).json(err.message);
    }
  }
}

export { DetailCategoryController };

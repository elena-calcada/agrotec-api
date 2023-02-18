import { Request, Response } from "express";
import { container } from "tsyringe";
import { z } from "zod";

import { ValidationSchemaError } from "../../../../shared/errors/valitation-schema.error";
import { validatorSchema } from "../../../../shared/validator/zod";
import { DetailGroupCategoryUseCase } from "./DetailGroupCategoryUseCase";

class DetailCategoryGroupController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const detailSchema = z.object({
      id: z.string().uuid({
        message: "Invalid id",
      }),
    });

    try {
      validatorSchema(detailSchema, { id });

      const detailCategoryGroupUseCase = container.resolve(
        DetailGroupCategoryUseCase
      );

      const group = await detailCategoryGroupUseCase.execute(id as string);

      return response.json(group);
    } catch (err: any) {
      if (err instanceof ValidationSchemaError) {
        return response.status(err.statusCode).json(err.errors);
      }
      return response.status(err.statusCode).json(err.message);
    }
  }
}

export { DetailCategoryGroupController };

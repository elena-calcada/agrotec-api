import { Request, Response } from "express";
import { container } from "tsyringe";
import { z } from "zod";

import { ValidationSchemaError } from "../../../../shared/errors/valitation-schema.error";
import { validatorSchema } from "../../../../shared/validator/zod";
import { ListCategoryByGroupUseCase } from "./ListCategoryByGroupUseCase";

class ListCategoryByGroupController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { group_id } = request.query;

    const byGroupSchema = z.object({
      group_id: z.string().uuid({
        message: "Invalid id",
      }),
    });

    try {
      validatorSchema(byGroupSchema, { group_id });

      const listCategoryByGroupUseCase = container.resolve(
        ListCategoryByGroupUseCase
      );

      const categories = await listCategoryByGroupUseCase.execute(
        group_id as string
      );

      return response.json(categories);
    } catch (err: any) {
      if (err instanceof ValidationSchemaError) {
        return response.status(err.statusCode).json(err.errors);
      }
      return response.status(err.statusCode).json(err.message);
    }
  }
}

export { ListCategoryByGroupController };

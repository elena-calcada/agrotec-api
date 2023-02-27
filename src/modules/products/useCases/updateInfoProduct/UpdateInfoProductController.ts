import { Request, Response } from "express";
import { container } from "tsyringe";
import { z } from "zod";

import { ValidationSchemaError } from "../../../../shared/errors/valitation-schema.error";
import { validatorSchema } from "../../../../shared/validator/zod";
import { UpdateInfoProductUseCase } from "./UpdateInfoProductUseCase";

class UpdateInfoProductController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { body } = request;

    const updateInfoSchema = z.object({
      id: z.string().uuid({
        message: "Invalid id",
      }),
      name: z.string(),
      technical_description: z.string().max(200),
      category_id: z.string().uuid({
        message: "Invalid id",
      }),
      supplier_id: z.string().uuid({
        message: "Invalid id",
      }),
    });

    try {
      validatorSchema(updateInfoSchema, body);

      const updateProductUseCase = container.resolve(UpdateInfoProductUseCase);

      const product = await updateProductUseCase.execute(body);

      return response.json(product);
    } catch (err: any) {
      if (err instanceof ValidationSchemaError) {
        return response.status(err.statusCode).json(err.errors);
      }
      return response.status(err.statusCode).json(err.message);
    }
  }
}

export { UpdateInfoProductController };

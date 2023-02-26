import { Request, Response } from "express";
import { container } from "tsyringe";
import { z } from "zod";

import { ValidationSchemaError } from "../../../../shared/errors/valitation-schema.error";
import { validatorSchema } from "../../../../shared/validator/zod";
import { DetailProductUseCase } from "./DetailProductUseCase";

class DetailProductController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const detailSchema = z.object({
      id: z.string().uuid({
        message: "Invalid id",
      }),
    });

    try {
      validatorSchema(detailSchema, { id });

      const detailProductUseCase = container.resolve(DetailProductUseCase);

      const product = await detailProductUseCase.execute(id);

      return response.json(product);
    } catch (err: any) {
      if (err instanceof ValidationSchemaError) {
        return response.status(err.statusCode).json(err.errors);
      }
      return response.status(err.statusCode).json(err.message);
    }
  }
}

export { DetailProductController };

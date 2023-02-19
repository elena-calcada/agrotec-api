import { Request, Response } from "express";
import { container } from "tsyringe";
import { z } from "zod";

import { ValidationSchemaError } from "../../../../shared/errors/valitation-schema.error";
import { validatorSchema } from "../../../../shared/validator/zod";
import { DetailSupplierUseCase } from "./DetailSupplierUseCase";

class DetailSupplierController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const detailSchema = z.object({
      id: z.string().uuid({
        message: "Invalid id",
      }),
    });

    try {
      validatorSchema(detailSchema, { id });

      const detailSupplierUseCase = container.resolve(DetailSupplierUseCase);

      const detail = await detailSupplierUseCase.exceute(id as string);

      return response.status(200).json(detail);
    } catch (err: any) {
      if (err instanceof ValidationSchemaError) {
        return response.status(err.statusCode).json(err.errors);
      }
      return response.status(err.statusCode).json(err.message);
    }
  }
}

export { DetailSupplierController };

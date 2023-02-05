import { Request, Response } from "express";
import { container } from "tsyringe";
import { z } from "zod";

import { ValidationSchemaError } from "../../../../shared/errors/valitation-schema.error";
import { validatorSchema } from "../../../../shared/validator/zod";
import { UpdateSupplierUseCase } from "./UpdateSupplierUseCase";

class UpdateSupplierController {
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

      const updateSupplierUseCase = container.resolve(UpdateSupplierUseCase);

      const supplierUpdated = await updateSupplierUseCase.execute(body);

      return response.status(200).json(supplierUpdated);
    } catch (err: any) {
      if (err instanceof ValidationSchemaError) {
        return response.status(err.statusCode).json(err.errors);
      }
      return response.status(err.statusCode).json(err.message);
    }
  }
}

export { UpdateSupplierController };

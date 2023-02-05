import { Request, Response } from "express";
import { container } from "tsyringe";
import { z } from "zod";

import { ValidationSchemaError } from "../../../../shared/errors/valitation-schema.error";
import { validatorSchema } from "../../../../shared/validator/zod";
import { CreateSupplierUseCase } from "./CreateSupplierUseCase";

class CreateSupplierController {
  async hendle(request: Request, response: Response): Promise<Response> {
    const { body } = request;

    const supplierSchema = z.object({
      name: z.string(),
      description: z.string().max(200),
    });

    try {
      validatorSchema(supplierSchema, body);

      const createSupplierUseCase = container.resolve(CreateSupplierUseCase);

      const supplier = await createSupplierUseCase.execute(body);

      return response.status(201).json(supplier);
    } catch (err: any) {
      if (err instanceof ValidationSchemaError) {
        return response.status(err.statusCode).json(err.errors);
      }
      return response.status(err.statusCode).json(err.message);
    }
  }
}

export { CreateSupplierController };

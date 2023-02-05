import { Request, Response } from "express";
import { container } from "tsyringe";
import { z } from "zod";

import { ValidationSchemaError } from "../../../../shared/errors/valitation-schema.error";
import { validatorSchema } from "../../../../shared/validator/zod";
import { DeleteSupplierUseCase } from "./DeleteSupplierUseCase";

class DeleteSupplierController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const deleteSchema = z.object({
      id: z.string().uuid({
        message: "Invalid id",
      }),
    });

    try {
      validatorSchema(deleteSchema, { id });

      const deleteSupplierUseCase = container.resolve(DeleteSupplierUseCase);

      await deleteSupplierUseCase.execute(id);

      return response.status(200).send();
    } catch (err: any) {
      if (err instanceof ValidationSchemaError) {
        return response.status(err.statusCode).json(err.errors);
      }
      return response.status(err.statusCode).json(err.message);
    }
  }
}

export { DeleteSupplierController };

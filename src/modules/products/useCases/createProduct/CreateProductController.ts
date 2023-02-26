import { Request, Response } from "express";
import { container } from "tsyringe";
import { z } from "zod";

import { AppError } from "../../../../shared/errors/AppError";
import { ValidationSchemaError } from "../../../../shared/errors/valitation-schema.error";
import { validatorSchema } from "../../../../shared/validator/zod";
import { CreateProductUseCase } from "./CreateProductUseCase";

class CreateProductController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { name, technical_description, category_id, supplier_id } =
      request.body;

    const productSchema = z.object({
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
      validatorSchema(productSchema, {
        name,
        technical_description,
        category_id,
        supplier_id,
      });

      const createProductUseCase = container.resolve(CreateProductUseCase);

      if (!request.file) {
        throw new AppError("Error apload file!");
      } else {
        const image = request.file.filename as string;

        const product = await createProductUseCase.execute({
          name,
          technical_description,
          image,
          category_id,
          supplier_id,
        });

        return response.status(201).json(product);
      }
    } catch (err: any) {
      if (err instanceof ValidationSchemaError) {
        return response.status(err.statusCode).json(err.errors);
      }
      return response.status(err.statusCode).json(err.message);
    }
  }
}

export { CreateProductController };

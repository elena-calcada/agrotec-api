import { Request, Response } from "express";
import { container } from "tsyringe";
import { z } from "zod";

import { ValidationSchemaError } from "../../../../shared/errors/valitation-schema.error";
import { validatorSchema } from "../../../../shared/validator/zod";
import { FilterProductsUseCase } from "./FilterProductsUseCase";

class FilterProductsController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { name, group_id, category_id, supplier_id } = request.query;

    const filterSchema = z.object({
      name: z.string().optional(),
      group_id: z
        .string()
        .uuid({
          message: "Invalid id",
        })
        .optional(),
      category_id: z
        .string()
        .uuid({
          message: "Invalid id",
        })
        .optional(),
      supplier_id: z
        .string()
        .uuid({
          message: "Invalid id",
        })
        .optional(),
    });

    try {
      validatorSchema(filterSchema, {
        name,
        group_id,
        category_id,
        supplier_id,
      });

      const filterProductsUseCase = container.resolve(FilterProductsUseCase);

      const products = await filterProductsUseCase.execute({
        name: name ? String(name) : "",
        group_id: group_id ? String(group_id) : "",
        category_id: category_id ? String(category_id) : "",
        supplier_id: supplier_id ? String(supplier_id) : "",
      });

      return response.json(products);
    } catch (err: any) {
      if (err instanceof ValidationSchemaError) {
        return response.status(err.statusCode).json(err.errors);
      }
      return response.status(err.statusCode).json(err.message);
    }
  }
}

export { FilterProductsController };

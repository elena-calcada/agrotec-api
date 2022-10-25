import { Request, Response } from "express";
import { container } from "tsyringe";

import { FilterProductsUseCase } from "./FilterProductsUseCase";

class FilterProductsController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { name, group_id, category_id, supplier_id } = request.query;

    const filterProductsUseCase = container.resolve(FilterProductsUseCase);

    const products = await filterProductsUseCase.execute({
      name: String(name),
      group_id: String(group_id),
      category_id: String(category_id),
      supplier_id: String(supplier_id),
    });

    return response.json(products);
  }
}

export { FilterProductsController };

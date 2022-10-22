import { Request, Response } from "express";
import { container } from "tsyringe";

import { ListAllProductsUseCase } from "./ListAllProductsUseCase";

class ListAllProductsController {
  async handle(request: Request, response: Response): Promise<Response> {
    const listAllProductsUseCase = container.resolve(ListAllProductsUseCase);

    const products = await listAllProductsUseCase.execute();

    return response.json(products);
  }
}

export { ListAllProductsController };

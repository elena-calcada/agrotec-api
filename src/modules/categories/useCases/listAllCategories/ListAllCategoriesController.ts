import { Request, Response } from "express";
import { container } from "tsyringe";

import { ListAllCategoriesUseCase } from "./ListAllCategoriesUseCase";

class ListAllCatgoriesController {
  async handle(request: Request, response: Response): Promise<Response> {
    const listAllCategoriesUseCase = container.resolve(
      ListAllCategoriesUseCase
    );

    const categories = await listAllCategoriesUseCase.execute();

    return response.json(categories);
  }
}

export { ListAllCatgoriesController };

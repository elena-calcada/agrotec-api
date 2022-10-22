import { Request, Response } from "express";
import { container } from "tsyringe";

import { ListCategoryByGroupUseCase } from "./ListCategoryByGroupUseCase";

class ListCategoryByGroupController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { group_id } = request.body;

    const listCategoryByGroupUseCase = container.resolve(
      ListCategoryByGroupUseCase
    );

    const categories = await listCategoryByGroupUseCase.execute(group_id);

    return response.json(categories);
  }
}

export { ListCategoryByGroupController };

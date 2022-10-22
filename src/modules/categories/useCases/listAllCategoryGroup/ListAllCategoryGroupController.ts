import { Request, Response } from "express";
import { container } from "tsyringe";

import { ListAllCategoryGroupUseCase } from "./ListAllCategoryGroupUseCase";

class ListAllCategoryGroupController {
  async handle(request: Request, response: Response): Promise<Response> {
    const listAllCategoryGroupUseCase = container.resolve(
      ListAllCategoryGroupUseCase
    );

    const groups = await listAllCategoryGroupUseCase.execute();

    return response.json(groups);
  }
}

export { ListAllCategoryGroupController };

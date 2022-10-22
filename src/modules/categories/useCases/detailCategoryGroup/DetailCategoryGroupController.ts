import { Request, Response } from "express";
import { container } from "tsyringe";

import { DetailGroupCategoryUseCase } from "./DetailGroupCategoryUseCase";

class DetailCategoryGroupController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.query;

    const detailCategoryGroupUseCase = container.resolve(
      DetailGroupCategoryUseCase
    );

    const group = await detailCategoryGroupUseCase.execute(id as string);

    return response.json(group);
  }
}

export { DetailCategoryGroupController };

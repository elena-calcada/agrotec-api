import { Request, Response } from "express";
import { container } from "tsyringe";

import { DetailCategoryUseCase } from "./DetailCategoryUseCase";

class DetailCategoryController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.query;

    const detailCategoryUseCase = container.resolve(DetailCategoryUseCase);

    const category = await detailCategoryUseCase.execute(id as string);

    return response.json(category);
  }
}

export { DetailCategoryController };

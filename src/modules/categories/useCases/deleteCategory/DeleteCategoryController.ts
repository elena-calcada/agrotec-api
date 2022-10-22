import { Request, Response } from "express";
import { container } from "tsyringe";

import { DeleteCategoryUseCase } from "./DeleteCategoryUseCase";

class DeleteCategoryController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.query;

    const deleteCategoryUseCase = container.resolve(DeleteCategoryUseCase);

    await deleteCategoryUseCase.execute(id as string);

    return response.status(200).send();
  }
}

export { DeleteCategoryController };

import { Request, Response } from "express";
import { container } from "tsyringe";

import { DeleteCategoryGroupUseCase } from "./DeleteCategoryGroupUseCase";

class DeleteCategoryGroupController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const deleteCategoryGroupUseCase = container.resolve(
      DeleteCategoryGroupUseCase
    );

    await deleteCategoryGroupUseCase.execute(id);

    return response.status(200).send();
  }
}

export { DeleteCategoryGroupController };

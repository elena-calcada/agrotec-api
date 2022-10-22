import { Request, Response } from "express";
import { container } from "tsyringe";

import { UpdateCategoryGroupUseCase } from "./UpdateCategoryGroupUseCase";

class UpdateCategoryGroupController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id, description, name } = request.body;

    const updateCategoryGroupUseCase = container.resolve(
      UpdateCategoryGroupUseCase
    );

    await updateCategoryGroupUseCase.execute({ id, description, name });

    return response.status(200).send();
  }
}

export { UpdateCategoryGroupController };

import { Request, Response } from "express";
import { container } from "tsyringe";

import { AppError } from "../../../../shared/errors/AppError";
import { UpdateCategoryUseCase } from "./updateCategoryUseCase";

class UpdateCategoryController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id, name, description, categoryGroup_id } = request.body;

    if (!name || !categoryGroup_id) {
      throw new AppError("Name and group are required");
    }

    const updateCategoryUseCase = container.resolve(UpdateCategoryUseCase);

    await updateCategoryUseCase.execute({
      id,
      name,
      description,
      categoryGroup_id,
    });

    return response.status(200).send();
  }
}

export { UpdateCategoryController };

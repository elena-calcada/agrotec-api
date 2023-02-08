import { Request, Response } from "express";
import { container } from "tsyringe";

import { AppError } from "../../../../shared/errors/AppError";
import { UpdateCategoryUseCase } from "./updateCategoryUseCase";

class UpdateCategoryController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id, name, description, group_id } = request.body;

    if (!name || !group_id) {
      throw new AppError("Name and group are required");
    }

    const updateCategoryUseCase = container.resolve(UpdateCategoryUseCase);

    const category = await updateCategoryUseCase.execute({
      id,
      name,
      description,
      group_id,
    });

    return response.status(200).json(category);
  }
}

export { UpdateCategoryController };

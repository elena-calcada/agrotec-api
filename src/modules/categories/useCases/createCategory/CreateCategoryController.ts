import { Request, Response } from "express";
import { container } from "tsyringe";

import { CreateCategorysUseCase } from "./CreateCategoryUseCase";

class CreateCategoryController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { name, description, group_id } = request.body;

    const createCategoryUseCase = container.resolve(CreateCategorysUseCase);

    const category = await createCategoryUseCase.execute({
      name,
      description,
      group_id,
    });

    return response.status(201).json(category);
  }
}

export { CreateCategoryController };

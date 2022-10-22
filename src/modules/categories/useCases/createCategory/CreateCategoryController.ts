import { Request, Response } from "express";
import { container } from "tsyringe";

import { CreateCategorysUseCase } from "./CreateCategoryUseCase";

class CreateCategoryController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { name, description, categoryGroup_id } = request.body;

    const createCategoryUseCase = container.resolve(CreateCategorysUseCase);

    await createCategoryUseCase.execute({
      name,
      description,
      categoryGroup_id,
    });

    return response.status(201).send();
  }
}

export { CreateCategoryController };

import { Request, Response } from "express";
import { container } from "tsyringe";

import { CreateCategoryGroupUseCase } from "./CreateCategoryGroupUseCase";

class CreateCategoryGroupContrller {
  async handle(request: Request, response: Response): Promise<Response> {
    const { name, description } = request.body;

    const createCategoryGroupUseCase = container.resolve(
      CreateCategoryGroupUseCase
    );

    const group = await createCategoryGroupUseCase.execute({
      name,
      description,
    });

    return response.status(201).json(group);
  }
}

export { CreateCategoryGroupContrller };

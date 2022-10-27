import { Request, Response } from "express";
import { container } from "tsyringe";

import { UpdateInfoProductUseCase } from "./UpdateInfoProductUseCase";

class UpdateInfoProductController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id, name, technical_description, category_id, supplier_id } =
      request.body;

    const updateProductUseCase = container.resolve(UpdateInfoProductUseCase);

    const product = await updateProductUseCase.execute({
      id,
      name,
      technical_description,
      category_id,
      supplier_id,
    });

    return response.json(product);
  }
}

export { UpdateInfoProductController };

import { Request, Response } from "express";
import { container } from "tsyringe";

import { UpdateProductUseCase } from "./UpdateProductUseCase";

class UpdateProductController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.query;
    const { name, technical_description, category_id, supplier_id } =
      request.body;
    const image = request.file.filename as string;

    const updateProductUseCase = container.resolve(UpdateProductUseCase);

    const product = await updateProductUseCase.execute({
      id: String(id),
      name,
      technical_description,
      image,
      category_id,
      supplier_id,
    });

    return response.json(product);
  }
}

export { UpdateProductController };

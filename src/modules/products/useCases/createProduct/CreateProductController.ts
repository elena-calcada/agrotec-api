import { Request, Response } from "express";
import { container } from "tsyringe";

import { AppError } from "../../../../shared/errors/AppError";
import { CreateProductUseCase } from "./CreateProductUseCase";

class CreateProductController {
  storageProvider: any;
  async handle(request: Request, response: Response): Promise<Response> {
    const { name, technical_description, category_id, supplier_id } =
      request.body;
    const createProductUseCase = container.resolve(CreateProductUseCase);

    if (!request.file) {
      throw new AppError("Error apload file!");
    } else {
      const image = request.file.filename as string;

      const product = await createProductUseCase.execute({
        name,
        technical_description,
        image,
        category_id,
        supplier_id,
      });

      return response.status(201).json(product);
    }
  }
}

export { CreateProductController };

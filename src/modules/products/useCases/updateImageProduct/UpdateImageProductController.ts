import { Request, Response } from "express";
import { container } from "tsyringe";

import { UpdateImageProductUseCase } from "./UpdateImageProductUseCase";

class UpdateImageProducController {
  async hendle(request: Request, response: Response): Promise<Response> {
    const { id } = request.body;
    const image = request.file.filename as string;

    const updateImageProductUseCase = container.resolve(
      UpdateImageProductUseCase
    );

    const product = await updateImageProductUseCase.execute({
      id: String(id),
      image,
    });

    return response.json(product);
  }
}

export { UpdateImageProducController };

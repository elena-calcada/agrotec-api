import { Request, Response } from "express";
import { container } from "tsyringe";

import { DetailProductUseCase } from "./DetailProductUseCase";

class DetailProductController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const detailProductUseCase = container.resolve(DetailProductUseCase);

    const product = await detailProductUseCase.execute(id);

    return response.json(product);
  }
}

export { DetailProductController };

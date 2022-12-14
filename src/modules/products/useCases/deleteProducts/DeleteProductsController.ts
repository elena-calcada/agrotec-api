import { Request, Response } from "express";
import { container } from "tsyringe";

import { DeleteProductUseCase } from "./DeleteProductsUseCase";

class DeleteProductController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.query;

    const deleteProductUseCase = container.resolve(DeleteProductUseCase);

    await deleteProductUseCase.execute(id as string);

    return response.status(200).send();
  }
}

export { DeleteProductController };

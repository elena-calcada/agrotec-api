import { Request, Response } from "express";
import { container } from "tsyringe";

import { DetailSupplierUseCase } from "./DetailSupplierUseCase";

class DetailSupplierController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.query;

    const detailSupplierUseCase = container.resolve(DetailSupplierUseCase);

    const detail = await detailSupplierUseCase.exceute(id as string);

    return response.json(detail);
  }
}

export { DetailSupplierController };

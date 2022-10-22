import { Request, Response } from "express";
import { container } from "tsyringe";

import { ListAllSuppliersUseCase } from "./ListAllSuppliersUseCase";

class ListAllSuppliersController {
  async handle(request: Request, response: Response): Promise<Response> {
    const listAllSuppliersUseCase = container.resolve(ListAllSuppliersUseCase);

    const suppliers = await listAllSuppliersUseCase.execute();

    return response.json(suppliers);
  }
}

export { ListAllSuppliersController };

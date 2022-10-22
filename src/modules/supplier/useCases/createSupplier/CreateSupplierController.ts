import { Request, Response } from "express";
import { container } from "tsyringe";

import { CreateSupplierUseCase } from "./CreateSupplierUseCase";

class CreateSupplierController {
  async hendle(request: Request, response: Response): Promise<Response> {
    const { name, description } = request.body;

    const createSupplierUseCase = container.resolve(CreateSupplierUseCase);

    await createSupplierUseCase.execute({ name, description });

    return response.status(201).send();
  }
}

export { CreateSupplierController };

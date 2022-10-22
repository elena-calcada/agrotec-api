import { Request, Response } from "express";
import { container } from "tsyringe";

import { UpdateSupplierUseCase } from "./UpdateSupplierUseCase";

class UpdateSupplierController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id, description, name } = request.body;

    const updateSupplierUseCase = container.resolve(UpdateSupplierUseCase);

    await updateSupplierUseCase.execute({ id, name, description });

    return response.status(200).send();
  }
}

export { UpdateSupplierController };

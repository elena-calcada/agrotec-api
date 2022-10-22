import { Request, Response } from "express";
import { container } from "tsyringe";

import { DeleteSupplierUseCase } from "./DeleteSupplierUseCase";

class DeleteSupplierController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.query;

    const deleteSupplierUseCase = container.resolve(DeleteSupplierUseCase);

    await deleteSupplierUseCase.execute(id as string);

    return response.status(200).send();
  }
}

export { DeleteSupplierController };

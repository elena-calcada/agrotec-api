import { Request, Response } from "express";
import { container } from "tsyringe";

import { TurnUserAdminUseCase } from "./TurnUserAdminUseCase";

class TurnUserAdminController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.body;

    const turnUserAdminUseCase = container.resolve(TurnUserAdminUseCase);

    await turnUserAdminUseCase.execute(id);

    return response.status(200).send();
  }
}

export { TurnUserAdminController };

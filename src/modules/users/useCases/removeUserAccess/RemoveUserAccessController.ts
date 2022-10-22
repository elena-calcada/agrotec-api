import { Request, Response } from "express";
import { container } from "tsyringe";

import { RemoveUserAccessUseCase } from "./RemoveUserAccessUseCase";

class RemoveUserAccessController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.body;

    const removeUserAccessUseCase = container.resolve(RemoveUserAccessUseCase);

    await removeUserAccessUseCase.executor(id);

    return response.status(200).send();
  }
}

export { RemoveUserAccessController };

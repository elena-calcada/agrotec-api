import { Request, Response } from "express";
import { container } from "tsyringe";

import { RemoveUserAccessUseCase } from "./RemoveUserAccessUseCase";

class RemoveUserAccessController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.body;

    const removeUserAccessUseCase = container.resolve(RemoveUserAccessUseCase);

    const user = await removeUserAccessUseCase.execute(id);

    return response.status(200).json(user);
  }
}

export { RemoveUserAccessController };

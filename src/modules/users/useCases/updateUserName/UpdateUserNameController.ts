import { Request, Response } from "express";
import { container } from "tsyringe";

import { UpdateUserNameUseCase } from "./UpdateUserNameUseCase";

class UpdateUserNameController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const { name } = request.body;

    const updateUserNameUseCase = container.resolve(UpdateUserNameUseCase);

    const user = await updateUserNameUseCase.execute({
      id,
      name,
    });

    return response.json(user);
  }
}

export { UpdateUserNameController };

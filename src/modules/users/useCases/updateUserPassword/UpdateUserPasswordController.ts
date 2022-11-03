import { Request, Response } from "express";
import { container } from "tsyringe";

import { UpdateUserPasswordUseCase } from "./UpdateUserPasswordUseCase";

class UpdateUserPasswordController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const { password } = request.body;

    const updateUserUseCase = container.resolve(UpdateUserPasswordUseCase);

    await updateUserUseCase.execute({
      id,
      password,
    });

    return response.status(200).send();
  }
}

export { UpdateUserPasswordController };

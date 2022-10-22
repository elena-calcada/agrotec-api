import { Request, Response } from "express";
import { container } from "tsyringe";

import { DetailUserUseCase } from "./detailUserUseCase";

class DetailUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;

    const detailUserUseCase = container.resolve(DetailUserUseCase);

    const user = await detailUserUseCase.execute(id);

    return response.json(user);
  }
}

export { DetailUserController };

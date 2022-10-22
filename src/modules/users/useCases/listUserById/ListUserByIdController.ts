import { Request, Response } from "express";
import { container } from "tsyringe";

import { ListUserByIdUseCase } from "./ListUserByIdUseCase";

class ListUserByIdController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.query;

    const listUserByIdUseCase = container.resolve(ListUserByIdUseCase);

    const user = await listUserByIdUseCase.execute(id as string);

    return response.json(user);
  }
}

export { ListUserByIdController };

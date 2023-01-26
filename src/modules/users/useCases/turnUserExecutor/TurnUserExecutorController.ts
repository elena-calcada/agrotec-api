import { Request, Response } from "express";
import { container } from "tsyringe";

import { TurnUserExecutorUseCase } from "./TurnUserExecutorUseCase";

class TurnUserExecutorController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.body;

    const turnUserExecutorUseCase = container.resolve(TurnUserExecutorUseCase);

    const userExecutor = await turnUserExecutorUseCase.execute(id);

    return response.status(200).json(userExecutor);
  }
}

export { TurnUserExecutorController };

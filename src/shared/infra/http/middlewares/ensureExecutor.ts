import { NextFunction, Request, Response } from "express";

import { UsersRepository } from "../../../../modules/users/repositories/implementations/UsersRepository";
import { AppError } from "../../../errors/AppError";

export async function ensureExecutor(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const { id } = request.user;

  const userRepository = new UsersRepository();

  const user = await userRepository.findById(id);

  if (!user.is_executor) {
    throw new AppError("This user is not an executor!", 401);
  }

  return next();
}

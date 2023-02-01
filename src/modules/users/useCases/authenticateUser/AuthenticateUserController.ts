import { Request, Response } from "express";
import { container } from "tsyringe";
import { z } from "zod";

import { ValidationSchemaError } from "../../../../shared/errors/valitation-schema.error";
import { validatorSchema } from "../../../../shared/validator/zod";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

class AuthenticateUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { body } = request;

    const authenticateSchema = z.object({
      email: z.string().email(),
      password: z.string(),
    });

    try {
      validatorSchema(authenticateSchema, body);

      const authenticateUserUseCase = container.resolve(
        AuthenticateUserUseCase
      );

      const authenticateInfo = await authenticateUserUseCase.execute(body);

      return response.json(authenticateInfo);
    } catch (err: any) {
      if (err instanceof ValidationSchemaError) {
        return response.status(err.statusCode).json(err.errors);
      }
      return response.status(err.statusCode).json(err.message);
    }
  }
}

export { AuthenticateUserController };

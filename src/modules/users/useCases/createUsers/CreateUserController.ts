import { Request, Response } from "express";
import { container } from "tsyringe";
import { z } from "zod";

import { ValidationSchemaError } from "../../../../shared/errors/valitation-schema.error";
import { validatorSchema } from "../../../../shared/validator/zod";
import { CreateUserUseCase } from "./CreateUserUseCase";

class CreateUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { body } = request;

    const userSchema = z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string().min(6, {
        message: "Invalid password",
      }),
    });

    try {
      validatorSchema(userSchema, body);

      const createUserUseCase = container.resolve(CreateUserUseCase);

      const user = await createUserUseCase.execute(body);

      return response.status(201).json(user);
    } catch (err: any) {
      if (err instanceof ValidationSchemaError) {
        return response.status(err.statusCode).json(err.errors);
      }
      return response.status(err.statusCode).json(err.message);
    }
  }
}

export { CreateUserController };

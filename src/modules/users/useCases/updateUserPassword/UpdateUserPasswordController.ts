import { Request, Response } from "express";
import { container } from "tsyringe";
import { z } from "zod";

import { ValidationSchemaError } from "../../../../shared/errors/valitation-schema.error";
import { validatorSchema } from "../../../../shared/validator/zod";
import { UpdateUserPasswordUseCase } from "./UpdateUserPasswordUseCase";

class UpdateUserPasswordController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const { password } = request.body;

    const passwordSchema = z.object({
      password: z.string().min(6, {
        message: "Invalid password",
      }),
    });

    try {
      validatorSchema(passwordSchema, { password });

      const updateUserUseCase = container.resolve(UpdateUserPasswordUseCase);

      await updateUserUseCase.execute({
        id,
        password,
      });

      return response.status(200).send();
    } catch (err: any) {
      if (err instanceof ValidationSchemaError) {
        return response.status(err.statusCode).json(err.errors);
      }
      return response.status(err.statusCode).json(err.message);
    }
  }
}

export { UpdateUserPasswordController };

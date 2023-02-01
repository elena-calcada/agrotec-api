import { ZodError, ZodSchema } from "zod";

import { ValidationSchemaError } from "../errors/valitation-schema.error";

export type ErrorSchema = {
  field: (string | number)[];
  message: string;
};

export const validatorSchema = (schema: ZodSchema, payload: any) => {
  try {
    schema.parse(payload);
  } catch (err) {
    const typedError = err as ZodError;
    const schemaErrors: ErrorSchema[] = [];

    typedError.errors.forEach((erro) => {
      schemaErrors.push({
        field: erro.path,
        message: erro.message,
      });
    });

    throw new ValidationSchemaError("ERROR_SCHEMA", schemaErrors);
  }
};

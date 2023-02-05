import { randomUUID } from "crypto";

import { AppError } from "../../../shared/errors/AppError";

export type SupplierProps = {
  name: string;
  description?: string;
};

export class Supplier {
  id: string;
  name: string;
  description?: string;
  created_at: Date;
  updated_at: Date;

  private constructor(props: SupplierProps) {
    if (!props.name) {
      throw new AppError("Name is required", 422);
    }

    this.id = randomUUID();
    this.name = props.name;
    this.description = props.description;
    this.created_at = new Date();
    this.updated_at = new Date();
  }

  static create(props: SupplierProps) {
    const supplier = new Supplier(props);
    return supplier;
  }
}

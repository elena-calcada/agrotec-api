import { randomUUID } from "crypto";

import { AppError } from "../../../shared/errors/AppError";

export type CategoryProps = {
  name: string;
  description?: string;
  group_id: string;
};

export class Category {
  id: string;
  name: string;
  description?: string;
  group_id: string;
  created_at: Date;
  updated_at: Date;

  private constructor(props: CategoryProps) {
    if (!props.name) {
      throw new AppError("Name is required", 422);
    }

    if (!props.group_id) {
      throw new AppError("Group id is required", 422);
    }

    this.id = randomUUID();
    this.name = props.name;
    this.description = props.description;
    this.group_id = props.group_id;
    this.created_at = new Date();
    this.updated_at = new Date();
  }

  static create(props: CategoryProps) {
    const category = new Category(props);
    return category;
  }
}

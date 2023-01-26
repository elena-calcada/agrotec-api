import { randomUUID } from "crypto";

import { AppError } from "../../../shared/errors/AppError";

type UserProps = {
  name: string;
  email: string;
  password: string;
};

export class User {
  id: string;
  name: string;
  email: string;
  password: string;
  is_executor: boolean;
  is_admin: boolean;
  created_at: Date;
  updated_at: Date;

  private constructor(props: UserProps) {
    if (!props.name || !props.email || !props.password) {
      throw new AppError("All fields must be filled!", 422);
    }

    this.id = randomUUID();
    this.name = props.name;
    this.email = props.email;
    this.password = props.password;
    this.is_executor = false;
    this.is_admin = false;
    this.created_at = new Date();
    this.updated_at = new Date();
  }

  static create(props: UserProps) {
    const user = new User(props);
    return user;
  }
}

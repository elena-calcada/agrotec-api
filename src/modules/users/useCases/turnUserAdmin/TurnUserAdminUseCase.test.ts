import "reflect-metadata";
import { describe, beforeEach, test, expect } from "vitest";

import { AppError } from "../../../../shared/errors/AppError";
import { UsersRepositoryInMemory } from "../../repositories/in-memory/UsersRepositoryInMemory";
import { CreateUserUseCase } from "../createUsers/CreateUserUseCase";
import { TurnUserAdminUseCase } from "./TurnUserAdminUseCase";

let usersRepositoryInMemory: UsersRepositoryInMemory;
let createUsersUseCase: CreateUserUseCase;
let turnUserAdminUseCase: TurnUserAdminUseCase;

describe("Turn user admin", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    createUsersUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    turnUserAdminUseCase = new TurnUserAdminUseCase(usersRepositoryInMemory);
  });

  test("Should be able to grant admin access to a user", async () => {
    const user = await createUsersUseCase.execute({
      name: "Veronica",
      email: "veronica@mail.com",
      password: "123",
    });

    const response = await turnUserAdminUseCase.execute(user.id);

    expect(response.is_admin).toBe(true);
    expect(response.is_executor).toBe(true);
  });

  test("Should not be able to grant admin access an user that does not exists", async () => {
    expect(async () => {
      await turnUserAdminUseCase.execute("falseId");
    }).rejects.toBeInstanceOf(AppError);
  });
});

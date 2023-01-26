import "reflect-metadata";
import { describe, beforeEach, test, expect } from "vitest";

import { AppError } from "../../../../shared/errors/AppError";
import { UsersRepositoryInMemory } from "../../repositories/in-memory/UsersRepositoryInMemory";
import { CreateUserUseCase } from "./CreateUserUseCase";

let usersRepositoryInMemory: UsersRepositoryInMemory;
let createUserUseCase: CreateUserUseCase;

describe("Create user", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  test("Should be able to create a new user", async () => {
    const user = await createUserUseCase.execute({
      name: "test name",
      email: "test@mail.com",
      password: "1230",
    });

    const userCreated = await usersRepositoryInMemory.findByEmail(user.email);

    expect(user).toHaveProperty("id");
    expect(user).toHaveProperty("created_at");
    expect(user.name).toEqual("test name");
    expect(userCreated.password).not.equal("1230");
  });

  test("should not be able to create an user that already exists", async () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: "Name test",
        email: "mail@mail.com",
        password: "12345",
      });

      await createUserUseCase.execute({
        name: "Test name",
        email: "mail@mail.com",
        password: "123",
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});

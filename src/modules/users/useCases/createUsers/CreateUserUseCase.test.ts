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

    expect(user).toHaveProperty("id");
    expect(user).toHaveProperty("created_at");
    expect(user.name).toEqual("test name");
  });

  test("Should not be able to create a new user there is some information missing", async () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: "Name",
        email: "",
        password: "1230",
      });
    }).rejects.toBeInstanceOf(AppError);
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

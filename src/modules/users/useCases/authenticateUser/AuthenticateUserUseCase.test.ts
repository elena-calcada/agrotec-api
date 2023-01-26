import "reflect-metadata";
import { describe, beforeEach, test, expect } from "vitest";

import { UsersRepositoryInMemory } from "../../repositories/in-memory/UsersRepositoryInMemory";
import { CreateUserUseCase } from "../createUsers/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

let usersRepositoryInMemory: UsersRepositoryInMemory;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate User", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    authenticateUserUseCase = new AuthenticateUserUseCase(
      usersRepositoryInMemory
    );
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  test("Should be able to authenticate an user", async () => {
    const user = await createUserUseCase.execute({
      name: "user",
      email: "user@mail.com",
      password: "12345",
    });

    const result = await authenticateUserUseCase.execute({
      email: user.email,
      password: "12345",
    });

    expect(result).toHaveProperty("token");
    expect(result.user.name).toEqual("user");
  });

  test("Should not be able to authenticate an user that not exists", async () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: "notexists@mail.com",
        password: "111",
      });
    }).rejects.toThrow("E-mail or password incorrect!");
  });

  test("Should not be able to authenticate an user if the password is incorrect", async () => {
    await createUserUseCase.execute({
      name: "test name",
      email: "user@mail.com",
      password: "12345",
    });

    expect(async () => {
      await authenticateUserUseCase.execute({
        email: "user@mail.com",
        password: "incorrect password",
      });
    }).rejects.toThrow("E-mail or password incorrect!");
  });

  test("Should not be able to authenticate an user if the email is incorrect", async () => {
    await createUserUseCase.execute({
      name: "test name",
      email: "user@mail.com",
      password: "12345",
    });

    expect(async () => {
      await authenticateUserUseCase.execute({
        email: "incorrect mail",
        password: "12345",
      });
    }).rejects.toThrow("E-mail or password incorrect!");
  });
});

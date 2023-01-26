import "reflect-metadata";
import { describe, beforeEach, test, expect } from "vitest";

import { UsersRepositoryInMemory } from "../../repositories/in-memory/UsersRepositoryInMemory";
import { AuthenticateUserUseCase } from "../authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "../createUsers/CreateUserUseCase";
import { UpdateUserPasswordUseCase } from "./UpdateUserPasswordUseCase";

let usersRepositoryInMemory: UsersRepositoryInMemory;
let createUsersUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;
let updateUserPasswordUseCase: UpdateUserPasswordUseCase;

describe("Update user password", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    createUsersUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    authenticateUserUseCase = new AuthenticateUserUseCase(
      usersRepositoryInMemory
    );
    updateUserPasswordUseCase = new UpdateUserPasswordUseCase(
      usersRepositoryInMemory
    );
  });

  test("Should be able to update an user password", async () => {
    const user = await createUsersUseCase.execute({
      name: "Veronica",
      email: "veronica@mail.com",
      password: "123",
    });

    await updateUserPasswordUseCase.execute({
      id: user.id,
      password: "321",
    });

    const userAuthenticate = await authenticateUserUseCase.execute({
      email: user.email,
      password: "321",
    });

    expect(userAuthenticate).toHaveProperty("token");
  });

  test("Should not be able to update an user password if user does not exists", async () => {
    expect(async () => {
      await updateUserPasswordUseCase.execute({
        id: "falseID",
        password: "321",
      });
    }).rejects.toThrow("User does not exists!");
  });

  test("Should not be able to update an user password if password does not informed", async () => {
    const user = await createUsersUseCase.execute({
      name: "Veronica",
      email: "veronica@mail.com",
      password: "123",
    });

    expect(async () => {
      await updateUserPasswordUseCase.execute({
        id: user.id,
        password: "",
      });
    }).rejects.toThrow("Password not informed!");
  });
});

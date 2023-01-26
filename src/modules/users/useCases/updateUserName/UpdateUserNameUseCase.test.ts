import "reflect-metadata";
import { describe, beforeEach, test, expect } from "vitest";

import { UsersRepositoryInMemory } from "../../repositories/in-memory/UsersRepositoryInMemory";
import { CreateUserUseCase } from "../createUsers/CreateUserUseCase";
import { UpdateUserNameUseCase } from "./UpdateUserNameUseCase";

let usersRepositoryInMemory: UsersRepositoryInMemory;
let createUsersUseCase: CreateUserUseCase;
let updateUserNameUseCase: UpdateUserNameUseCase;

describe("Update user name", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    createUsersUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    updateUserNameUseCase = new UpdateUserNameUseCase(usersRepositoryInMemory);
  });

  test("Should be able to update an user name", async () => {
    const user = await createUsersUseCase.execute({
      name: "user",
      email: "veronica@mail.com",
      password: "123",
    });

    expect(user.name).toEqual("user");

    await updateUserNameUseCase.execute({
      id: user.id,
      name: "Veronica",
    });

    expect(user.name).toEqual("Veronica");
  });

  test("Should be able to update an user name if user does not exists", async () => {
    expect(async () => {
      await updateUserNameUseCase.execute({
        id: "false_id",
        name: "name_updated",
      });
    }).rejects.toThrow("User does not exists!");
  });

  test("Should be able to update an user name if user name does not informed", async () => {
    const user = await createUsersUseCase.execute({
      name: "user",
      email: "veronica@mail.com",
      password: "123",
    });

    expect(async () => {
      await updateUserNameUseCase.execute({
        id: user.id,
        name: "",
      });
    }).rejects.toThrow("Name not informed!");
  });
});

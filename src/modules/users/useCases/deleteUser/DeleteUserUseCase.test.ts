import "reflect-metadata";
import { describe, beforeEach, test, expect } from "vitest";

import { UsersRepositoryInMemory } from "../../repositories/in-memory/UsersRepositoryInMemory";
import { CreateUserUseCase } from "../createUsers/CreateUserUseCase";
import { ListUserByIdUseCase } from "../listUserById/ListUserByIdUseCase";
import { DeleteUserUseCase } from "./DeleteUserUseCase";

let usersRepositoryInMemory: UsersRepositoryInMemory;
let deleteUserUseCase: DeleteUserUseCase;
let createUserUseCase: CreateUserUseCase;
let listUserByIdUseCase: ListUserByIdUseCase;

describe("Delete User", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    deleteUserUseCase = new DeleteUserUseCase(usersRepositoryInMemory);
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    listUserByIdUseCase = new ListUserByIdUseCase(usersRepositoryInMemory);
  });

  test("Should be able to delete an user", async () => {
    const user = await createUserUseCase.execute({
      name: "delete name",
      email: "delete@mail.com",
      password: "delete",
    });

    await deleteUserUseCase.execute(user.id);

    expect(async () => {
      await listUserByIdUseCase.execute(user.id);
    }).rejects.toThrow("User does not exists!");
  });
});

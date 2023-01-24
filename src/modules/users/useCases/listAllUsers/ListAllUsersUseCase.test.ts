import "reflect-metadata";
import { describe, beforeEach, test, expect } from "vitest";

import { UsersRepositoryInMemory } from "../../repositories/in-memory/UsersRepositoryInMemory";
import { CreateUserUseCase } from "../createUsers/CreateUserUseCase";
import { ListAllUsersUseCase } from "./ListAllUsersUseCase";

let usersRepositoryInMemory: UsersRepositoryInMemory;
let createUserUseCase: CreateUserUseCase;
let listAllUsersUseCase: ListAllUsersUseCase;

describe("List All Users", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    listAllUsersUseCase = new ListAllUsersUseCase(usersRepositoryInMemory);
  });

  test("Should be able to list all users", async () => {
    await createUserUseCase.execute({
      name: "João",
      email: "joao@mail.com",
      password: "joao",
    });

    await createUserUseCase.execute({
      name: "Pedro",
      email: "pedro@mail.com",
      password: "pedro",
    });

    const list = await listAllUsersUseCase.execute();

    expect(list.length).toBe(2);
  });
});

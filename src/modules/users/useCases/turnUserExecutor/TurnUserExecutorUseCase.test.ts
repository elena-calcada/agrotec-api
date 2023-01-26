import "reflect-metadata";
import { describe, beforeEach, test, expect } from "vitest";

import { UsersRepositoryInMemory } from "../../repositories/in-memory/UsersRepositoryInMemory";
import { CreateUserUseCase } from "../createUsers/CreateUserUseCase";
import { TurnUserExecutorUseCase } from "./TurnUserExecutorUseCase";

let usersRepositoryInMemory: UsersRepositoryInMemory;
let createUserUseCase: CreateUserUseCase;
let turnUserExecutorUseCase: TurnUserExecutorUseCase;

describe("Turn user executor", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    turnUserExecutorUseCase = new TurnUserExecutorUseCase(
      usersRepositoryInMemory
    );
  });

  test("Should be able to grant executor access to a user", async () => {
    const user = await createUserUseCase.execute({
      name: "Ulisses",
      email: "ulisses@mail.com",
      password: "123",
    });

    const userExecutor = await turnUserExecutorUseCase.execute(user.id);

    expect(userExecutor.is_admin).toBe(false);
    expect(userExecutor.is_executor).toBe(true);
  });

  test("Should not be able to grant executor access an user that does not exists", async () => {
    expect(async () => {
      await turnUserExecutorUseCase.execute("falseId");
    }).rejects.toThrow("User does not exists!");
  });
});

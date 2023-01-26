import "reflect-metadata";
import { beforeEach, describe, expect, test } from "vitest";

import { UsersRepositoryInMemory } from "../../repositories/in-memory/UsersRepositoryInMemory";
import { CreateUserUseCase } from "../createUsers/CreateUserUseCase";
import { TurnUserAdminUseCase } from "../turnUserAdmin/TurnUserAdminUseCase";
import { RemoveUserAccessUseCase } from "./RemoveUserAccessUseCase";

let usersRepositoryInMemory: UsersRepositoryInMemory;
let createUserUseCase: CreateUserUseCase;
let turnUserAdminUseCase: TurnUserAdminUseCase;
let removeUserAccessUseCase: RemoveUserAccessUseCase;

describe("Remove user access", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    turnUserAdminUseCase = new TurnUserAdminUseCase(usersRepositoryInMemory);
    removeUserAccessUseCase = new RemoveUserAccessUseCase(
      usersRepositoryInMemory
    );
  });

  test("Should be able to remove user access", async () => {
    const user = await createUserUseCase.execute({
      name: "Bruna",
      email: "bruna@mail.com",
      password: "123",
    });

    const userAdmin = await turnUserAdminUseCase.execute(user.id);

    expect(userAdmin.is_admin).toBe(true);
    expect(userAdmin.is_executor).toBe(true);

    const userWithoutAccess = await removeUserAccessUseCase.execute(
      userAdmin.id
    );

    expect(userWithoutAccess.is_admin).toBe(false);
    expect(userWithoutAccess.is_executor).toBe(false);
  });

  test("Should not be able to remove user access if user does not exists", async () => {
    expect(async () => {
      await removeUserAccessUseCase.execute("falseId");
    }).rejects.toThrow("User does not exists!");
  });
});

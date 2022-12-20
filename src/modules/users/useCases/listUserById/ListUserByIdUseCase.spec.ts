import { AppError } from "../../../../shared/errors/AppError";
import { UsersRepositoryInMemory } from "../../repositories/in-memory/UsersRepositoryInMemory";
import { CreateUserUseCase } from "../createUsers/CreateUserUseCase";
import { ListUserByIdUseCase } from "./ListUserByIdUseCase";

let usersRepositoryInMemory: UsersRepositoryInMemory;
let listUserByIdUseCase: ListUserByIdUseCase;
let createUsersUseCase: CreateUserUseCase;

describe("List User by Id", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    listUserByIdUseCase = new ListUserByIdUseCase(usersRepositoryInMemory);
    createUsersUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it("Should be able to list an user by id", async () => {
    const user = await createUsersUseCase.execute({
      name: "Bruna",
      email: "bruna@mail.com",
      password: "123",
    });

    const response = await listUserByIdUseCase.execute(user.id);

    expect(response).toHaveProperty("id");
    expect(response.name).toEqual("Bruna");
  });

  it("Should not be able to list an user that not exists", async () => {
    expect(async () => {
      await listUserByIdUseCase.execute("falseId");
    }).rejects.toBeInstanceOf(AppError);
  });
});

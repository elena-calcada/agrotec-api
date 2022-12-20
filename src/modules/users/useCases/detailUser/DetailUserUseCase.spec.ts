import { AppError } from "../../../../shared/errors/AppError";
import { UsersRepositoryInMemory } from "../../repositories/in-memory/UsersRepositoryInMemory";
import { CreateUserUseCase } from "../createUsers/CreateUserUseCase";
import { DetailUserUseCase } from "./DetailUserUseCase";

let usersRepositoryInMemory: UsersRepositoryInMemory;
let createUserUseCase: CreateUserUseCase;
let detailUserUseCase: DetailUserUseCase;

describe("Detail User", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    detailUserUseCase = new DetailUserUseCase(usersRepositoryInMemory);
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it("Should be able to access the logged in user's datails", async () => {
    const user = await createUserUseCase.execute({
      name: "test name 2",
      email: "test2@mail.com",
      password: "111",
    });

    const response = await detailUserUseCase.execute(user.id);

    expect(response).toHaveProperty("id");
    expect(response.name).toEqual("test name 2");
  });

  it("Should not be able to access user detail if it does not exists", async () => {
    expect(async () => {
      await detailUserUseCase.execute("123");
    }).rejects.toBeInstanceOf(AppError);
  });
});

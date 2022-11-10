import { AppError } from "../../../../shared/errors/AppError";
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

  it("Should be able to authenticate an user", async () => {
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
  });

  it("Should not be able to authenticate an user that not exists", async () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: "notexists@mail.com",
        password: "111",
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("Should not be able to authenticate an user if the email or password is incorrect", async () => {
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
    }).rejects.toBeInstanceOf(AppError);
  });
});

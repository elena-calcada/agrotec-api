import { hash } from "bcryptjs";
import { inject, injectable } from "tsyringe";

import { AppError } from "../../../../shared/errors/AppError";
import { IReturnUserDTO } from "../../dtos/IReturnUserDTO";
import { User } from "../../entities/user.entity";
import { IUsersRepository } from "../../repositories/IUsersRepository";

interface IUserRequest {
  name: string;
  email: string;
  password: string;
}

@injectable()
class CreateUserUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) {}

  async execute({
    name,
    email,
    password,
  }: IUserRequest): Promise<IReturnUserDTO> {
    const userAreadyExists = await this.usersRepository.findByEmail(email);

    if (userAreadyExists) {
      throw new AppError("User already exists!", 400);
    }

    const passwordHash = await hash(password, 8);

    const user = User.create({
      name,
      email,
      password: passwordHash,
    });

    const userCreated = await this.usersRepository.create(user);

    return userCreated;
  }
}

export { CreateUserUseCase };

import { inject, injectable } from "tsyringe";

import { AppError } from "../../../../shared/errors/AppError";
import { IUpdateUserDTO } from "../../dtos/IUpdateUserDTO";
import { IUsersRepository } from "../../repositories/IUsersRepository";

@injectable()
class UpdateUserUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) {}

  async execute({ id, name, password }: IUpdateUserDTO): Promise<void> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new AppError("User does not exists!");
    }

    if (!name || !password) {
      throw new AppError("All fields must be filled!");
    }

    await this.usersRepository.updateUser({ id, name, password });
  }
}

export { UpdateUserUseCase };

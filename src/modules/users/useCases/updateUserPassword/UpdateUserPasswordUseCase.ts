import { inject, injectable } from "tsyringe";

import { AppError } from "../../../../shared/errors/AppError";
import { IUpdateUserPasswordDTO } from "../../dtos/IUpdateUserPasswordDTO";
import { IUsersRepository } from "../../repositories/IUsersRepository";

@injectable()
class UpdateUserPasswordUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) {}

  async execute({ id, password }: IUpdateUserPasswordDTO): Promise<void> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new AppError("User does not exists!");
    }

    if (!password) {
      throw new AppError("Password not informed!");
    }

    await this.usersRepository.updateUserPassword({ id, password });
  }
}

export { UpdateUserPasswordUseCase };

import { inject, injectable } from "tsyringe";

import { AppError } from "../../../../shared/errors/AppError";
import { IReturnUserDTO } from "../../dtos/IReturnUserDTO";
import { IUsersRepository } from "../../repositories/IUsersRepository";

@injectable()
class TurnUserExecutorUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) {}

  async execute(id: string): Promise<IReturnUserDTO> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new AppError("User does not exists!");
    }

    const userExecutor = await this.usersRepository.turnUserExecutor(id);

    return userExecutor;
  }
}

export { TurnUserExecutorUseCase };

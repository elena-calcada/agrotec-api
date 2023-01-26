import { inject, injectable } from "tsyringe";

import { AppError } from "../../../../shared/errors/AppError";
import { IReturnUserDTO } from "../../dtos/IReturnUserDTO";
import { IUsersRepository } from "../../repositories/IUsersRepository";

@injectable()
class RemoveUserAccessUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) {}

  async execute(id: string): Promise<IReturnUserDTO> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new AppError("User does not exists!");
    }

    const userWithoutAccess = await this.usersRepository.removeUserAccess(id);

    return userWithoutAccess;
  }
}

export { RemoveUserAccessUseCase };

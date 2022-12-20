import { inject, injectable } from "tsyringe";

import { AppError } from "../../../../shared/errors/AppError";
import { IReturnUserDTO } from "../../dtos/IReturnUserDTO";
import { IUsersRepository } from "../../repositories/IUsersRepository";

@injectable()
class TurnUserAdminUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) {}

  async execute(id: string): Promise<IReturnUserDTO> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new AppError("User does not exists!");
    }

    const userAdmin = await this.usersRepository.turnUserAdmin(id);

    return userAdmin;
  }
}

export { TurnUserAdminUseCase };

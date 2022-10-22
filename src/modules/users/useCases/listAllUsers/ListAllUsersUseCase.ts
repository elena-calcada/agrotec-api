import { inject, injectable } from "tsyringe";

import { IReturnUserDTO } from "../../dtos/IReturnUserDTO";
import { IUsersRepository } from "../../repositories/IUsersRepository";

@injectable()
class ListAllUsersUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) {}

  async execute(): Promise<IReturnUserDTO[]> {
    const users = await this.usersRepository.listAllUsers();

    return users;
  }
}

export { ListAllUsersUseCase };

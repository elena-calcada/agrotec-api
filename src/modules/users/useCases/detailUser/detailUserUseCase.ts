import { inject, injectable } from "tsyringe";

import { IReturnUserDTO } from "../../dtos/IReturnUserDTO";
import { IUsersRepository } from "../../repositories/IUsersRepository";

@injectable()
class DetailUserUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) {}

  async execute(id: string): Promise<IReturnUserDTO> {
    const user = await this.usersRepository.detailUser(id);

    return user;
  }
}

export { DetailUserUseCase };

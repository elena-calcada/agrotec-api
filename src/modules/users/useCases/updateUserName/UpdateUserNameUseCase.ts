import { inject, injectable } from "tsyringe";

import { AppError } from "../../../../shared/errors/AppError";
import { IReturnUserDTO } from "../../dtos/IReturnUserDTO";
import { IUpdateUserNameDTO } from "../../dtos/IUpdateUserNameDTO";
import { IUsersRepository } from "../../repositories/IUsersRepository";

@injectable()
class UpdateUserNameUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) {}

  async execute({ id, name }: IUpdateUserNameDTO): Promise<IReturnUserDTO> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new AppError("User does not exists!");
    }

    if (!name) {
      throw new AppError("Name not informed!");
    }

    const responseUser = await this.usersRepository.updateUserName({
      id,
      name,
    });

    return responseUser;
  }
}

export { UpdateUserNameUseCase };

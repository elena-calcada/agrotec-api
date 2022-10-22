import { inject, injectable } from "tsyringe";

import { AppError } from "../../../../shared/errors/AppError";
import { IUsersRepository } from "../../repositories/IUsersRepository";

@injectable()
class DeleteUserUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) {}

  async execute(id: string): Promise<void> {
    try {
      await this.usersRepository.deleteUser(id);
    } catch {
      throw new AppError("User does not exists!");
    }
  }
}

export { DeleteUserUseCase };

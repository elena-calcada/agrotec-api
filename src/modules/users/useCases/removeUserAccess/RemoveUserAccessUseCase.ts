import { inject, injectable } from "tsyringe";

import { AppError } from "../../../../shared/errors/AppError";
import { IUsersRepository } from "../../repositories/IUsersRepository";

@injectable()
class RemoveUserAccessUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) {}

  async executor(id: string): Promise<void> {
    const user = this.usersRepository.findById(id);

    if (!user) {
      throw new AppError("User does not exists!");
    }

    await this.usersRepository.removeUserAccess(id);
  }
}

export { RemoveUserAccessUseCase };

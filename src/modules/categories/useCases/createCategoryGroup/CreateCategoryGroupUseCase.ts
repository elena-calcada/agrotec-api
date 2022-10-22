import { inject, injectable } from "tsyringe";

import { AppError } from "../../../../shared/errors/AppError";
import { ICategoryGroupRepository } from "../../repositories/ICategoryGroupRepository";

interface IRequest {
  name: string;
  description?: string;
}

@injectable()
class CreateCategoryGroupUseCase {
  constructor(
    @inject("CategoryGroupRepository")
    private categoryGroupRepository: ICategoryGroupRepository
  ) {}

  async execute({ name, description }: IRequest) {
    if (!name) {
      throw new AppError("All fields must be filled!");
    }

    const group = await this.categoryGroupRepository.findByName(name);

    if (group) {
      throw new AppError("Category group already exists!");
    }

    await this.categoryGroupRepository.create({ name, description });
  }
}

export { CreateCategoryGroupUseCase };

import { inject, injectable } from "tsyringe";

import { AppError } from "../../../../shared/errors/AppError";
import { CategoryGroup } from "../../entities/category-group.entity";
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

  async execute({ name, description }: IRequest): Promise<CategoryGroup> {
    const groupExists = await this.categoryGroupRepository.findByName(name);

    if (groupExists) {
      throw new AppError("Category group already exists!");
    }

    const groupCreated = CategoryGroup.create({
      name,
      description,
    });

    const group = await this.categoryGroupRepository.save(groupCreated);

    return group;
  }
}

export { CreateCategoryGroupUseCase };

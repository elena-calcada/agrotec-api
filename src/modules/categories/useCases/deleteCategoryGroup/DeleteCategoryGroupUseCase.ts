import { inject, injectable } from "tsyringe";

import { AppError } from "../../../../shared/errors/AppError";
import { ICategoriesRepository } from "../../repositories/ICategoriesRepository";
import { ICategoryGroupRepository } from "../../repositories/ICategoryGroupRepository";

@injectable()
class DeleteCategoryGroupUseCase {
  constructor(
    @inject("CategoriesRepository")
    private categoriesRepository: ICategoriesRepository,
    @inject("CategoryGroupRepository")
    private categoryGroupRepository: ICategoryGroupRepository
  ) {}

  async execute(id: string): Promise<void> {
    const groupExists = await this.categoryGroupRepository.findById(id);

    if (!groupExists) {
      throw new AppError("Category Group does not exists", 400);
    }

    const categories = await this.categoriesRepository.listCategpeyByGroup(id);

    if (categories.length !== 0) {
      throw new AppError("Cannot delete group!");
    }

    await this.categoryGroupRepository.deleteGroup(id);
  }
}

export { DeleteCategoryGroupUseCase };

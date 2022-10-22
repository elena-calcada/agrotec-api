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
    const categories = await this.categoriesRepository.listCategpeyByGroup(id);

    if (categories.length !== 0) {
      throw new AppError("Cannot delete group!");
    }

    await this.categoryGroupRepository.deleteGroup(id);
  }
}

export { DeleteCategoryGroupUseCase };

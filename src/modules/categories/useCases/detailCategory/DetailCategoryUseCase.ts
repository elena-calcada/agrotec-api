import { inject, injectable } from "tsyringe";

import { AppError } from "../../../../shared/errors/AppError";
import { Category } from "../../entities/category.entity";
import { ICategoriesRepository } from "../../repositories/ICategoriesRepository";

@injectable()
class DetailCategoryUseCase {
  constructor(
    @inject("CategoriesRepository")
    private categoriesRepository: ICategoriesRepository
  ) {}

  async execute(id: string): Promise<Category> {
    const category = await this.categoriesRepository.findById(id);

    if (!category) {
      throw new AppError("Category does not exists!");
    }

    return category;
  }
}

export { DetailCategoryUseCase };

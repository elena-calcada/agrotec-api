import { inject, injectable } from "tsyringe";

import { Category } from "../../entities/category.entity";
import { ICategoriesRepository } from "../../repositories/ICategoriesRepository";

@injectable()
class ListAllCategoriesUseCase {
  constructor(
    @inject("CategoriesRepository")
    private categoriesRepository: ICategoriesRepository
  ) {}

  async execute(): Promise<Category[]> {
    const categories = await this.categoriesRepository.listAll();

    return categories;
  }
}

export { ListAllCategoriesUseCase };

import { inject, injectable } from "tsyringe";

import { Category } from "../../entities/category.entity";
import { ICategoriesRepository } from "../../repositories/ICategoriesRepository";

@injectable()
class ListCategoryByGroupUseCase {
  constructor(
    @inject("CategoriesRepository")
    private categoriesRepository: ICategoriesRepository
  ) {}

  async execute(group_id?: string): Promise<Category[]> {
    const categories = await this.categoriesRepository.listCategpeyByGroup(
      group_id as string
    );

    return categories;
  }
}

export { ListCategoryByGroupUseCase };

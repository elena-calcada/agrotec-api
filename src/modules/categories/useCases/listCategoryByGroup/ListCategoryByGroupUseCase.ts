import { Category } from "@prisma/client";
import { inject, injectable } from "tsyringe";

import { ICategoriesRepository } from "../../repositories/ICategoriesRepository";

@injectable()
class ListCategoryByGroupUseCase {
  constructor(
    @inject("CategoriesRepository")
    private categoriesRepository: ICategoriesRepository
  ) {}

  async execute(group_id?: string): Promise<Category[]> {
    /* if (!group_id) {
      const categories = await this.categoriesRepository.listAll();

      return categories;
    } */

    const categories = await this.categoriesRepository.listCategpeyByGroup(
      group_id as string
    );

    // console.log(group_id);

    return categories;
  }
}

export { ListCategoryByGroupUseCase };

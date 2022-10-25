import { inject, injectable } from "tsyringe";

import { IUpdateCategoryDTO } from "../../dtos/IUpdateCategoryDTO";
import { ICategoriesRepository } from "../../repositories/ICategoriesRepository";

@injectable()
class UpdateCategoryUseCase {
  constructor(
    @inject("CategoriesRepository")
    private categoriesRepository: ICategoriesRepository
  ) {}

  async execute({
    id,
    name,
    description,
    categoryGroup_id,
  }: IUpdateCategoryDTO): Promise<void> {
    await this.categoriesRepository.update({
      id,
      name,
      description,
      categoryGroup_id,
    });
  }
}

export { UpdateCategoryUseCase };

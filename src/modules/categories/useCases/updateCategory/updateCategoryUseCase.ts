import { inject, injectable } from "tsyringe";

import { AppError } from "../../../../shared/errors/AppError";
import { IUpdateCategoryDTO } from "../../dtos/IUpdateCategoryDTO";
import { Category } from "../../entities/category.entity";
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
    group_id,
  }: IUpdateCategoryDTO): Promise<Category> {
    if (!id) {
      throw new AppError("Ctaegory id is required");
    }

    if (!name) {
      throw new AppError("Name is required");
    }

    if (!group_id) {
      throw new AppError("Group id is required");
    }

    const categoryExists = await this.categoriesRepository.findById(id);

    if (!categoryExists) {
      throw new AppError("Category does not exists");
    }

    const category = await this.categoriesRepository.update({
      id,
      name,
      description,
      group_id,
    });

    return category;
  }
}

export { UpdateCategoryUseCase };

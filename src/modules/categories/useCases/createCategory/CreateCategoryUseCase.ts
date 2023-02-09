import { inject, injectable } from "tsyringe";

import { AppError } from "../../../../shared/errors/AppError";
import { ICreateCategoryDTO } from "../../dtos/ICreateCategoryDTO";
import { Category } from "../../entities/category.entity";
import { ICategoriesRepository } from "../../repositories/ICategoriesRepository";
import { ICategoryGroupRepository } from "../../repositories/ICategoryGroupRepository";

@injectable()
class CreateCategorysUseCase {
  constructor(
    @inject("CategoriesRepository")
    private categoriesRepository: ICategoriesRepository,
    @inject("CategoryGroupRepository")
    private categoryGroupRepository: ICategoryGroupRepository
  ) {}

  async execute({
    name,
    description,
    group_id,
  }: ICreateCategoryDTO): Promise<Category> {
    const categoryExists = await this.categoriesRepository.findByName(name);

    if (categoryExists) {
      throw new AppError("Category already exists!");
    }

    const group = await this.categoryGroupRepository.findById(group_id);

    if (!group) {
      throw new AppError("Category group does not exists!");
    }

    const categoryCteated = Category.create({
      name,
      description,
      group_id,
    });

    const category = await this.categoriesRepository.save(categoryCteated);

    return category;
  }
}

export { CreateCategorysUseCase };

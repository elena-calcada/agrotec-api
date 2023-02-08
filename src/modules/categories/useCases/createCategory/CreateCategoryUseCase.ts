import { inject, injectable } from "tsyringe";

import { AppError } from "../../../../shared/errors/AppError";
import { ICreateCategoryDTO } from "../../dtos/ICreateCategoryDTO";
import { Category } from "../../entities/category.entity";
import { ICategoriesRepository } from "../../repositories/ICategoriesRepository";

@injectable()
class CreateCategorysUseCase {
  constructor(
    @inject("CategoriesRepository")
    private categoriesRepository: ICategoriesRepository
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

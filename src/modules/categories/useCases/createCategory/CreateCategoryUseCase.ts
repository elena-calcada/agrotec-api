import { inject, injectable } from "tsyringe";

import { AppError } from "../../../../shared/errors/AppError";
import { ICreateCategoryDTO } from "../../dtos/ICreateCategoryDTO";
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
    categoryGroup_id,
  }: ICreateCategoryDTO): Promise<void> {
    if (!name || !description || !categoryGroup_id) {
      throw new AppError("All fields must be filled!");
    }

    const category = await this.categoriesRepository.findByName(name);

    if (category) {
      throw new AppError("Category already exists!");
    }

    await this.categoriesRepository.create({
      name,
      description,
      categoryGroup_id,
    });
  }
}

export { CreateCategorysUseCase };

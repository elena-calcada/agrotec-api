import { inject, injectable } from "tsyringe";

import { ICategoriesRepository } from "../../repositories/ICategoriesRepository";

@injectable()
class ListAllCategoriesUseCase {
  constructor(
    @inject("CategoriesRepository")
    private categoriesRepository: ICategoriesRepository
  ) {}

  async execute() {
    const repositories = await this.categoriesRepository.listAll();

    return repositories;
  }
}

export { ListAllCategoriesUseCase };

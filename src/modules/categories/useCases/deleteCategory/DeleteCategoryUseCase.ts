import { inject, injectable } from "tsyringe";

import { AppError } from "../../../../shared/errors/AppError";
import { IProductsRepository } from "../../../products/repositories/IProductsRepository";
import { ICategoriesRepository } from "../../repositories/ICategoriesRepository";

@injectable()
class DeleteCategoryUseCase {
  constructor(
    @inject("CategoriesRepository")
    private categoriesRepository: ICategoriesRepository,
    @inject("ProductsRepository")
    private productsRepository: IProductsRepository
  ) {}
  async execute(id: string): Promise<void> {
    const products = await this.productsRepository.listByCategory(id);

    if (products.length !== 0) {
      throw new AppError("Cannot delete category!");
    }

    await this.categoriesRepository.deleteCategory(id);
  }
}

export { DeleteCategoryUseCase };

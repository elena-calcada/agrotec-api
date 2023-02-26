import { inject, injectable } from "tsyringe";

import { IFilterProductDTO } from "../../dtos/IFilterProductDTO";
import { Product } from "../../entities/product.entity";
import { IProductsRepository } from "../../repositories/IProductsRepository";

@injectable()
class FilterProductsUseCase {
  constructor(
    @inject("ProductsRepository")
    private productsRepository: IProductsRepository
  ) {}

  async execute({
    name,
    group_id,
    category_id,
    supplier_id,
  }: IFilterProductDTO): Promise<Product[]> {
    const products =
      await this.productsRepository.findByNameOrCategoryOrSupplierOrGroup({
        name,
        group_id,
        category_id,
        supplier_id,
      });

    return products;
  }
}

export { FilterProductsUseCase };

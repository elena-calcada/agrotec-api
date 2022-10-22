import { Product } from "@prisma/client";
import { inject, injectable } from "tsyringe";

import { IProductsRepository } from "../../repositories/IProductsRepository";

@injectable()
class ListAllProductsUseCase {
  constructor(
    @inject("ProductsRepository")
    private productsRepository: IProductsRepository
  ) {}

  async execute(): Promise<Product[]> {
    const products = await this.productsRepository.listAll();

    return products;
  }
}

export { ListAllProductsUseCase };

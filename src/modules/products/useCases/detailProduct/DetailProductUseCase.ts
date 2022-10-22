import { Product } from "@prisma/client";
import { inject, injectable } from "tsyringe";

import { AppError } from "../../../../shared/errors/AppError";
import { IProductsRepository } from "../../repositories/IProductsRepository";

@injectable()
class DetailProductUseCase {
  constructor(
    @inject("ProductsRepository")
    private productsRepository: IProductsRepository
  ) {}
  async execute(id: string): Promise<Product> {
    const product = this.productsRepository.findById(id);

    if (!product) {
      throw new AppError("Product does not exists!");
    }

    return product;
  }
}

export { DetailProductUseCase };

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
    const product = await this.productsRepository.findById(id);

    if (!product) {
      throw new AppError("Product does not exists!");
    }

    switch (process.env.DISK) {
      case "local":
        return {
          ...product,
          image_url: `${process.env.APP_API_URL}/${product.image}`,
        };

      case "s3":
        return {
          ...product,
          image_url: `${process.env.AWS_BUCKET_URL}/${product.image}`,
        };

      default:
        return product;
    }
  }
}

export { DetailProductUseCase };

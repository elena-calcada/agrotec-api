import { inject, injectable } from "tsyringe";

import { IStorageProvider } from "../../../../shared/container/providers/StorageProvider/IStorageProvider";
import { AppError } from "../../../../shared/errors/AppError";
import { IUpdateImageProductDTO } from "../../dtos/IUpdateImageProductDTO";
import { Product } from "../../entities/product.entity";
import { IProductsRepository } from "../../repositories/IProductsRepository";

@injectable()
class UpdateImageProductUseCase {
  constructor(
    @inject("ProductsRepository")
    private productsRepository: IProductsRepository,
    @inject("StorageProvider")
    private storageProvider: IStorageProvider
  ) {}
  async execute({ id, image }: IUpdateImageProductDTO): Promise<Product> {
    if (!image) {
      throw new AppError("Image not found!");
    }

    const productExists = await this.productsRepository.findById(id);

    if (!productExists) {
      await this.storageProvider.save(image, "products");
      await this.storageProvider.delete(image, "products");
      throw new AppError("Product does not exists!");
    }

    await this.storageProvider.delete(productExists.image, "products");

    await this.storageProvider.save(image, "products");

    const product = await this.productsRepository.updateImageProduct({
      id,
      image,
    });

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

export { UpdateImageProductUseCase };

import fs from "fs";
import { resolve } from "path";
import { inject, injectable } from "tsyringe";

import upload from "../../../../config/upload";
import { IStorageProvider } from "../../../../shared/container/providers/StorageProvider/IStorageProvider";
import { AppError } from "../../../../shared/errors/AppError";
import { ICreateProductsDTO } from "../../dtos/ICreateProductsDTO";
import { IProductsRepository } from "../../repositories/IProductsRepository";

@injectable()
class CreateProductUseCase {
  constructor(
    @inject("ProductsRepository")
    private productRepository: IProductsRepository,
    @inject("StorageProvider")
    private storageProvider: IStorageProvider
  ) {}
  async execute({
    name,
    technical_description,
    image,
    category_id,
    supplier_id,
  }: ICreateProductsDTO): Promise<void> {
    if (!name || !technical_description || !category_id || !supplier_id) {
      throw new AppError("All fields must be filled!");
    }

    const product = await this.productRepository.findByName(name);

    if (product) {
      const filename = resolve(upload.tmpFolder, image);
      await fs.promises.unlink(filename);
      throw new AppError("Product already exists!");
    }

    await this.storageProvider.save(image, "products");

    await this.productRepository.create({
      name,
      technical_description,
      image,
      category_id,
      supplier_id,
    });
  }
}

export { CreateProductUseCase };

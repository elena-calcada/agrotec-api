import { Product } from "@prisma/client";
import { inject, injectable } from "tsyringe";

import { AppError } from "../../../../shared/errors/AppError";
import { deleteFile } from "../../../../shared/utils/file";
import { IUpdateProductDTO } from "../../dtos/IUpdateProductDTO";
import { IProductsRepository } from "../../repositories/IProductsRepository";

@injectable()
class UpdateProductUseCase {
  constructor(
    @inject("ProductsRepository")
    private productsRepository: IProductsRepository
  ) {}

  async execute({
    id,
    name,
    technical_description,
    image,
    category_id,
    supplier_id,
  }: IUpdateProductDTO): Promise<Product> {
    if (
      !name ||
      !technical_description ||
      !image ||
      !category_id ||
      !supplier_id
    ) {
      throw new AppError("All fields must be filled!");
    }

    const productExists = await this.productsRepository.findById(id);

    if (!productExists) {
      throw new AppError("Product does not exists!");
    }

    await deleteFile(`./tmp/${productExists.image}`);

    const product = await this.productsRepository.updateProduct({
      id,
      name,
      technical_description,
      image,
      category_id,
      supplier_id,
    });

    return product;
  }
}

export { UpdateProductUseCase };

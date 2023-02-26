import { inject, injectable } from "tsyringe";

import { AppError } from "../../../../shared/errors/AppError";
import { IUpdateInfoProductDTO } from "../../dtos/IUpdateProductDTO";
import { Product } from "../../entities/product.entity";
import { IProductsRepository } from "../../repositories/IProductsRepository";

@injectable()
class UpdateInfoProductUseCase {
  constructor(
    @inject("ProductsRepository")
    private productsRepository: IProductsRepository
  ) {}

  async execute({
    id,
    name,
    technical_description,
    category_id,
    supplier_id,
  }: IUpdateInfoProductDTO): Promise<Product> {
    if (!name || !technical_description || !category_id || !supplier_id) {
      throw new AppError("All fields must be filled!");
    }

    const productExists = await this.productsRepository.findById(id);

    if (!productExists) {
      throw new AppError("Product does not exists!");
    }

    const product = await this.productsRepository.updateInfoProduct({
      id,
      name,
      technical_description,
      category_id,
      supplier_id,
    });

    return product;
  }
}

export { UpdateInfoProductUseCase };

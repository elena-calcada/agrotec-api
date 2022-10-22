import { inject, injectable } from "tsyringe";

import { AppError } from "../../../../shared/errors/AppError";
import { ICreateProductsDTO } from "../../dtos/ICreateProductsDTO";
import { IProductsRepository } from "../../repositories/IProductsRepository";

@injectable()
class CreateProductUseCase {
  constructor(
    @inject("ProductsRepository")
    private productRepository: IProductsRepository
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
      throw new AppError("Product already exists!");
    }

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

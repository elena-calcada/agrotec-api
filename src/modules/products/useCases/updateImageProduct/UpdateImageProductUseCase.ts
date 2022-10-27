import { inject, injectable } from "tsyringe";

import { AppError } from "../../../../shared/errors/AppError";
import { deleteFile } from "../../../../shared/utils/file";
import { IUpdateImageProductDTO } from "../../dtos/IUpdateImageProductDTO";
import { IProductsRepository } from "../../repositories/IProductsRepository";

@injectable()
class UpdateImageProductUseCase {
  constructor(
    @inject("ProductsRepository")
    private productsRepository: IProductsRepository
  ) {}
  async execute({ id, image }: IUpdateImageProductDTO) {
    if (!image) {
      throw new AppError("Image not found!");
    }

    const productExists = await this.productsRepository.findById(id);

    if (!productExists) {
      throw new AppError("Product does not exists!");
    }

    await deleteFile(`./tmp/${productExists.image}`);

    const product = await this.productsRepository.updateImageProduct({
      id,
      image,
    });

    return product;
  }
}

export { UpdateImageProductUseCase };

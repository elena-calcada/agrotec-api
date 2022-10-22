import { inject, injectable } from "tsyringe";

import { deleteFile } from "../../../../shared/utils/file";
import { IProductsRepository } from "../../repositories/IProductsRepository";

@injectable()
class DeleteProductUseCase {
  constructor(
    @inject("ProductsRepository")
    private productsRepository: IProductsRepository
  ) {}

  async execute(id: string): Promise<void> {
    const product = await this.productsRepository.findById(id);

    await deleteFile(`./tmp/${product.image}`);

    await this.productsRepository.delete(id);
  }
}

export { DeleteProductUseCase };

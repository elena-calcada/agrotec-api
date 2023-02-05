import { inject, injectable } from "tsyringe";

import { AppError } from "../../../../shared/errors/AppError";
import { IProductsRepository } from "../../../products/repositories/IProductsRepository";
import { ISupplierRepository } from "../../repositories/ISupplierRepository";

@injectable()
class DeleteSupplierUseCase {
  constructor(
    @inject("SupplierRepository")
    private supplierRepository: ISupplierRepository,
    @inject("ProductsRepository")
    private productsRepository: IProductsRepository
  ) {}
  async execute(id: string): Promise<void> {
    const supplierExists = await this.supplierRepository.findById(id);

    if (!supplierExists) {
      throw new AppError("Supplier does not exists!");
    }

    const products = await this.productsRepository.listBySupplier(id);

    if (products.length !== 0) {
      throw new AppError("Cannot delete supplier!");
    }

    await this.supplierRepository.delete(id);
  }
}

export { DeleteSupplierUseCase };

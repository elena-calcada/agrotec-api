import { Supplier } from "@prisma/client";
import { inject, injectable } from "tsyringe";

import { AppError } from "../../../../shared/errors/AppError";
import { ISupplierRepository } from "../../repositories/ISupplierRepository";

@injectable()
class DetailSupplierUseCase {
  constructor(
    @inject("SupplierRepository")
    private supplierRepository: ISupplierRepository
  ) {}
  async exceute(id: string): Promise<Supplier> {
    const supplier = await this.supplierRepository.findById(id);

    if (!supplier) {
      throw new AppError("Supplier does not exists!");
    }

    return supplier;
  }
}

export { DetailSupplierUseCase };

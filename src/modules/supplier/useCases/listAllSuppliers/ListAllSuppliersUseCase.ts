import { inject, injectable } from "tsyringe";

import { Supplier } from "../../entities/supplier.entity";
import { ISupplierRepository } from "../../repositories/ISupplierRepository";

@injectable()
class ListAllSuppliersUseCase {
  constructor(
    @inject("SupplierRepository")
    private supplierRepository: ISupplierRepository
  ) {}
  async execute(): Promise<Supplier[]> {
    const suppliers = await this.supplierRepository.listAll();

    return suppliers;
  }
}

export { ListAllSuppliersUseCase };

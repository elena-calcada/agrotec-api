import { inject, injectable } from "tsyringe";

import { AppError } from "../../../../shared/errors/AppError";
import { IUpdateSupplierDTO } from "../../dtos/IUpdateSupplierDTO";
import { Supplier } from "../../entities/supplier.entity";
import { ISupplierRepository } from "../../repositories/ISupplierRepository";

@injectable()
class UpdateSupplierUseCase {
  constructor(
    @inject("SupplierRepository")
    private supplierRepository: ISupplierRepository
  ) {}

  async execute({
    id,
    name,
    description,
  }: IUpdateSupplierDTO): Promise<Supplier> {
    const supplier = await this.supplierRepository.findById(id);

    if (!supplier) {
      throw new AppError("Supplier does not exists!");
    }

    if (!name || !description) {
      throw new AppError("Fill in all fields");
    }

    const supplierUpdated = await this.supplierRepository.update({
      id,
      name,
      description,
    });

    return supplierUpdated;
  }
}

export { UpdateSupplierUseCase };

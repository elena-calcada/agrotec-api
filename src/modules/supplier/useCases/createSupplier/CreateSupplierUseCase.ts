import { inject, injectable } from "tsyringe";

import { AppError } from "../../../../shared/errors/AppError";
import { Supplier } from "../../entities/supplier.entity";
import { ISupplierRepository } from "../../repositories/ISupplierRepository";

interface IRequest {
  name: string;
  description: string;
}

@injectable()
class CreateSupplierUseCase {
  constructor(
    @inject("SupplierRepository")
    private supplierRepository: ISupplierRepository
  ) {}
  async execute({ name, description }: IRequest): Promise<Supplier> {
    const supplierExists = await this.supplierRepository.findByName(name);

    if (supplierExists) {
      throw new AppError("Supplier already exists!");
    }

    const supplierCreated = Supplier.create({
      name,
      description,
    });

    const supplier = await this.supplierRepository.save(supplierCreated);

    return supplier;
  }
}

export { CreateSupplierUseCase };

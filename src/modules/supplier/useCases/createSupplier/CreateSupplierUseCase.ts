import { inject, injectable } from "tsyringe";

import { AppError } from "../../../../shared/errors/AppError";
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
  async execute({ name, description }: IRequest): Promise<void> {
    if (!name) {
      throw new AppError("Name is required");
    }
    const supplier = await this.supplierRepository.findByName(name);

    if (supplier) {
      throw new AppError("Supplier already exists!");
    }

    await this.supplierRepository.create({ name, description });
  }
}

export { CreateSupplierUseCase };

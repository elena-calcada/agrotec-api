import { inject, injectable } from "tsyringe";

import { IUpdateSupplierDTO } from "../../dtos/IUpdateSupplierDTO";
import { ISupplierRepository } from "../../repositories/ISupplierRepository";

@injectable()
class UpdateSupplierUseCase {
  constructor(
    @inject("SupplierRepository")
    private supplierRepository: ISupplierRepository
  ) {}

  async execute({ id, name, description }: IUpdateSupplierDTO): Promise<void> {
    await this.supplierRepository.update({ id, name, description });
  }
}

export { UpdateSupplierUseCase };

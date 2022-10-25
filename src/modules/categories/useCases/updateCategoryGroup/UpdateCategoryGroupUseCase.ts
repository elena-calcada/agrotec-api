import { inject, injectable } from "tsyringe";

import { AppError } from "../../../../shared/errors/AppError";
import { IUpdateCategoryGroupDTO } from "../../dtos/IUpdateCategoryGroupDTO";
import { ICategoryGroupRepository } from "../../repositories/ICategoryGroupRepository";

@injectable()
class UpdateCategoryGroupUseCase {
  constructor(
    @inject("CategoryGroupRepository")
    private categoryGroupRepository: ICategoryGroupRepository
  ) {}
  async execute({
    id,
    name,
    description,
  }: IUpdateCategoryGroupDTO): Promise<void> {
    if (!name) {
      throw new AppError("Name is required!");
    }

    await this.categoryGroupRepository.update({ id, name, description });
  }
}

export { UpdateCategoryGroupUseCase };

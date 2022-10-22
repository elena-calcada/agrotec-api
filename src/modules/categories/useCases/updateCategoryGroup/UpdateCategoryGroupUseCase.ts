import { inject, injectable } from "tsyringe";

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
    await this.categoryGroupRepository.update({ id, name, description });
  }
}

export { UpdateCategoryGroupUseCase };

import { inject, injectable } from "tsyringe";

import { AppError } from "../../../../shared/errors/AppError";
import { IUpdateCategoryGroupDTO } from "../../dtos/IUpdateCategoryGroupDTO";
import { CategoryGroup } from "../../entities/category-group.entity";
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
  }: IUpdateCategoryGroupDTO): Promise<CategoryGroup> {
    if (!name) {
      throw new AppError("Name is required!");
    }

    const groupExists = await this.categoryGroupRepository.findById(id);

    if (!groupExists) {
      throw new AppError("Category group does not exists");
    }

    const group = await this.categoryGroupRepository.update({
      id,
      name,
      description,
    });

    return group;
  }
}

export { UpdateCategoryGroupUseCase };

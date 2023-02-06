import { inject, injectable } from "tsyringe";

import { CategoryGroup } from "../../entities/category-group.entity";
import { ICategoryGroupRepository } from "../../repositories/ICategoryGroupRepository";

@injectable()
class ListAllCategoryGroupUseCase {
  constructor(
    @inject("CategoryGroupRepository")
    private categoryGroupRepository: ICategoryGroupRepository
  ) {}
  async execute(): Promise<CategoryGroup[]> {
    const groups = await this.categoryGroupRepository.listAllGroups();

    return groups;
  }
}

export { ListAllCategoryGroupUseCase };

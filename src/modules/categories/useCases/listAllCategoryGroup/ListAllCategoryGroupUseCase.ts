import { inject, injectable } from "tsyringe";

import { ICategoryGroupRepository } from "../../repositories/ICategoryGroupRepository";

@injectable()
class ListAllCategoryGroupUseCase {
  constructor(
    @inject("CategoryGroupRepository")
    private categoryGroupRepository: ICategoryGroupRepository
  ) {}
  async execute() {
    const groups = await this.categoryGroupRepository.listAllGroups();

    return groups;
  }
}

export { ListAllCategoryGroupUseCase };

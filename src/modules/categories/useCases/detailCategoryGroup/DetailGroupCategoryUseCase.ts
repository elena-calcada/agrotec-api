import { Group } from "@prisma/client";
import { inject, injectable } from "tsyringe";

import { AppError } from "../../../../shared/errors/AppError";
import { ICategoryGroupRepository } from "../../repositories/ICategoryGroupRepository";

@injectable()
class DetailGroupCategoryUseCase {
  constructor(
    @inject("CategoryGroupRepository")
    private categoryGroupRepository: ICategoryGroupRepository
  ) {}
  async execute(id: string): Promise<Group> {
    const group = await this.categoryGroupRepository.findById(id);

    if (!group) {
      throw new AppError("Group does not exists!");
    }

    return group;
  }
}

export { DetailGroupCategoryUseCase };

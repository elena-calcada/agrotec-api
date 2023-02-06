import { IUpdateCategoryGroupDTO } from "../dtos/IUpdateCategoryGroupDTO";
import { CategoryGroup } from "../entities/category-group.entity";

interface ICategoryGroupRepository {
  save(data: CategoryGroup): Promise<CategoryGroup>;
  findByName(name: string): Promise<CategoryGroup>;
  findById(id: string): Promise<CategoryGroup>;
  deleteGroup(id: string): Promise<void>;
  listAllGroups(): Promise<CategoryGroup[]>;
  update({
    id,
    name,
    description,
  }: IUpdateCategoryGroupDTO): Promise<CategoryGroup>;
}

export { ICategoryGroupRepository };

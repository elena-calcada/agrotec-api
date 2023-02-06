import { IUpdateCategoryGroupDTO } from "../../dtos/IUpdateCategoryGroupDTO";
import { CategoryGroup } from "../../entities/category-group.entity";
import { ICategoryGroupRepository } from "../ICategoryGroupRepository";

class CategoryGroupRepositoryInMemory implements ICategoryGroupRepository {
  categoryGroups: CategoryGroup[] = [];

  async save(data: CategoryGroup): Promise<CategoryGroup> {
    this.categoryGroups.push(data);
    return data;
  }
  async findByName(name: string): Promise<CategoryGroup> {
    const group = this.categoryGroups.find((group) => group.name === name);
    return group;
  }
  async findById(id: string): Promise<CategoryGroup> {
    const group = this.categoryGroups.find((group) => group.id === id);
    return group;
  }
  async deleteGroup(id: string): Promise<void> {
    const group = this.categoryGroups.find((group) => group.id === id);
    const index = this.categoryGroups.indexOf(group);
    this.categoryGroups.splice(index, 1);
  }
  async listAllGroups(): Promise<CategoryGroup[]> {
    const groups = this.categoryGroups;
    return groups;
  }
  async update({
    id,
    name,
    description,
  }: IUpdateCategoryGroupDTO): Promise<CategoryGroup> {
    const group = this.categoryGroups.find((group) => group.id === id);
    group.name = name;
    group.description = description;

    return group;
  }
}

export { CategoryGroupRepositoryInMemory };

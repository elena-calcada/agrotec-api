import { IUpdateCategoryDTO } from "../../dtos/IUpdateCategoryDTO";
import { Category } from "../../entities/category.entity";
import { ICategoriesRepository } from "../ICategoriesRepository";

class CategoryRepositoryInMemory implements ICategoriesRepository {
  categories: Category[] = [];

  async save(data: Category): Promise<Category> {
    this.categories.push(data);
    return data;
  }
  async findByName(name: string): Promise<Category> {
    const category = this.categories.find((category) => category.name === name);
    return category;
  }
  async findById(id: string): Promise<Category> {
    const category = this.categories.find((category) => category.id === id);
    return category;
  }
  async listAll(): Promise<Category[]> {
    const { categories } = this;
    return categories;
  }
  async listCategpeyByGroup(group_id: string): Promise<Category[]> {
    if (!group_id) {
      const { categories } = this;
      return categories;
    }
    const categories = this.categories.filter(
      (category) => category.group_id === group_id
    );
    return categories;
  }
  async deleteCategory(id: string): Promise<void> {
    const category = this.categories.find((category) => category.id === id);
    const index = this.categories.indexOf(category);
    this.categories.splice(index, 1);
  }
  async update({
    id,
    name,
    description,
    group_id,
  }: IUpdateCategoryDTO): Promise<Category> {
    const category = this.categories.find((category) => category.id === id);
    category.name = name;
    category.description = description;
    category.group_id = group_id;

    return category;
  }
}

export { CategoryRepositoryInMemory };

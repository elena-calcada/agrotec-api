import { IUpdateCategoryDTO } from "../dtos/IUpdateCategoryDTO";
import { Category } from "../entities/category.entity";

interface ICategoriesRepository {
  save(data: Category): Promise<Category>;
  findByName(name: string): Promise<Category>;
  findById(id: string): Promise<Category>;
  listAll(): Promise<Category[]>;
  listCategpeyByGroup(group_id: string): Promise<Category[]>;
  deleteCategory(id: string): Promise<void>;
  update({
    id,
    name,
    description,
    group_id,
  }: IUpdateCategoryDTO): Promise<Category>;
}

export { ICategoriesRepository };

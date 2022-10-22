import { Category } from "@prisma/client";

import { ICreateCategoryDTO } from "../dtos/ICreateCategoryDTO";

interface ICategoriesRepository {
  create({
    name,
    description,
    categoryGroup_id,
  }: ICreateCategoryDTO): Promise<void>;
  findByName(name: string): Promise<Category>;
  findById(id: string): Promise<Category>;
  listAll(): Promise<Category[]>;
  listCategpeyByGroup(group_id: string): Promise<Category[]>;
  deleteCategory(id: string): Promise<void>;
}

export { ICategoriesRepository };

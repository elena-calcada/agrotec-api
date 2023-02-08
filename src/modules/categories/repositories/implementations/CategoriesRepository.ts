import prismaClient from "../../../../shared/infra/prisma/prisma.config";
import { IUpdateCategoryDTO } from "../../dtos/IUpdateCategoryDTO";
import { Category } from "../../entities/category.entity";
import { ICategoriesRepository } from "../ICategoriesRepository";

class CategoriesRepository implements ICategoriesRepository {
  async save(data: Category): Promise<Category> {
    const category = await prismaClient.category.create({
      data: {
        name: data.name,
        description: data.description,
        group_id: data.group_id,
      },
    });

    return category;
  }

  async findByName(name: string): Promise<Category> {
    const category = await prismaClient.category.findFirst({
      where: {
        name,
      },
    });

    return category;
  }

  async findById(id: string): Promise<Category> {
    const category = await prismaClient.category.findUnique({
      where: {
        id,
      },
      include: {
        group: true,
      },
    });

    return category;
  }

  async listAll(): Promise<Category[]> {
    const categories = await prismaClient.category.findMany({
      orderBy: {
        name: "asc",
      },
      include: {
        group: true,
      },
    });

    return categories;
  }

  async listCategpeyByGroup(group_id?: string): Promise<Category[]> {
    const categories = await prismaClient.category.findMany({
      where: {
        group_id: group_id || undefined,
      },
      orderBy: {
        name: "asc",
      },
    });

    return categories;
  }

  async deleteCategory(id: string): Promise<void> {
    await prismaClient.category.delete({
      where: {
        id,
      },
    });
  }

  async update({
    id,
    name,
    description,
    group_id,
  }: IUpdateCategoryDTO): Promise<Category> {
    const category = await prismaClient.category.update({
      where: {
        id,
      },
      data: {
        name,
        description,
        group_id,
      },
    });

    return category;
  }
}

export { CategoriesRepository };

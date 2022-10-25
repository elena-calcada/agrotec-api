import { Category } from "@prisma/client";

import prismaClient from "../../../../prisma";
import { ICreateCategoryDTO } from "../../dtos/ICreateCategoryDTO";
import { IUpdateCategoryDTO } from "../../dtos/IUpdateCategoryDTO";
import { ICategoriesRepository } from "../ICategoriesRepository";

class CategoriesRepository implements ICategoriesRepository {
  async create({
    name,
    description,
    categoryGroup_id,
  }: ICreateCategoryDTO): Promise<void> {
    await prismaClient.category.create({
      data: {
        name,
        description,
        group_id: categoryGroup_id,
      },
    });
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
    categoryGroup_id,
  }: IUpdateCategoryDTO): Promise<void> {
    await prismaClient.category.update({
      where: {
        id,
      },
      data: {
        name,
        description,
        group_id: categoryGroup_id,
      },
    });
  }
}

export { CategoriesRepository };

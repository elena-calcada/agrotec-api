import prismaClient from "../../../../shared/infra/prisma/prisma.config";
import { IUpdateCategoryGroupDTO } from "../../dtos/IUpdateCategoryGroupDTO";
import { CategoryGroup } from "../../entities/category-group.entity";
import { ICategoryGroupRepository } from "../ICategoryGroupRepository";

class CategoryGroupRepository implements ICategoryGroupRepository {
  async save(data: CategoryGroup): Promise<CategoryGroup> {
    const group = await prismaClient.group.create({
      data: {
        name: data.name,
        description: data.description,
      },
    });

    return group;
  }

  async findByName(name: string): Promise<CategoryGroup> {
    const group = await prismaClient.group.findFirst({
      where: {
        name,
      },
    });

    return group;
  }

  async findById(id: string): Promise<CategoryGroup> {
    const group = await prismaClient.group.findUnique({
      where: {
        id,
      },
    });

    return group;
  }

  async deleteGroup(id: string): Promise<void> {
    await prismaClient.group.delete({
      where: {
        id,
      },
    });
  }

  async listAllGroups(): Promise<CategoryGroup[]> {
    const groups = await prismaClient.group.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return groups;
  }

  async update({
    id,
    name,
    description,
  }: IUpdateCategoryGroupDTO): Promise<CategoryGroup> {
    const group = await prismaClient.group.update({
      where: {
        id,
      },
      data: {
        name,
        description,
      },
    });

    return group;
  }
}

export { CategoryGroupRepository };

import { Group } from "@prisma/client";

import prismaClient from "../../../../prisma";
import { ICreateCategoryGroupDTO } from "../../dtos/ICreateCategoryGroupDTO";
import { IUpdateCategoryGroupDTO } from "../../dtos/IUpdateCategoryGroupDTO";
import { ICategoryGroupRepository } from "../ICategoryGroupRepository";

class CategoryGroupRepository implements ICategoryGroupRepository {
  async create({ name, description }: ICreateCategoryGroupDTO): Promise<void> {
    await prismaClient.group.create({
      data: {
        name,
        description,
      },
    });
  }

  async findByName(name: string): Promise<Group> {
    const group = await prismaClient.group.findFirst({
      where: {
        name,
      },
    });

    return group;
  }

  async findById(id: string): Promise<Group> {
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

  async listAllGroups(): Promise<Group[]> {
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
  }: IUpdateCategoryGroupDTO): Promise<void> {
    await prismaClient.group.update({
      where: {
        id,
      },
      data: {
        name,
        description,
      },
      select: {
        id: true,
        name: true,
        description: true,
      },
    });
  }
}

export { CategoryGroupRepository };

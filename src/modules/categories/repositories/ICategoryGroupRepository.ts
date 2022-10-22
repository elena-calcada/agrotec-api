import { Group } from "@prisma/client";

import { ICreateCategoryGroupDTO } from "../dtos/ICreateCategoryGroupDTO";
import { IUpdateCategoryGroupDTO } from "../dtos/IUpdateCategoryGroupDTO";

interface ICategoryGroupRepository {
  create({ name, description }: ICreateCategoryGroupDTO): Promise<void>;
  findByName(name: string): Promise<Group>;
  findById(id: string): Promise<Group>;
  deleteGroup(id: string): Promise<void>;
  listAllGroups(): Promise<Group[]>;
  update({ id, name, description }: IUpdateCategoryGroupDTO): Promise<void>;
}

export { ICategoryGroupRepository };

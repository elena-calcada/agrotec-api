import { User } from "@prisma/client";

import { ICreateUserDTO } from "../dtos/ICreateUserDTO";
import { IReturnUserDTO } from "../dtos/IReturnUserDTO";
import { IUpdateUserDTO } from "../dtos/IUpdateUserDTO";

interface IUsersRepository {
  create({ name, email, password }: ICreateUserDTO): Promise<void>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<IReturnUserDTO | null>;
  turnUserAdmin(id: string): Promise<User>;
  turnUserExecutor(id: string): Promise<User>;
  removeUserAccess(id: string): Promise<User>;
  deleteUser(id: string): Promise<void>;
  listAllUsers(): Promise<IReturnUserDTO[]>;
  detailUser(id: string): Promise<IReturnUserDTO>;
  updateUser({ id, name, password }: IUpdateUserDTO): Promise<void>;
}

export { IUsersRepository };

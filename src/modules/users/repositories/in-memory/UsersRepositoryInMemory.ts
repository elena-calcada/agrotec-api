import { v4 as uuid } from "uuid";

import { User } from "../../../../entities/User";
import { IReturnUserDTO } from "../../dtos/IReturnUserDTO";
import { IUpdateUserNameDTO } from "../../dtos/IUpdateUserNameDTO";
import { IUpdateUserPasswordDTO } from "../../dtos/IUpdateUserPasswordDTO";
import { IUsersRepository } from "../IUsersRepository";

class UsersRepositoryInMemory implements IUsersRepository {
  users: User[] = [];

  async create(user: User): Promise<IReturnUserDTO> {
    Object.assign(user, {
      id: uuid(),
      is_executor: false,
      is_admin: false,
      created_at: new Date(),
      updated_at: new Date(),
    });

    this.users.push(user);

    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = this.users.find((user) => user.email === email);
    return user;
  }

  async findById(id: string): Promise<IReturnUserDTO> {
    const user = this.users.find((user) => user.id === id);
    return user;
  }

  async turnUserAdmin(id: string): Promise<User> {
    const user = this.users.find((user) => user.id === id);
    user.is_admin = true;
    user.is_executor = true;

    return user;
  }

  async turnUserExecutor(id: string): Promise<User> {
    const user = this.users.find((user) => user.id === id);
    user.is_executor = true;

    return user;
  }

  async removeUserAccess(id: string): Promise<User> {
    const user = this.users.find((user) => user.id === id);
    user.is_admin = false;
    user.is_executor = false;

    return user;
  }

  async deleteUser(id: string): Promise<void> {
    const user = this.users.find((user) => user.id === id);
    const index = this.users.indexOf(user);
    this.users.splice(index, 1);
  }

  async listAllUsers(): Promise<IReturnUserDTO[]> {
    const allUsers = this.users;
    return allUsers;
  }

  async detailUser(id: string): Promise<IReturnUserDTO> {
    const user = this.users.find((user) => user.id === id);
    return user;
  }

  async updateUserPassword({
    id,
    password,
  }: IUpdateUserPasswordDTO): Promise<void> {
    const user = this.users.find((user) => user.id === id);
    user.password = password;
  }

  async updateUserName({
    id,
    name,
  }: IUpdateUserNameDTO): Promise<IReturnUserDTO> {
    const user = this.users.find((user) => user.id === id);
    user.name = name;

    return user;
  }
}

export { UsersRepositoryInMemory };

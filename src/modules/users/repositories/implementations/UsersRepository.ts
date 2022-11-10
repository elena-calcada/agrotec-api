import { User } from "@prisma/client";
import { hash } from "bcryptjs";

import prismaClient from "../../../../prisma";
import { ICreateUserDTO } from "../../dtos/ICreateUserDTO";
import { IReturnUserDTO } from "../../dtos/IReturnUserDTO";
import { IUpdateUserNameDTO } from "../../dtos/IUpdateUserNameDTO";
import { IUpdateUserPasswordDTO } from "../../dtos/IUpdateUserPasswordDTO";
import { IUsersRepository } from "../IUsersRepository";

class UsersRepository implements IUsersRepository {
  async create({
    name,
    email,
    password,
  }: ICreateUserDTO): Promise<IReturnUserDTO> {
    const user = await prismaClient.user.create({
      data: {
        name,
        email,
        password,
      },
    });

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await prismaClient.user.findFirst({
      where: {
        email,
      },
    });

    return user;
  }

  async findById(id: string): Promise<IReturnUserDTO | null> {
    const user = await prismaClient.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        is_admin: true,
        is_executor: true,
      },
    });

    return user;
  }

  async turnUserAdmin(id: string): Promise<User> {
    const user = await prismaClient.user.update({
      where: {
        id,
      },
      data: {
        is_admin: true,
        is_executor: true,
      },
    });

    return user;
  }

  async turnUserExecutor(id: string): Promise<User> {
    const user = await prismaClient.user.update({
      where: {
        id,
      },
      data: {
        is_admin: false,
        is_executor: true,
      },
    });

    return user;
  }

  async removeUserAccess(id: string): Promise<User> {
    const user = await prismaClient.user.update({
      where: {
        id,
      },
      data: {
        is_admin: false,
        is_executor: false,
      },
    });

    return user;
  }

  async deleteUser(id: string): Promise<void> {
    await prismaClient.user.delete({
      where: {
        id,
      },
    });
  }

  async listAllUsers(): Promise<IReturnUserDTO[]> {
    const users = await prismaClient.user.findMany({
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
        email: true,
        is_admin: true,
        is_executor: true,
      },
    });

    return users;
  }

  async detailUser(id: string): Promise<IReturnUserDTO> {
    const user = await prismaClient.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        is_admin: true,
        is_executor: true,
      },
    });

    return user;
  }

  async updateUserPassword({
    id,
    password,
  }: IUpdateUserPasswordDTO): Promise<void> {
    const passwordHash = await hash(password, 8);

    await prismaClient.user.update({
      where: {
        id,
      },
      data: {
        password: passwordHash,
      },
    });
  }

  async updateUserName({
    id,
    name,
  }: IUpdateUserNameDTO): Promise<IReturnUserDTO> {
    const user = await prismaClient.user.update({
      where: {
        id,
      },
      data: {
        name,
      },
    });

    return user;
  }
}

export { UsersRepository };

import { Supplier } from "@prisma/client";

import prismaClient from "../../../../prisma";
import { ICreateSupplierDTO } from "../../dtos/ICreateSupplierDTO";
import { IUpdateSupplierDTO } from "../../dtos/IUpdateSupplierDTO";
import { ISupplierRepository } from "../ISupplierRepository";

class SupplierRepository implements ISupplierRepository {
  async create({ name, description }: ICreateSupplierDTO): Promise<void> {
    await prismaClient.supplier.create({
      data: {
        name,
        description,
      },
    });
  }

  async findByName(name: string): Promise<Supplier> {
    const supplier = await prismaClient.supplier.findFirst({
      where: {
        name,
      },
    });

    return supplier;
  }

  async findById(id: string): Promise<Supplier> {
    const supplier = await prismaClient.supplier.findUnique({
      where: {
        id,
      },
    });

    return supplier;
  }

  async listAll(): Promise<Supplier[]> {
    const suppliers = await prismaClient.supplier.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return suppliers;
  }

  async delete(id: string): Promise<void> {
    await prismaClient.supplier.delete({
      where: {
        id,
      },
    });
  }

  async update({ id, name, description }: IUpdateSupplierDTO): Promise<void> {
    await prismaClient.supplier.update({
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

export { SupplierRepository };

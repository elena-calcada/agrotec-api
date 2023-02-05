import prismaClient from "../../../../shared/infra/prisma/prisma.config";
import { IUpdateSupplierDTO } from "../../dtos/IUpdateSupplierDTO";
import { Supplier } from "../../entities/supplier.entity";
import { ISupplierRepository } from "../ISupplierRepository";

class SupplierRepository implements ISupplierRepository {
  async save(data: Supplier): Promise<Supplier> {
    const supplier = await prismaClient.supplier.create({
      data: {
        name: data.name,
        description: data.description,
      },
    });

    return supplier;
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

  async update({
    id,
    name,
    description,
  }: IUpdateSupplierDTO): Promise<Supplier> {
    const supplier = await prismaClient.supplier.update({
      where: {
        id,
      },
      data: {
        name,
        description,
      },
    });

    return supplier;
  }
}

export { SupplierRepository };

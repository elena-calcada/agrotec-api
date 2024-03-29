import { Product } from "@prisma/client";

import prismaClient from "../../../../shared/infra/prisma/prisma.config";
import { IFilterProductDTO } from "../../dtos/IFilterProductDTO";
import { IUpdateImageProductDTO } from "../../dtos/IUpdateImageProductDTO";
import { IUpdateInfoProductDTO } from "../../dtos/IUpdateProductDTO";
import { IProductsRepository } from "../IProductsRepository";

class ProductsRepository implements IProductsRepository {
  async save(data: Product): Promise<Product> {
    const product = await prismaClient.product.create({
      data: {
        name: data.name,
        technical_description: data.technical_description,
        image: data.image,
        category_id: data.category_id,
        supplier_id: data.supplier_id,
      },
    });
    return product;
  }

  async findByName(name: string): Promise<Product> {
    const product = await prismaClient.product.findFirst({
      where: {
        name,
      },
    });

    return product;
  }

  async findById(id: string): Promise<Product> {
    const product = await prismaClient.product.findUnique({
      where: {
        id,
      },
      include: {
        category: true,
        supplier: true,
      },
    });

    return product;
  }

  async findByCategory(category_id: string): Promise<Product[]> {
    const products = await prismaClient.product.findMany({
      where: {
        category_id,
      },
      orderBy: {
        name: "asc",
      },
    });

    return products;
  }

  async findBySupplier(supplier_id: string): Promise<Product[]> {
    const products = await prismaClient.product.findMany({
      where: {
        supplier_id,
      },
      orderBy: {
        name: "asc",
      },
    });

    return products;
  }

  async delete(id: string): Promise<void> {
    await prismaClient.product.delete({
      where: {
        id,
      },
    });
  }

  async listAll(): Promise<Product[]> {
    const products = await prismaClient.product.findMany({
      orderBy: {
        name: "asc",
      },
      include: {
        category: true,
        supplier: true,
      },
    });

    return products;
  }

  async findByNameOrCategoryOrSupplierOrGroup({
    name,
    group_id,
    category_id,
    supplier_id,
  }: IFilterProductDTO): Promise<Product[]> {
    const products = await prismaClient.product.findMany({
      where: {
        name: {
          contains: name || undefined,
          mode: "insensitive",
        },
        category_id: category_id || undefined,
        supplier_id: supplier_id || undefined,
        category: {
          group_id: group_id || undefined,
        },
      },
      orderBy: {
        name: "asc",
      },
      include: {
        category: true,
        supplier: true,
      },
    });

    return products;
  }

  async listByCategory(category_id: string): Promise<Product[]> {
    const products = await prismaClient.product.findMany({
      where: {
        category_id,
      },
    });

    return products;
  }

  async listBySupplier(supplier_id: string): Promise<Product[]> {
    const products = await prismaClient.product.findMany({
      where: {
        supplier_id,
      },
    });

    return products;
  }

  async updateInfoProduct({
    id,
    name,
    technical_description,
    category_id,
    supplier_id,
  }: IUpdateInfoProductDTO): Promise<Product> {
    const product = await prismaClient.product.update({
      where: {
        id,
      },
      data: {
        name,
        technical_description,
        category_id,
        supplier_id,
      },
      include: {
        category: true,
        supplier: true,
      },
    });

    return product;
  }

  async updateImageProduct({
    id,
    image,
  }: IUpdateImageProductDTO): Promise<Product> {
    const product = await prismaClient.product.update({
      where: {
        id,
      },
      data: {
        image,
      },
      include: {
        category: true,
        supplier: true,
      },
    });

    return product;
  }
}

export { ProductsRepository };

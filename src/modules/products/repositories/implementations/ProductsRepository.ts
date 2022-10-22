import { Product } from "@prisma/client";

import prismaClient from "../../../../prisma";
import { ICreateProductsDTO } from "../../dtos/ICreateProductsDTO";
import { IFilterProductDTO } from "../../dtos/IFilterProductDTO";
import { IUpdateProductDTO } from "../../dtos/IUpdateProductDTO";
import { IProductsRepository } from "../IProductsRepository";

class ProductsRepository implements IProductsRepository {
  async create({
    name,
    technical_description,
    image,
    category_id,
    supplier_id,
  }: ICreateProductsDTO): Promise<void> {
    await prismaClient.product.create({
      data: {
        name,
        technical_description,
        image,
        category_id,
        supplier_id,
      },
    });
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

  async updateProduct({
    id,
    name,
    technical_description,
    image,
    category_id,
    supplier_id,
  }: IUpdateProductDTO): Promise<Product> {
    const product = await prismaClient.product.update({
      where: {
        id,
      },
      data: {
        name,
        technical_description,
        image,
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
}

export { ProductsRepository };

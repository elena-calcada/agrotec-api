import { Product } from "@prisma/client";

import { ICreateProductsDTO } from "../dtos/ICreateProductsDTO";
import { IFilterProductDTO } from "../dtos/IFilterProductDTO";
import { IUpdateProductDTO } from "../dtos/IUpdateProductDTO";

interface IProductsRepository {
  create({
    name,
    technical_description,
    image,
    category_id,
    supplier_id,
  }: ICreateProductsDTO): Promise<void>;
  findByName(name: string): Promise<Product>;
  findById(id: string): Promise<Product>;
  findByNameOrCategoryOrSupplierOrGroup({
    name,
    group_id,
    category_id,
    supplier_id,
  }: IFilterProductDTO): Promise<Product[]>;
  delete(id: string): Promise<void>;
  listAll(): Promise<Product[]>;
  listByCategory(category_id: string): Promise<Product[]>;
  listBySupplier(supplier_id: string): Promise<Product[]>;
  updateProduct({
    id,
    name,
    technical_description,
    image,
    category_id,
    supplier_id,
  }: IUpdateProductDTO): Promise<Product>;
}

export { IProductsRepository };

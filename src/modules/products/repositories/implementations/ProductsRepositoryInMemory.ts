import { IFilterProductDTO } from "../../dtos/IFilterProductDTO";
import { IUpdateImageProductDTO } from "../../dtos/IUpdateImageProductDTO";
import { IUpdateInfoProductDTO } from "../../dtos/IUpdateProductDTO";
import { Product } from "../../entities/product.entity";
import { IProductsRepository } from "../IProductsRepository";

class ProductsRepositoryInMemory implements IProductsRepository {
  products: Product[] = [];

  async save(data: Product): Promise<Product> {
    this.products.push(data);
    return data;
  }
  async findByName(name: string): Promise<Product> {
    const product = this.products.find((product) => product.name === name);
    return product;
  }
  async findById(id: string): Promise<Product> {
    const product = this.products.find((product) => product.id === id);
    return product;
  }
  async findByNameOrCategoryOrSupplierOrGroup({
    name,
    group_id,
    category_id,
    supplier_id,
  }: IFilterProductDTO): Promise<Product[]> {
    if (name && !group_id && !category_id && !supplier_id) {
      const products = this.products.filter((product) => product.name === name);
      return products;
    }
    if (name && !group_id && category_id && !supplier_id) {
      const products = this.products.filter(
        (product) =>
          product.name === name && product.category_id === category_id
      );
      return products;
    }
    if (name && !group_id && category_id && supplier_id) {
      const products = this.products.filter(
        (product) =>
          product.name === name &&
          product.category_id === category_id &&
          product.supplier_id === supplier_id
      );
      return products;
    }
    if (!name && !group_id && category_id && supplier_id) {
      const products = this.products.filter(
        (product) =>
          product.category_id === category_id &&
          product.supplier_id === supplier_id
      );
      return products;
    }

    const { products } = this;
    return products;
  }
  async delete(id: string): Promise<void> {
    const product = this.products.find((product) => product.id === id);
    const index = this.products.indexOf(product);
    this.products.splice(index, 1);
  }
  async listAll(): Promise<Product[]> {
    const { products } = this;
    return products;
  }
  async listByCategory(category_id: string): Promise<Product[]> {
    const products = this.products.filter(
      (product) => product.category_id === category_id
    );
    return products;
  }
  async listBySupplier(supplier_id: string): Promise<Product[]> {
    const products = this.products.filter(
      (product) => product.supplier_id === supplier_id
    );
    return products;
  }
  async updateInfoProduct({
    id,
    name,
    technical_description,
    category_id,
    supplier_id,
  }: IUpdateInfoProductDTO): Promise<Product> {
    const product = this.products.find((product) => product.id === id);
    product.name = name;
    product.technical_description = technical_description;
    product.category_id = category_id;
    product.supplier_id = supplier_id;

    return product;
  }
  async updateImageProduct({
    id,
    image,
  }: IUpdateImageProductDTO): Promise<Product> {
    const product = this.products.find((product) => product.id === id);
    product.image = image;

    return product;
  }
}

export { ProductsRepositoryInMemory };

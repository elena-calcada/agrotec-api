import { IFilterProductDTO } from "../dtos/IFilterProductDTO";
import { IUpdateImageProductDTO } from "../dtos/IUpdateImageProductDTO";
import { IUpdateInfoProductDTO } from "../dtos/IUpdateProductDTO";
import { Product } from "../entities/product.entity";

interface IProductsRepository {
  save(data: Product): Promise<Product>;
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
  updateInfoProduct({
    id,
    name,
    technical_description,
    category_id,
    supplier_id,
  }: IUpdateInfoProductDTO): Promise<Product>;
  updateImageProduct({ id, image }: IUpdateImageProductDTO): Promise<Product>;
}

export { IProductsRepository };

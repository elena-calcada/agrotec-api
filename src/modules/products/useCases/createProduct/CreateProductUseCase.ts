import { inject, injectable } from "tsyringe";

import { IStorageProvider } from "../../../../shared/container/providers/StorageProvider/IStorageProvider";
import { AppError } from "../../../../shared/errors/AppError";
import { ICategoriesRepository } from "../../../categories/repositories/ICategoriesRepository";
import { ISupplierRepository } from "../../../supplier/repositories/ISupplierRepository";
import { ICreateProductsDTO } from "../../dtos/ICreateProductsDTO";
import { Product } from "../../entities/product.entity";
import { IProductsRepository } from "../../repositories/IProductsRepository";

@injectable()
class CreateProductUseCase {
  constructor(
    @inject("ProductsRepository")
    private productRepository: IProductsRepository,
    @inject("StorageProvider")
    private storageProvider: IStorageProvider,
    @inject("CategoriesRepository")
    private categoriesRepository: ICategoriesRepository,
    @inject("SupplierRepository")
    private supplierRepository: ISupplierRepository
  ) {}
  async execute({
    name,
    technical_description,
    image,
    category_id,
    supplier_id,
  }: ICreateProductsDTO): Promise<Product> {
    const productExists = await this.productRepository.findByName(name);

    if (productExists) {
      await this.storageProvider.save(image, "products");
      await this.storageProvider.delete(image, "products");
      throw new AppError("Product already exists!");
    }

    const categoryExists = await this.categoriesRepository.findById(
      category_id
    );

    if (!categoryExists) {
      await this.storageProvider.save(image, "products");
      await this.storageProvider.delete(image, "products");
      throw new AppError("Categoty does not exists!");
    }

    const supplierExists = await this.supplierRepository.findById(supplier_id);

    if (!supplierExists) {
      await this.storageProvider.save(image, "products");
      await this.storageProvider.delete(image, "products");
      throw new AppError("Supplier does not exists!");
    }

    await this.storageProvider.save(image, "products");

    const productCreated = Product.create({
      name,
      technical_description,
      image,
      category_id,
      supplier_id,
    });

    const product = await this.productRepository.save(productCreated);

    return product;
  }
}

export { CreateProductUseCase };

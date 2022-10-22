import { container } from "tsyringe";

import { ICategoriesRepository } from "../../modules/categories/repositories/ICategoriesRepository";
import { ICategoryGroupRepository } from "../../modules/categories/repositories/ICategoryGroupRepository";
import { CategoriesRepository } from "../../modules/categories/repositories/implementations/CategoriesRepository";
import { CategoryGroupRepository } from "../../modules/categories/repositories/implementations/CategoryGroupRepository";
import { ProductsRepository } from "../../modules/products/repositories/implementations/ProductsRepository";
import { IProductsRepository } from "../../modules/products/repositories/IProductsRepository";
import { SupplierRepository } from "../../modules/supplier/repositories/implementations/SupplierRepository";
import { ISupplierRepository } from "../../modules/supplier/repositories/ISupplierRepository";
import { UsersRepository } from "../../modules/users/repositories/implementations/UsersRepository";
import { IUsersRepository } from "../../modules/users/repositories/IUsersRepository";

container.registerSingleton<IUsersRepository>(
  "UsersRepository",
  UsersRepository
);

container.registerSingleton<ICategoryGroupRepository>(
  "CategoryGroupRepository",
  CategoryGroupRepository
);

container.registerSingleton<ICategoriesRepository>(
  "CategoriesRepository",
  CategoriesRepository
);

container.registerSingleton<ISupplierRepository>(
  "SupplierRepository",
  SupplierRepository
);

container.registerSingleton<IProductsRepository>(
  "ProductsRepository",
  ProductsRepository
);

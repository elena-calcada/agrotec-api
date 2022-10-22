import { Router } from "express";

import { categoriesRoutes } from "./categories.routes";
import { productsRoutes } from "./products.routes";
import { suppliersRoutes } from "./suppliers.routes";
import { usersRoutes } from "./users.routes";

const router = Router();

router.use("/users", usersRoutes);

router.use("/categories", categoriesRoutes);

router.use("/suppliers", suppliersRoutes);

router.use("/products", productsRoutes);

export { router };

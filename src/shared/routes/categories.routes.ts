import { Router } from "express";

import { CreateCategoryController } from "../../modules/categories/useCases/createCategory/CreateCategoryController";
import { CreateCategoryGroupContrller } from "../../modules/categories/useCases/createCategoryGroup/CreateCategoryGroupController";
import { DeleteCategoryController } from "../../modules/categories/useCases/deleteCategory/DeleteCategoryController";
import { DeleteCategoryGroupController } from "../../modules/categories/useCases/deleteCategoryGroup/DeleteCategoryGroupController";
import { DetailCategoryController } from "../../modules/categories/useCases/detailCategory/DetailCategoryController";
import { DetailCategoryGroupController } from "../../modules/categories/useCases/detailCategoryGroup/DetailCategoryGroupController";
import { ListAllCatgoriesController } from "../../modules/categories/useCases/listAllCategories/ListAllCategoriesController";
import { ListAllCategoryGroupController } from "../../modules/categories/useCases/listAllCategoryGroup/ListAllCategoryGroupController";
import { ListCategoryByGroupController } from "../../modules/categories/useCases/listCategoryByGroup/ListCategoryByGroupController";
import { UpdateCategoryController } from "../../modules/categories/useCases/updateCategory/UpdateCategoryController";
import { UpdateCategoryGroupController } from "../../modules/categories/useCases/updateCategoryGroup/UpdateCategoryGroupController";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { ensureExecutor } from "../middlewares/ensureExecutor";

const categoriesRoutes = Router();

const createCategoryGroupController = new CreateCategoryGroupContrller();
const deleteCategoryGroupController = new DeleteCategoryGroupController();
const detailCategoryGroupController = new DetailCategoryGroupController();
const listAllCategoryGroupController = new ListAllCategoryGroupController();
const createCategoryController = new CreateCategoryController();
const listAllCategoriesController = new ListAllCatgoriesController();
const listAllCategoriesByGroupController = new ListCategoryByGroupController();
const detailCategoriesController = new DetailCategoryController();
const deleteCategoryController = new DeleteCategoryController();
const updateCategoryGroupController = new UpdateCategoryGroupController();
const updateCategoryController = new UpdateCategoryController();

categoriesRoutes.post(
  "/",
  ensureAuthenticated,
  ensureExecutor,
  createCategoryController.handle
);

categoriesRoutes.get(
  "/",
  ensureAuthenticated,
  ensureExecutor,
  listAllCategoriesController.handle
);

categoriesRoutes.put(
  "/",
  ensureAuthenticated,
  ensureExecutor,
  updateCategoryController.handle
);

categoriesRoutes.get(
  "/by-group",
  ensureAuthenticated,
  ensureExecutor,
  listAllCategoriesByGroupController.handle
);

categoriesRoutes.get(
  "/detail",
  ensureAuthenticated,
  ensureExecutor,
  detailCategoriesController.handle
);

categoriesRoutes.delete(
  "/",
  ensureAuthenticated,
  ensureExecutor,
  deleteCategoryController.handle
);

categoriesRoutes.post(
  "/group",
  ensureAuthenticated,
  ensureExecutor,
  createCategoryGroupController.handle
);

categoriesRoutes.delete(
  "/group",
  ensureAuthenticated,
  ensureExecutor,
  deleteCategoryGroupController.handle
);

categoriesRoutes.get(
  "/group/detail",
  ensureAuthenticated,
  ensureExecutor,
  detailCategoryGroupController.handle
);

categoriesRoutes.get(
  "/group",
  ensureAuthenticated,
  ensureExecutor,
  listAllCategoryGroupController.handle
);

categoriesRoutes.put(
  "/group",
  ensureAuthenticated,
  ensureExecutor,
  updateCategoryGroupController.handle
);

export { categoriesRoutes };

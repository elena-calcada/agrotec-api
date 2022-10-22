import { Router } from "express";
import multer from "multer";

import uploadConfig from "../../config/multer";
import { CreateProductController } from "../../modules/products/useCases/createProduct/CreateProductController";
import { DeleteProductController } from "../../modules/products/useCases/deleteProducts/DeleteProductsController";
import { DetailProductController } from "../../modules/products/useCases/detailProduct/DetailProductController";
import { FilterProductsController } from "../../modules/products/useCases/filterProducts/FilterProductsController";
import { ListAllProductsController } from "../../modules/products/useCases/listAllProducts/ListAllProductsController";
import { UpdateProductController } from "../../modules/products/useCases/updateProduct/UpdateProductController";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { ensureExecutor } from "../middlewares/ensureExecutor";

const productsRoutes = Router();

const upload = multer(uploadConfig.upload("./tmp"));

const createProductsController = new CreateProductController();
const listAllProductsController = new ListAllProductsController();
const filterProductsController = new FilterProductsController();
const detailProductController = new DetailProductController();
const updateProductController = new UpdateProductController();
const deleteProductController = new DeleteProductController();

productsRoutes.post(
  "/",
  ensureAuthenticated,
  ensureExecutor,
  upload.single("file"),
  createProductsController.handle
);

productsRoutes.get(
  "/",
  ensureAuthenticated,
  ensureExecutor,
  listAllProductsController.handle
);

productsRoutes.get(
  "/filter",
  ensureAuthenticated,
  ensureExecutor,
  filterProductsController.handle
);

productsRoutes.get(
  "/detail",
  ensureAuthenticated,
  ensureExecutor,
  detailProductController.handle
);

productsRoutes.put(
  "/",
  ensureAuthenticated,
  ensureExecutor,
  upload.single("file"),
  updateProductController.handle
);

productsRoutes.delete(
  "/",
  ensureAuthenticated,
  ensureExecutor,
  deleteProductController.handle
);

export { productsRoutes };

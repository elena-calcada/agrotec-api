import { Router } from "express";
import multer from "multer";

import uploadConfig from "../../config/upload";
import { CreateProductController } from "../../modules/products/useCases/createProduct/CreateProductController";
import { DeleteProductController } from "../../modules/products/useCases/deleteProducts/DeleteProductsController";
import { DetailProductController } from "../../modules/products/useCases/detailProduct/DetailProductController";
import { FilterProductsController } from "../../modules/products/useCases/filterProducts/FilterProductsController";
import { ListAllProductsController } from "../../modules/products/useCases/listAllProducts/ListAllProductsController";
import { UpdateImageProducController } from "../../modules/products/useCases/updateImageProduct/UpdateImageProductController";
import { UpdateInfoProductController } from "../../modules/products/useCases/updateInfoProduct/UpdateInfoProductController";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { ensureExecutor } from "../middlewares/ensureExecutor";

const productsRoutes = Router();

const upload = multer(uploadConfig);

const createProductsController = new CreateProductController();
const listAllProductsController = new ListAllProductsController();
const filterProductsController = new FilterProductsController();
const detailProductController = new DetailProductController();
const updateInfoProductController = new UpdateInfoProductController();
const deleteProductController = new DeleteProductController();
const updateImageProductController = new UpdateImageProducController();

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
  "/info",
  ensureAuthenticated,
  ensureExecutor,
  updateInfoProductController.handle
);

productsRoutes.put(
  "/image",
  ensureAuthenticated,
  ensureExecutor,
  upload.single("file"),
  updateImageProductController.hendle
);

productsRoutes.delete(
  "/",
  ensureAuthenticated,
  ensureExecutor,
  deleteProductController.handle
);

export { productsRoutes };

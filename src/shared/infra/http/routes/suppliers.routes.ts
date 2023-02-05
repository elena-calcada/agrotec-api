import { Router } from "express";

import { CreateSupplierController } from "../../../../modules/supplier/useCases/createSupplier/CreateSupplierController";
import { DeleteSupplierController } from "../../../../modules/supplier/useCases/deleteSupplier/DeleteSupplierController";
import { DetailSupplierController } from "../../../../modules/supplier/useCases/detailSupplier/DetailSupplierController";
import { ListAllSuppliersController } from "../../../../modules/supplier/useCases/listAllSuppliers/ListAllSupliersController";
import { UpdateSupplierController } from "../../../../modules/supplier/useCases/updateSupplier/UpdateSupplierController";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { ensureExecutor } from "../middlewares/ensureExecutor";

const suppliersRoutes = Router();

const createSupplierController = new CreateSupplierController();
const listAllSuppliersController = new ListAllSuppliersController();
const detailSupplierController = new DetailSupplierController();
const deleteSupplierController = new DeleteSupplierController();
const updateSupplierController = new UpdateSupplierController();

suppliersRoutes.post(
  "/",
  ensureAuthenticated,
  ensureExecutor,
  createSupplierController.hendle
);

suppliersRoutes.get(
  "/",
  ensureAuthenticated,
  ensureExecutor,
  listAllSuppliersController.handle
);

suppliersRoutes.get(
  "/detail",
  ensureAuthenticated,
  ensureExecutor,
  detailSupplierController.handle
);

suppliersRoutes.delete(
  "/:id",
  ensureAuthenticated,
  ensureExecutor,
  deleteSupplierController.handle
);

suppliersRoutes.put(
  "/",
  ensureAuthenticated,
  ensureExecutor,
  updateSupplierController.handle
);

export { suppliersRoutes };

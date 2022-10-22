import { Router } from "express";

import { AuthenticateUserController } from "../../modules/users/useCases/authenticateUser/AuthenticateUserController";
import { CreateUserController } from "../../modules/users/useCases/createUsers/CreateUserController";
import { DeleteUserController } from "../../modules/users/useCases/deleteUser/DeleteUserController";
import { DetailUserController } from "../../modules/users/useCases/detailUser/detailUserController";
import { ListAllUsersController } from "../../modules/users/useCases/listAllUsers/ListAllUsersController";
import { ListUserByIdController } from "../../modules/users/useCases/listUserById/ListUserByIdController";
import { RemoveUserAccessController } from "../../modules/users/useCases/removeUserAccess/RemoveUserAccessController";
import { TurnUserAdminController } from "../../modules/users/useCases/turnUserAdmin/TurnUserAdminController";
import { TurnUserExecutorController } from "../../modules/users/useCases/turnUserExecutor/TurnUserExecutorController";
import { UpdateUserController } from "../../modules/users/useCases/updateUser/UpdateUserController";
import { ensureAdmin } from "../middlewares/ensureAdmin";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

const usersRoutes = Router();

const createUserController = new CreateUserController();
const authenticateUserController = new AuthenticateUserController();
const turnUserExecutorController = new TurnUserExecutorController();
const turnUserAdminController = new TurnUserAdminController();
const removeUserAccessController = new RemoveUserAccessController();
const deleteUserController = new DeleteUserController();
const listAllUsersController = new ListAllUsersController();
const detailUserController = new DetailUserController();
const updateUserController = new UpdateUserController();
const listUserByIdController = new ListUserByIdController();

usersRoutes.post("/", createUserController.handle);

usersRoutes.post("/session", authenticateUserController.handle);

usersRoutes.put(
  "/executor",
  ensureAuthenticated,
  ensureAdmin,
  turnUserExecutorController.handle
);

usersRoutes.put(
  "/admin",
  ensureAuthenticated,
  ensureAdmin,
  turnUserAdminController.handle
);

usersRoutes.put(
  "/remove-access",
  ensureAuthenticated,
  ensureAdmin,
  removeUserAccessController.handle
);

usersRoutes.delete(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  deleteUserController.handle
);

usersRoutes.get(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  listAllUsersController.handle
);

usersRoutes.get("/detail", ensureAuthenticated, detailUserController.handle);

usersRoutes.get(
  "/detail/id",
  ensureAuthenticated,
  ensureAdmin,
  listUserByIdController.handle
);

usersRoutes.put("/update", ensureAuthenticated, updateUserController.handle);

export { usersRoutes };
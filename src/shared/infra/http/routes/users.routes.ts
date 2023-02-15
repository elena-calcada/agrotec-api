import { Router } from "express";

import { AuthenticateUserController } from "../../../../modules/users/useCases/authenticateUser/AuthenticateUserController";
import { CreateUserController } from "../../../../modules/users/useCases/createUsers/CreateUserController";
import { DeleteUserController } from "../../../../modules/users/useCases/deleteUser/DeleteUserController";
import { DetailUserController } from "../../../../modules/users/useCases/detailUser/DetailUserController";
import { ListAllUsersController } from "../../../../modules/users/useCases/listAllUsers/ListAllUsersController";
import { ListUserByIdController } from "../../../../modules/users/useCases/listUserById/ListUserByIdController";
import { RemoveUserAccessController } from "../../../../modules/users/useCases/removeUserAccess/RemoveUserAccessController";
import { TurnUserAdminController } from "../../../../modules/users/useCases/turnUserAdmin/TurnUserAdminController";
import { TurnUserExecutorController } from "../../../../modules/users/useCases/turnUserExecutor/TurnUserExecutorController";
import { UpdateUserNameController } from "../../../../modules/users/useCases/updateUserName/UpdateUserNameController";
import { UpdateUserPasswordController } from "../../../../modules/users/useCases/updateUserPassword/UpdateUserPasswordController";
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
const updateUserPasswordController = new UpdateUserPasswordController();
const listUserByIdController = new ListUserByIdController();
const updateUserNameController = new UpdateUserNameController();

usersRoutes.post("/", createUserController.handle);

usersRoutes.post("/login", authenticateUserController.handle);

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

usersRoutes.get("/me", ensureAuthenticated, detailUserController.handle);

usersRoutes.get(
  "/:id",
  ensureAuthenticated,
  ensureAdmin,
  listUserByIdController.handle
);

usersRoutes.put(
  "/password",
  ensureAuthenticated,
  updateUserPasswordController.handle
);

usersRoutes.put("/name", ensureAuthenticated, updateUserNameController.handle);

export { usersRoutes };

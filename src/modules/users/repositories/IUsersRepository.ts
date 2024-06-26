import { ICreateUserDTO } from "../dtos/ICreateUserDTO";
import { IReturnUserDTO } from "../dtos/IReturnUserDTO";
import { IUpdateUserNameDTO } from "../dtos/IUpdateUserNameDTO";
import { IUpdateUserPasswordDTO } from "../dtos/IUpdateUserPasswordDTO";
import { User } from "../entities/user.entity";

interface IUsersRepository {
  create({ name, email, password }: ICreateUserDTO): Promise<IReturnUserDTO>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<IReturnUserDTO | null>;
  turnUserAdmin(id: string): Promise<IReturnUserDTO>;
  turnUserExecutor(id: string): Promise<IReturnUserDTO>;
  removeUserAccess(id: string): Promise<IReturnUserDTO>;
  deleteUser(id: string): Promise<void>;
  listAllUsers(id: string): Promise<IReturnUserDTO[]>;
  detailUser(id: string): Promise<IReturnUserDTO>;
  updateUserPassword({ id, password }: IUpdateUserPasswordDTO): Promise<void>;
  updateUserName({ id, name }: IUpdateUserNameDTO): Promise<IReturnUserDTO>;
}

export { IUsersRepository };

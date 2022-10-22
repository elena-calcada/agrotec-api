import { Supplier } from "@prisma/client";

import { ICreateSupplierDTO } from "../dtos/ICreateSupplierDTO";
import { IUpdateSupplierDTO } from "../dtos/IUpdateSupplierDTO";

interface ISupplierRepository {
  create({ name, description }: ICreateSupplierDTO): Promise<void>;
  findByName(name: string): Promise<Supplier>;
  findById(id: string): Promise<Supplier>;
  listAll(): Promise<Supplier[]>;
  delete(id: string): Promise<void>;
  update({ id, name, description }: IUpdateSupplierDTO): Promise<void>;
}

export { ISupplierRepository };

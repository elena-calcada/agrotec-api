import { IUpdateSupplierDTO } from "../dtos/IUpdateSupplierDTO";
import { Supplier } from "../entities/supplier.entity";

interface ISupplierRepository {
  save(data: Supplier): Promise<Supplier>;
  findByName(name: string): Promise<Supplier>;
  findById(id: string): Promise<Supplier>;
  listAll(): Promise<Supplier[]>;
  delete(id: string): Promise<void>;
  update({ id, name, description }: IUpdateSupplierDTO): Promise<Supplier>;
}

export { ISupplierRepository };

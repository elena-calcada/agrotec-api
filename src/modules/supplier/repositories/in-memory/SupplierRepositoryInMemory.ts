import { IUpdateSupplierDTO } from "../../dtos/IUpdateSupplierDTO";
import { Supplier } from "../../entities/supplier.entity";
import { ISupplierRepository } from "../ISupplierRepository";

class SupplierRepositoryInMemory implements ISupplierRepository {
  suppliers: Supplier[] = [];

  async save(data: Supplier): Promise<Supplier> {
    this.suppliers.push(data);
    return data;
  }
  async findByName(name: string): Promise<Supplier> {
    const supplier = this.suppliers.find((supplier) => supplier.name === name);
    return supplier;
  }
  async findById(id: string): Promise<Supplier> {
    const supplier = this.suppliers.find((supplier) => supplier.id === id);
    return supplier;
  }
  async listAll(): Promise<Supplier[]> {
    const allSuppliers = this.suppliers;
    return allSuppliers;
  }
  async delete(id: string): Promise<void> {
    const supplier = this.suppliers.find((supplier) => supplier.id === id);
    const index = this.suppliers.indexOf(supplier);
    this.suppliers.splice(index, 1);
  }
  async update({
    id,
    name,
    description,
  }: IUpdateSupplierDTO): Promise<Supplier> {
    const supplier = this.suppliers.find((supplier) => supplier.id === id);
    supplier.name = name;
    supplier.description = description;

    return supplier;
  }
}

export { SupplierRepositoryInMemory };

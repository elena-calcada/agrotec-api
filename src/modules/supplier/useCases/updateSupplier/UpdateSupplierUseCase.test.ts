import "reflect-metadata";
import { describe, beforeEach, test, expect } from "vitest";

import { SupplierRepositoryInMemory } from "../../repositories/in-memory/SupplierRepositoryInMemory";
import { CreateSupplierUseCase } from "../createSupplier/CreateSupplierUseCase";
import { UpdateSupplierUseCase } from "./UpdateSupplierUseCase";

let supplierRepositoryInMemory: SupplierRepositoryInMemory;
let updateSupplierUseCase: UpdateSupplierUseCase;
let createSupplierUseCase: CreateSupplierUseCase;

describe("Update Supplier", () => {
  beforeEach(() => {
    supplierRepositoryInMemory = new SupplierRepositoryInMemory();
    updateSupplierUseCase = new UpdateSupplierUseCase(
      supplierRepositoryInMemory
    );
    createSupplierUseCase = new CreateSupplierUseCase(
      supplierRepositoryInMemory
    );
  });

  test("Should be able to update a supplier", async () => {
    const supplier = await createSupplierUseCase.execute({
      name: "name_one",
      description: "description_one",
    });

    expect(supplier.name).toEqual("name_one");
    expect(supplier.description).toEqual("description_one");

    await updateSupplierUseCase.execute({
      id: supplier.id,
      name: "name",
      description: "description",
    });

    expect(supplier.name).toEqual("name");
    expect(supplier.description).toEqual("description");
  });

  test("Should not be able to update a supplier if supplier does not exists", () => {
    expect(async () => {
      await updateSupplierUseCase.execute({
        id: "false_id",
        name: "name",
        description: "description",
      });
    }).rejects.toThrow("Supplier does not exists!");
  });

  test("Should not be able to update an supplier name if supplier name does not informed", async () => {
    const supplier = await createSupplierUseCase.execute({
      name: "name_one",
      description: "description_one",
    });

    expect(async () => {
      await updateSupplierUseCase.execute({
        id: supplier.id,
        name: "",
        description: "description_one",
      });
    }).rejects.toThrow("Name is required!");
  });

  test("Should be able to update an supplier name if supplier description does not informed", async () => {
    const supplier = await createSupplierUseCase.execute({
      name: "name_one",
      description: "description_one",
    });

    await updateSupplierUseCase.execute({
      id: supplier.id,
      name: "name_two",
      description: "",
    });

    expect(supplier.name).toEqual("name_two");
    expect(supplier.description).toEqual("");
  });
});

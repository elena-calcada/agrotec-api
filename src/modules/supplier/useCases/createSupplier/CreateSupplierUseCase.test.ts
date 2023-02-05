import "reflect-metadata";
import { describe, beforeEach, test, expect } from "vitest";

import { SupplierRepositoryInMemory } from "../../repositories/in-memory/SupplierRepositoryInMemory";
import { CreateSupplierUseCase } from "./CreateSupplierUseCase";

let supplierRepositoryInMemory: SupplierRepositoryInMemory;
let createSupplierUseCase: CreateSupplierUseCase;

describe("Create Supplier", () => {
  beforeEach(() => {
    supplierRepositoryInMemory = new SupplierRepositoryInMemory();
    createSupplierUseCase = new CreateSupplierUseCase(
      supplierRepositoryInMemory
    );
  });

  test("Should be able to save a new supplier", async () => {
    const supplier = await createSupplierUseCase.execute({
      name: "supplier_name",
      description: "supplier_description",
    });

    const supplierExists = await supplierRepositoryInMemory.findByName(
      supplier.name
    );

    expect(supplier).toHaveProperty("id");
    expect(supplier).toHaveProperty("created_at");
    expect(supplier.name).toEqual("supplier_name");

    expect(supplierExists.id).toEqual(supplier.id);
  });

  test("Should be able to save a new supplier without description", async () => {
    const supplier = await createSupplierUseCase.execute({
      name: "supplier_name",
      description: "",
    });

    const supplierExists = await supplierRepositoryInMemory.findByName(
      supplier.name
    );

    expect(supplier).toHaveProperty("id");
    expect(supplier).toHaveProperty("created_at");
    expect(supplier.name).toEqual("supplier_name");

    expect(supplierExists.id).toEqual(supplier.id);
  });

  test("Should not be able to save a supplier that already exists", async () => {
    await createSupplierUseCase.execute({
      name: "supplier_name",
      description: "supplier_description",
    });

    expect(async () => {
      await createSupplierUseCase.execute({
        name: "supplier_name",
        description: "description",
      });
    }).rejects.toThrow("Supplier already exists!");
  });
});

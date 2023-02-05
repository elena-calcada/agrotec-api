import "reflect-metadata";
import { describe, beforeEach, test, expect } from "vitest";

import { SupplierRepositoryInMemory } from "../../repositories/in-memory/SupplierRepositoryInMemory";
import { CreateSupplierUseCase } from "../createSupplier/CreateSupplierUseCase";
import { DetailSupplierUseCase } from "./DetailSupplierUseCase";

let supplierRepositoryInMemory: SupplierRepositoryInMemory;
let detailSupplierUseCase: DetailSupplierUseCase;
let createSupplierUseCase: CreateSupplierUseCase;

describe("Detail Supplier", () => {
  beforeEach(() => {
    supplierRepositoryInMemory = new SupplierRepositoryInMemory();
    detailSupplierUseCase = new DetailSupplierUseCase(
      supplierRepositoryInMemory
    );
    createSupplierUseCase = new CreateSupplierUseCase(
      supplierRepositoryInMemory
    );
  });

  test("Shound be able to access supplier dedail", async () => {
    const supplier = await createSupplierUseCase.execute({
      name: "supplier_name",
      description: "supplier_description",
    });

    const supplierDatail = await detailSupplierUseCase.exceute(supplier.id);

    expect(supplierDatail.id).toEqual(supplier.id);
  });

  test("Should not be able to access supplier detail if it does not exists", async () => {
    expect(async () => {
      await detailSupplierUseCase.exceute("incorrect_id");
    }).rejects.toThrow("Supplier does not exists!");
  });
});

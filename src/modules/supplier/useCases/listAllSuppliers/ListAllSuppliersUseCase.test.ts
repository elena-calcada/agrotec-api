import "reflect-metadata";
import { describe, beforeEach, test, expect } from "vitest";

import { SupplierRepositoryInMemory } from "../../repositories/in-memory/SupplierRepositoryInMemory";
import { CreateSupplierUseCase } from "../createSupplier/CreateSupplierUseCase";
import { ListAllSuppliersUseCase } from "./ListAllSuppliersUseCase";

let supplierRepositoryInMemory: SupplierRepositoryInMemory;
let listAllSuppliersUseCase: ListAllSuppliersUseCase;
let createSupplierUseCase: CreateSupplierUseCase;

describe("List All Suppliers", () => {
  beforeEach(() => {
    supplierRepositoryInMemory = new SupplierRepositoryInMemory();
    listAllSuppliersUseCase = new ListAllSuppliersUseCase(
      supplierRepositoryInMemory
    );
    createSupplierUseCase = new CreateSupplierUseCase(
      supplierRepositoryInMemory
    );
  });

  test("Should be able to list all suppliers", async () => {
    await createSupplierUseCase.execute({
      name: "name_one",
      description: "description_one",
    });

    await createSupplierUseCase.execute({
      name: "name_two",
      description: "description_two",
    });

    const suppliers = await listAllSuppliersUseCase.execute();

    expect(suppliers.length).toBe(2);
    expect(suppliers[0].name).toEqual("name_one");
    expect(suppliers[1].name).toEqual("name_two");
  });
});

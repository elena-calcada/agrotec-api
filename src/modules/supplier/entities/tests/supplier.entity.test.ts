import { test, expect, describe } from "vitest";

import { Supplier } from "../supplier.entity";

describe("Supplier Entity", () => {
  test("Should be able to create a new supplier", () => {
    const supplier = Supplier.create({
      name: "supplier_name",
      description: "supplier_description",
    });

    expect(supplier).toBeInstanceOf(Supplier);
    expect(supplier).toHaveProperty("id");
  });

  test("Should be able to create a new supplier without description", () => {
    const supplier = Supplier.create({
      name: "supplier_name",
      description: "",
    });

    expect(supplier).toBeInstanceOf(Supplier);
    expect(supplier).toHaveProperty("id");
  });

  test("Should not be able to create a new supplier without name", () => {
    expect(() => {
      Supplier.create({
        name: "",
        description: "supplier_description",
      });
    }).toThrow("Name is required");
  });
});

import { test, expect, describe } from "vitest";

import { Product } from "../product.entity";

describe("Product Entity", () => {
  test("Should be able to crate a new product", () => {
    const product = Product.create({
      name: "product_test",
      technical_description: "Description product_test",
      image: "image_test",
      category_id: "category_id",
      supplier_id: "supplier_id",
    });

    expect(product).toHaveProperty("id");
    expect(product).toBeInstanceOf(Product);
  });
  test("Should not be able to crate a new product if name does not informed", () => {
    expect(() => {
      Product.create({
        name: "",
        technical_description: "Description product_test",
        image: "image_test",
        category_id: "category_id",
        supplier_id: "supplier_id",
      });
    }).toThrow("All fields must be filled!");
  });
  test("Should not be able to crate a new product if image does not informed", () => {
    expect(() => {
      Product.create({
        name: "product_test",
        technical_description: "Description product_test",
        image: "",
        category_id: "category_id",
        supplier_id: "supplier_id",
      });
    }).toThrow("All fields must be filled!");
  });
  test("Should not be able to crate a new product if technical_description does not informed", () => {
    expect(() => {
      Product.create({
        name: "product_test",
        technical_description: "",
        image: "image_test",
        category_id: "category_id",
        supplier_id: "supplier_id",
      });
    }).toThrow("All fields must be filled!");
  });
  test("Should not be able to crate a new product if category_id does not informed", () => {
    expect(() => {
      Product.create({
        name: "product_test",
        technical_description: "Description product_test",
        image: "image_test",
        category_id: "",
        supplier_id: "supplier_id",
      });
    }).toThrow("All fields must be filled!");
  });
  test("Should not be able to crate a new product if supplier_id does not informed", () => {
    expect(() => {
      Product.create({
        name: "product_test",
        technical_description: "Description product_test",
        image: "image_test",
        category_id: "category_id",
        supplier_id: "",
      });
    }).toThrow("All fields must be filled!");
  });
});

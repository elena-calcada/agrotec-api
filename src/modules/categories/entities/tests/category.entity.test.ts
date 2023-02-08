import { test, expect, describe } from "vitest";

import { Category } from "../category.entity";

describe("Category Entity", () => {
  test("Should be able to create a new category", () => {
    const category = Category.create({
      name: "category_name",
      description: "category-description",
      group_id: "group_id",
    });

    expect(category).toBeInstanceOf(Category);
    expect(category).toHaveProperty("id");
  });

  test("Should be able to create a new category without description", () => {
    const category = Category.create({
      name: "category_name",
      description: "",
      group_id: "group_id",
    });

    expect(category).toBeInstanceOf(Category);
    expect(category).toHaveProperty("id");
  });

  test("Should not be able to create a new category without name", () => {
    expect(() => {
      Category.create({
        name: "",
        description: "category-description",
        group_id: "group_id",
      });
    }).toThrow("Name is required");
  });

  test("Should not be able to create a new category without group id", () => {
    expect(() => {
      Category.create({
        name: "category_name",
        description: "category-description",
        group_id: "",
      });
    }).toThrow("Group id is required");
  });
});

import { test, expect, describe } from "vitest";

import { CategoryGroup } from "../category-group.entity";

describe("Cateogry Group Entity", () => {
  test("Should be able to create a new category group", () => {
    const group = CategoryGroup.create({
      name: "group_name",
      description: "group_description",
    });

    expect(group).toBeInstanceOf(CategoryGroup);
    expect(group).toHaveProperty("id");
  });

  test("Should be able to create a new group without description", () => {
    const group = CategoryGroup.create({
      name: "group_name",
      description: "",
    });

    expect(group).toBeInstanceOf(CategoryGroup);
    expect(group).toHaveProperty("id");
  });

  test("Should not be able to create a new group without name", () => {
    expect(() => {
      CategoryGroup.create({
        name: "",
        description: "group_description",
      });
    }).toThrow("Name is required");
  });
});

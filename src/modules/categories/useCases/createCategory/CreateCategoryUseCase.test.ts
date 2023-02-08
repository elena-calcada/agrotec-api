import "reflect-metadata";
import { describe, beforeEach, test, expect } from "vitest";

import { CategoryRepositoryInMemory } from "../../repositories/in-memory/CategoryRepositoryInMemory";
import { CreateCategorysUseCase } from "./CreateCategoryUseCase";

let categoryRepositoryInMemory: CategoryRepositoryInMemory;
let createCategoryUseCase: CreateCategorysUseCase;

describe("Create Cateegory", () => {
  beforeEach(() => {
    categoryRepositoryInMemory = new CategoryRepositoryInMemory();
    createCategoryUseCase = new CreateCategorysUseCase(
      categoryRepositoryInMemory
    );
  });

  test("Should be able to save a new category", async () => {
    const category = await createCategoryUseCase.execute({
      name: "category_name",
      description: "category_description",
      group_id: "group_id",
    });

    const categoryCreated = await categoryRepositoryInMemory.findById(
      category.id
    );

    expect(category.name).toEqual(categoryCreated.name);
  });

  test("Should not be able to save a new category if category already exists", async () => {
    await createCategoryUseCase.execute({
      name: "category_name",
      description: "category_description",
      group_id: "group_id",
    });

    expect(async () => {
      await createCategoryUseCase.execute({
        name: "category_name",
        description: "description",
        group_id: "group_id",
      });
    }).rejects.toThrow("Category already exists!");
  });
});

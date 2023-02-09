import "reflect-metadata";
import { describe, beforeEach, test, expect } from "vitest";

import { CategoryGroupRepositoryInMemory } from "../../repositories/in-memory/CategoryGroupRepositoryInMemory";
import { CategoryRepositoryInMemory } from "../../repositories/in-memory/CategoryRepositoryInMemory";
import { CreateCategorysUseCase } from "../createCategory/CreateCategoryUseCase";
import { DetailCategoryUseCase } from "./DetailCategoryUseCase";

let categoryRepositoryInMemory: CategoryRepositoryInMemory;
let categoryGroupRepository: CategoryGroupRepositoryInMemory;
let createCategoryUseCase: CreateCategorysUseCase;
let detailCategoryUseCase: DetailCategoryUseCase;

describe("Detail Category", () => {
  beforeEach(() => {
    categoryRepositoryInMemory = new CategoryRepositoryInMemory();
    createCategoryUseCase = new CreateCategorysUseCase(
      categoryRepositoryInMemory,
      categoryGroupRepository
    );
    detailCategoryUseCase = new DetailCategoryUseCase(
      categoryRepositoryInMemory
    );
  });

  test("Should be able to access category detail", async () => {
    const category = await createCategoryUseCase.execute({
      name: "category_name",
      description: "category_description",
      group_id: "group_id",
    });

    const categoryDetail = await detailCategoryUseCase.execute(category.id);

    expect(categoryDetail.name).toEqual(category.name);
  });

  test("Should not be able to access category detail if category does not exists", async () => {
    expect(async () => {
      await detailCategoryUseCase.execute("inavlid_id");
    }).rejects.toThrow("Category does not exists!");
  });
});

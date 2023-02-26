import "reflect-metadata";
import { describe, beforeEach, test, expect } from "vitest";

import { CategoryGroupRepositoryInMemory } from "../../repositories/in-memory/CategoryGroupRepositoryInMemory";
import { CategoryRepositoryInMemory } from "../../repositories/in-memory/CategoryRepositoryInMemory";
import { CreateCategorysUseCase } from "../createCategory/CreateCategoryUseCase";
import { CreateCategoryGroupUseCase } from "../createCategoryGroup/CreateCategoryGroupUseCase";
import { DetailCategoryUseCase } from "./DetailCategoryUseCase";

let categoryGroupRepositoryInMemory: CategoryGroupRepositoryInMemory;
let createCategoryGroupUseCase: CreateCategoryGroupUseCase;
let categoryRepositoryInMemory: CategoryRepositoryInMemory;
let createCategoryUseCase: CreateCategorysUseCase;
let detailCategoryUseCase: DetailCategoryUseCase;

describe("Detail Category", () => {
  beforeEach(() => {
    categoryGroupRepositoryInMemory = new CategoryGroupRepositoryInMemory();
    createCategoryGroupUseCase = new CreateCategoryGroupUseCase(
      categoryGroupRepositoryInMemory
    );
    categoryRepositoryInMemory = new CategoryRepositoryInMemory();
    createCategoryUseCase = new CreateCategorysUseCase(
      categoryRepositoryInMemory,
      categoryGroupRepositoryInMemory
    );
    detailCategoryUseCase = new DetailCategoryUseCase(
      categoryRepositoryInMemory
    );
  });

  test("Should be able to access category detail", async () => {
    const group = await createCategoryGroupUseCase.execute({
      name: "group_name",
      description: "group_description",
    });

    const category = await createCategoryUseCase.execute({
      name: "category_name",
      description: "category_description",
      group_id: group.id,
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

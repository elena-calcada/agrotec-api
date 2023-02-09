import "reflect-metadata";
import { describe, beforeEach, test, expect } from "vitest";

import { CategoryGroupRepositoryInMemory } from "../../repositories/in-memory/CategoryGroupRepositoryInMemory";
import { CategoryRepositoryInMemory } from "../../repositories/in-memory/CategoryRepositoryInMemory";
import { CreateCategoryGroupUseCase } from "../createCategoryGroup/CreateCategoryGroupUseCase";
import { CreateCategorysUseCase } from "./CreateCategoryUseCase";

let categoryRepositoryInMemory: CategoryRepositoryInMemory;
let categoryGroupRepository: CategoryGroupRepositoryInMemory;
let createCategoryUseCase: CreateCategorysUseCase;
let createCategoryGroupUseCase: CreateCategoryGroupUseCase;

describe("Create Cateegory", () => {
  beforeEach(() => {
    categoryRepositoryInMemory = new CategoryRepositoryInMemory();
    categoryGroupRepository = new CategoryGroupRepositoryInMemory();
    createCategoryGroupUseCase = new CreateCategoryGroupUseCase(
      categoryGroupRepository
    );
    createCategoryUseCase = new CreateCategorysUseCase(
      categoryRepositoryInMemory,
      categoryGroupRepository
    );
  });

  test("Should be able to save a new category", async () => {
    const group = await createCategoryGroupUseCase.execute({
      name: "group_name",
      description: "group_description",
    });

    const category = await createCategoryUseCase.execute({
      name: "category_name",
      description: "category_description",
      group_id: group.id,
    });

    const categoryCreated = await categoryRepositoryInMemory.findById(
      category.id
    );

    expect(categoryCreated.name).toEqual(category.name);
  });

  test("Should not be able to save a new category if category already exists", async () => {
    const group = await createCategoryGroupUseCase.execute({
      name: "group_name",
      description: "group_description",
    });

    await createCategoryUseCase.execute({
      name: "category_name",
      description: "category_description",
      group_id: group.id,
    });

    expect(async () => {
      await createCategoryUseCase.execute({
        name: "category_name",
        description: "description",
        group_id: group.id,
      });
    }).rejects.toThrow("Category already exists!");
  });

  test("Should not be able to save a new category if category group does not exists", async () => {
    expect(async () => {
      await createCategoryUseCase.execute({
        name: "category_name",
        description: "category_description",
        group_id: "group_id",
      });
    }).rejects.toThrow("Category group does not exists!");
  });
});

import "reflect-metadata";
import { describe, beforeEach, test, expect } from "vitest";

import { CategoryGroupRepositoryInMemory } from "../../repositories/in-memory/CategoryGroupRepositoryInMemory";
import { CategoryRepositoryInMemory } from "../../repositories/in-memory/CategoryRepositoryInMemory";
import { CreateCategorysUseCase } from "../createCategory/CreateCategoryUseCase";
import { CreateCategoryGroupUseCase } from "../createCategoryGroup/CreateCategoryGroupUseCase";
import { DetailGroupCategoryUseCase } from "../detailCategoryGroup/DetailGroupCategoryUseCase";
import { DeleteCategoryGroupUseCase } from "./DeleteCategoryGroupUseCase";

let categoryGroupRepositoryInMemory: CategoryGroupRepositoryInMemory;
let createCategoryGroupUseCase: CreateCategoryGroupUseCase;
let deleteCategoryGroupUseCase: DeleteCategoryGroupUseCase;
let categoryRepositoryInMemory: CategoryRepositoryInMemory;
let detailGroupCategoryUseCase: DetailGroupCategoryUseCase;
let createCategoryUseCase: CreateCategorysUseCase;

describe("Delete Category Group", () => {
  beforeEach(() => {
    categoryGroupRepositoryInMemory = new CategoryGroupRepositoryInMemory();
    createCategoryGroupUseCase = new CreateCategoryGroupUseCase(
      categoryGroupRepositoryInMemory
    );
    detailGroupCategoryUseCase = new DetailGroupCategoryUseCase(
      categoryGroupRepositoryInMemory
    );
    categoryRepositoryInMemory = new CategoryRepositoryInMemory();
    deleteCategoryGroupUseCase = new DeleteCategoryGroupUseCase(
      categoryRepositoryInMemory,
      categoryGroupRepositoryInMemory
    );
    createCategoryUseCase = new CreateCategorysUseCase(
      categoryRepositoryInMemory
    );
  });

  test("Should be able to delete a category group", async () => {
    const group = await createCategoryGroupUseCase.execute({
      name: "group_name",
      description: "group_description",
    });

    await deleteCategoryGroupUseCase.execute(group.id);

    expect(async () => {
      await detailGroupCategoryUseCase.execute(group.id);
    }).rejects.toThrow("Group does not exists!");
  });

  test("Should not be able to delete a category group if category group does not exists", async () => {
    expect(async () => {
      await deleteCategoryGroupUseCase.execute("invalid_id");
    }).rejects.toThrow("Category Group does not exists");
  });

  test("Should not be able to delete a category group that has a category associated with it", async () => {
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
      await deleteCategoryGroupUseCase.execute(group.id);
    }).rejects.toThrow("Cannot delete group!");
  });
});

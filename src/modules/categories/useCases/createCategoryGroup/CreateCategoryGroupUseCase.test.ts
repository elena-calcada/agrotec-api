import "reflect-metadata";
import { describe, beforeEach, test, expect } from "vitest";

import { CategoryGroupRepositoryInMemory } from "../../repositories/in-memory/CategoryGroupRepositoryInMemory";
import { CreateCategoryGroupUseCase } from "./CreateCategoryGroupUseCase";

let categoryGroupRepositoryInMemory: CategoryGroupRepositoryInMemory;
let createCategoryGroupUseCase: CreateCategoryGroupUseCase;

describe("Create Category Group", () => {
  beforeEach(() => {
    categoryGroupRepositoryInMemory = new CategoryGroupRepositoryInMemory();
    createCategoryGroupUseCase = new CreateCategoryGroupUseCase(
      categoryGroupRepositoryInMemory
    );
  });

  test("Should be able to save a new category group", async () => {
    const group = await createCategoryGroupUseCase.execute({
      name: "group_name",
      description: "group_description",
    });

    const groupCreated = await categoryGroupRepositoryInMemory.findById(
      group.id
    );

    expect(groupCreated.name).toEqual(group.name);
  });

  test("Should not be able to save a new category group if gategory group already exists", async () => {
    await createCategoryGroupUseCase.execute({
      name: "group_name",
      description: "group_description",
    });

    expect(async () => {
      await createCategoryGroupUseCase.execute({
        name: "group_name",
        description: "group_description",
      });
    }).rejects.toThrow("Category group already exists!");
  });
});

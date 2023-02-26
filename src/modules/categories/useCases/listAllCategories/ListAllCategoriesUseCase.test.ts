import "reflect-metadata";
import { describe, beforeEach, test, expect } from "vitest";

import { CategoryGroupRepositoryInMemory } from "../../repositories/in-memory/CategoryGroupRepositoryInMemory";
import { CategoryRepositoryInMemory } from "../../repositories/in-memory/CategoryRepositoryInMemory";
import { CreateCategorysUseCase } from "../createCategory/CreateCategoryUseCase";
import { CreateCategoryGroupUseCase } from "../createCategoryGroup/CreateCategoryGroupUseCase";
import { ListAllCategoriesUseCase } from "./ListAllCategoriesUseCase";

let categoryGroupRepositoryInMemory: CategoryGroupRepositoryInMemory;
let createCategoryGroupUseCase: CreateCategoryGroupUseCase;
let categoryRepositoryInMemory: CategoryRepositoryInMemory;
let createCategoryUseCase: CreateCategorysUseCase;
let listAllCategoriesUseCase: ListAllCategoriesUseCase;

describe("List All Categories", () => {
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
    listAllCategoriesUseCase = new ListAllCategoriesUseCase(
      categoryRepositoryInMemory
    );
  });

  test("Should be able to list all categories", async () => {
    const group = await createCategoryGroupUseCase.execute({
      name: "group_name",
      description: "group_description",
    });

    await createCategoryUseCase.execute({
      name: "name_one",
      description: "description_one",
      group_id: group.id,
    });

    await createCategoryUseCase.execute({
      name: "name_two",
      description: "description_two",
      group_id: group.id,
    });

    const categories = await listAllCategoriesUseCase.execute();

    expect(categories.length).toBe(2);
    expect(categories[0].name).toEqual("name_one");
    expect(categories[1].name).toEqual("name_two");
  });
});
